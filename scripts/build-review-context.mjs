import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

const artifactsDir = path.resolve(process.cwd(), "artifacts");
const eventPath = process.env.GITHUB_EVENT_PATH;

if (!eventPath) {
  throw new Error("GITHUB_EVENT_PATH is required.");
}

const event = JSON.parse(await fs.readFile(eventPath, "utf8"));
const pullRequest = event.pull_request;

if (!pullRequest) {
  throw new Error("This script must run in a pull_request workflow.");
}

const baseSha = process.env.BASE_SHA || pullRequest.base?.sha;
const headSha = process.env.HEAD_SHA || pullRequest.head?.sha;

if (!baseSha || !headSha) {
  throw new Error("BASE_SHA and HEAD_SHA must resolve to valid commit SHAs.");
}

const maxFiles = toPositiveInt(process.env.BOB_REVIEW_MAX_FILES, 25);
const maxPatchChars = toPositiveInt(process.env.BOB_REVIEW_MAX_PATCH_CHARS, 120000);
const maxFileChars = toPositiveInt(process.env.BOB_REVIEW_MAX_FILE_CHARS, 12000);
const contextFileLimit = toPositiveInt(process.env.BOB_REVIEW_CONTEXT_FILE_LIMIT, 8);
const compareBaseSha =
  process.env.COMPARE_BASE_SHA || git(["merge-base", baseSha, headSha]).trim();

await fs.mkdir(artifactsDir, { recursive: true });

const changedFiles = getChangedFiles(compareBaseSha, headSha).slice(0, maxFiles);
const changedPaths = changedFiles.map((file) => file.path);
const patch = getPatch(compareBaseSha, headSha, changedPaths, maxPatchChars);
const changedLines = getChangedLines(compareBaseSha, headSha, changedPaths);
const fileSnapshots = await getFileSnapshots(changedFiles, maxFileChars, contextFileLimit);

const context = renderContext({
  pullRequest,
  compareBaseSha,
  baseSha,
  headSha,
  changedFiles,
  patch,
  fileSnapshots,
});

await fs.writeFile(path.join(artifactsDir, "review-context.md"), context, "utf8");
await fs.writeFile(
  path.join(artifactsDir, "changed-lines.json"),
  JSON.stringify(changedLines, null, 2),
  "utf8",
);
await fs.writeFile(
  path.join(artifactsDir, "review-metadata.json"),
  JSON.stringify(
    {
      baseSha,
      compareBaseSha,
      headSha,
      prNumber: pullRequest.number,
      repo: process.env.GITHUB_REPOSITORY || "",
      changedFiles,
    },
    null,
    2,
  ),
  "utf8",
);

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function git(args) {
  return execFileSync("git", args, {
    cwd: process.cwd(),
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
}

function getChangedFiles(base, head) {
  const output = git(["diff", "--name-status", `${base}..${head}`]).trim();
  if (!output) {
    return [];
  }

  return output
    .split("\n")
    .map((line) => parseNameStatus(line))
    .filter(Boolean);
}

function parseNameStatus(line) {
  const parts = line.split("\t").filter(Boolean);
  if (parts.length < 2) {
    return null;
  }

  const status = parts[0];

  if (status.startsWith("R") || status.startsWith("C")) {
    return {
      status,
      previousPath: parts[1],
      path: parts[2],
    };
  }

  return {
    status,
    previousPath: null,
    path: parts[1],
  };
}

function getPatch(base, head, files, maxChars) {
  if (files.length === 0) {
    return "No changed files were detected between the base and head commits.";
  }

  const output = git([
    "diff",
    "--no-color",
    "--unified=3",
    `${base}..${head}`,
    "--",
    ...files,
  ]);

  if (output.length <= maxChars) {
    return output;
  }

  return `${output.slice(0, maxChars)}\n\n[diff truncated after ${maxChars} characters]`;
}

function getChangedLines(base, head, files) {
  const linesByPath = {};

  if (files.length === 0) {
    return linesByPath;
  }

  const diff = git([
    "diff",
    "--no-color",
    "--unified=0",
    `${base}..${head}`,
    "--",
    ...files,
  ]);

  let currentPath = null;
  let nextNewLine = null;

  for (const line of diff.split("\n")) {
    if (line.startsWith("+++ ")) {
      const rawPath = line.slice(4).trim();
      currentPath = rawPath === "/dev/null" ? null : stripPrefix(rawPath, "b/");
      if (currentPath && !linesByPath[currentPath]) {
        linesByPath[currentPath] = [];
      }
      continue;
    }

    if (line.startsWith("@@")) {
      const match = line.match(/\+(\d+)(?:,(\d+))?/);
      if (!match) {
        nextNewLine = null;
        continue;
      }
      nextNewLine = Number.parseInt(match[1], 10);
      continue;
    }

    if (!currentPath || nextNewLine === null) {
      continue;
    }

    if (line.startsWith("+") && !line.startsWith("+++")) {
      linesByPath[currentPath].push(nextNewLine);
      nextNewLine += 1;
      continue;
    }

    if (line.startsWith(" ")) {
      nextNewLine += 1;
    }
  }

  return linesByPath;
}

function stripPrefix(value, prefix) {
  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}

async function getFileSnapshots(files, maxChars, limit) {
  const snapshots = [];

  for (const file of files) {
    if (snapshots.length >= limit) {
      break;
    }

    if (file.status === "D") {
      continue;
    }

    try {
      const content = await fs.readFile(path.resolve(process.cwd(), file.path), "utf8");
      snapshots.push({
        path: file.path,
        truncated: content.length > maxChars,
        content: withLineNumbers(content.slice(0, maxChars)),
      });
    } catch (error) {
      snapshots.push({
        path: file.path,
        truncated: false,
        content: `[unavailable: ${error.message}]`,
      });
    }
  }

  return snapshots;
}

function withLineNumbers(content) {
  return content
    .split("\n")
    .map((line, index) => `${String(index + 1).padStart(4, " ")} | ${line}`)
    .join("\n");
}

function renderContext({
  pullRequest,
  compareBaseSha,
  baseSha,
  headSha,
  changedFiles,
  patch,
  fileSnapshots,
}) {
  const changedFilesSection = changedFiles.length
    ? changedFiles
        .map((file) => {
          if (file.previousPath) {
            return `- \`${file.status}\` \`${file.previousPath}\` -> \`${file.path}\``;
          }
          return `- \`${file.status}\` \`${file.path}\``;
        })
        .join("\n")
    : "- No changed files detected.";

  const snapshotSection = fileSnapshots.length
    ? fileSnapshots
        .map(
          (snapshot) => [
            `### ${snapshot.path}`,
            "",
            "```text",
            snapshot.content,
            snapshot.truncated ? "[file snapshot truncated]" : "",
            "```",
          ]
            .filter(Boolean)
            .join("\n"),
        )
        .join("\n\n")
    : "_No file snapshots captured._";

  return `# Pull Request Review Context

## PR metadata
- Repository: \`${process.env.GITHUB_REPOSITORY || "unknown"}\`
- PR number: ${pullRequest.number}
- Title: ${pullRequest.title}
- Author: ${pullRequest.user?.login || "unknown"}
- Base branch: \`${pullRequest.base?.ref || "unknown"}\`
- Head branch: \`${pullRequest.head?.ref || "unknown"}\`
- Base branch SHA: \`${baseSha}\`
- Merge-base SHA: \`${compareBaseSha}\`
- Head SHA: \`${headSha}\`
- URL: ${pullRequest.html_url}

## Review rubric
- Focus on correctness, security, risky logic, and maintainability.
- Ignore pure style and formatting nits.
- Only raise findings that are actionable and evidenced by the diff.
- Prefer findings tied to changed lines on the PR head side.

## Changed files
${changedFilesSection}

## Unified diff
\`\`\`diff
${patch}
\`\`\`

## Current file snapshots
${snapshotSection}
`;
}
