import fs from "node:fs/promises";
import path from "node:path";

const artifactsDir = path.resolve(process.cwd(), "artifacts");
const eventPath = process.env.GITHUB_EVENT_PATH;
const token = process.env.GITHUB_TOKEN;
const repoSlug = process.env.GITHUB_REPOSITORY;

if (!eventPath) {
  throw new Error("GITHUB_EVENT_PATH is required.");
}

if (!token) {
  throw new Error("GITHUB_TOKEN is required.");
}

if (!repoSlug || !repoSlug.includes("/")) {
  throw new Error("GITHUB_REPOSITORY must be set to owner/repo.");
}

const [owner, repo] = repoSlug.split("/");
const event = JSON.parse(await fs.readFile(eventPath, "utf8"));
const pullRequest = event.pull_request;

if (!pullRequest) {
  throw new Error("This script must run in a pull_request workflow.");
}

const prNumber = pullRequest.number;
const headSha = pullRequest.head?.sha;
const actor = process.env.GITHUB_ACTOR || "github-actions[bot]";
const bobExitCode = Number.parseInt(process.env.BOB_EXIT_CODE || "1", 10);
const maxInlineComments = toPositiveInt(process.env.BOB_REVIEW_MAX_INLINE_COMMENTS, 10);

const summaryMarker = "<!-- bob-review-summary -->";
const inlineMarker = "<!-- bob-review-inline -->";
const outputPath = path.join(artifactsDir, "bob-review-output.txt");
const changedLinesPath = path.join(artifactsDir, "changed-lines.json");

const changedLines = await readJsonFile(changedLinesPath, {});

let parseFailure = null;
let review = {
  summary: "",
  overall: "needs_human_review",
  findings: [],
};

if (bobExitCode === 0) {
  try {
    const rawOutput = await fs.readFile(outputPath, "utf8");
    review = normalizeReview(extractTaggedJson(rawOutput));
  } catch (error) {
    parseFailure = error;
  }
}

const validFindings = [];
const skipped = [];

if (!parseFailure && bobExitCode === 0) {
  for (const finding of review.findings) {
    if (!isLineCommentable(changedLines, finding.path, finding.line)) {
      skipped.push({
        ...finding,
        reason: "line is not part of the PR head-side changed lines",
      });
      continue;
    }
    validFindings.push(finding);
  }
}

const publishable = validFindings.slice(0, maxInlineComments);
for (const finding of validFindings.slice(maxInlineComments)) {
  skipped.push({
    ...finding,
    reason: `exceeded the inline comment limit of ${maxInlineComments}`,
  });
}

let deletions = 0;
if (!parseFailure && bobExitCode === 0) {
  deletions = await deletePriorInlineComments({
    owner,
    repo,
    prNumber,
    actor,
    inlineMarker,
  });
}

const summaryBody = renderSummary({
  summaryMarker,
  headSha,
  bobExitCode,
  parseFailure,
  review,
  publishable,
  skipped,
  deletedInlineComments: deletions,
});

await upsertSummaryComment({
  owner,
  repo,
  prNumber,
  actor,
  summaryMarker,
  body: summaryBody,
});

if (parseFailure) {
  throw parseFailure;
}

if (bobExitCode !== 0) {
  throw new Error(`Bob exited with code ${bobExitCode}.`);
}

for (const finding of publishable) {
  await createInlineComment({
    owner,
    repo,
    prNumber,
    headSha,
    inlineMarker,
    finding,
  });
}

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

async function readJsonFile(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function extractTaggedJson(text) {
    const candidates = [
      text.match(/<bob-review>\s*([\s\S]*?)\s*<\/bob-review>/i)?.[1],
      text.match(/```json\s*([\s\S]*?)\s*```/i)?.[1],
      text.match(/```\s*([\s\S]*?)\s*```/i)?.[1],
      findFirstJsonObject(text),
      text.trim(),
    ].filter(Boolean);

    for (const candidate of candidates) {
      try {
        return JSON.parse(candidate.trim());
      } catch {
        // Try the next candidate format.
      }
    }

    throw new Error(
      "Bob output did not contain parseable review JSON. Expected tagged JSON, fenced JSON, or a raw JSON object.",
    );
  }

function findFirstJsonObject(text) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      return null;
    }
    return text.slice(start, end + 1);
}

function normalizeReview(raw) {
  const summary = typeof raw.summary === "string" ? raw.summary.trim() : "";
  const overall = normalizeOverall(raw.overall);
  const findings = Array.isArray(raw.findings)
    ? raw.findings
        .map((finding) => normalizeFinding(finding))
        .filter(Boolean)
    : [];

  return { summary, overall, findings };
}

function normalizeOverall(value) {
  if (value === "no_issues" || value === "issues_found" || value === "needs_human_review") {
    return value;
  }
  return "needs_human_review";
}

function normalizeFinding(raw) {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const pathValue = typeof raw.path === "string" ? raw.path.trim() : "";
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const body = typeof raw.body === "string" ? raw.body.trim() : "";
  const line = Number.parseInt(String(raw.line ?? ""), 10);
  const severity = normalizeSeverity(raw.severity);

  if (!pathValue || !title || !body || !Number.isInteger(line) || line <= 0) {
    return null;
  }

  return {
    path: pathValue,
    title,
    body,
    line,
    severity,
  };
}

function normalizeSeverity(value) {
  if (value === "high" || value === "medium" || value === "low") {
    return value;
  }
  return "medium";
}

function isLineCommentable(changedLines, filePath, line) {
  const lines = changedLines[filePath];
  return Array.isArray(lines) && lines.includes(line);
}

function renderSummary({
  summaryMarker,
  headSha,
  bobExitCode,
  parseFailure,
  review,
  publishable,
  skipped,
  deletedInlineComments,
}) {
  const statusLine =
    bobExitCode !== 0
      ? "Technical failure while running Bob."
      : parseFailure
        ? "Bob ran, but its output could not be parsed."
        : review.overall === "no_issues"
          ? "No actionable issues found."
          : review.overall === "issues_found"
            ? `Actionable issues found: ${publishable.length}.`
            : "Bob recommends human follow-up.";

  const lines = [
    summaryMarker,
    "## Bob review",
    "",
    `- Status: ${statusLine}`,
    `- Commit: \`${headSha || "unknown"}\``,
    `- Generated: ${new Date().toISOString()}`,
    `- Cleared prior inline comments: ${deletedInlineComments}`,
  ];

  if (review.summary) {
    lines.push("", review.summary);
  }

  if (publishable.length > 0) {
    lines.push("", "### Findings");
    for (const finding of orderFindings(publishable)) {
      lines.push(`- \`${finding.severity}\` \`${finding.path}:${finding.line}\` ${finding.title}`);
    }
  }

  if (skipped.length > 0) {
    lines.push("", "### Skipped findings");
    for (const finding of skipped) {
      lines.push(`- \`${finding.path}:${finding.line}\` ${finding.title} (${finding.reason})`);
    }
  }

  if (parseFailure) {
    lines.push("", "### Parser error", "```text", parseFailure.message, "```");
  }

  if (bobExitCode !== 0) {
    lines.push(
      "",
      "### Execution note",
      "Bob exited non-zero. Inspect the workflow logs and `artifacts/bob-review-output.txt` from the run for details.",
    );
  }

  return `${lines.join("\n").trim()}\n`;
}

function orderFindings(findings) {
  const severityRank = { high: 0, medium: 1, low: 2 };
  return [...findings].sort((left, right) => {
    const bySeverity = severityRank[left.severity] - severityRank[right.severity];
    if (bySeverity !== 0) {
      return bySeverity;
    }
    const byPath = left.path.localeCompare(right.path);
    if (byPath !== 0) {
      return byPath;
    }
    return left.line - right.line;
  });
}

async function upsertSummaryComment({ owner, repo, prNumber, actor, summaryMarker, body }) {
  const comments = await paginate(
    `/repos/${owner}/${repo}/issues/${prNumber}/comments?per_page=100`,
  );

  const existing = comments.find(
    (comment) =>
      typeof comment.body === "string" &&
      comment.body.includes(summaryMarker) &&
      isOwnedByActor(comment.user?.login, actor),
  );

  if (existing) {
    await githubFetch(`/repos/${owner}/${repo}/issues/comments/${existing.id}`, {
      method: "PATCH",
      body: JSON.stringify({ body }),
    });
    return;
  }

  await githubFetch(`/repos/${owner}/${repo}/issues/${prNumber}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

async function deletePriorInlineComments({ owner, repo, prNumber, actor, inlineMarker }) {
  const comments = await paginate(
    `/repos/${owner}/${repo}/pulls/${prNumber}/comments?per_page=100`,
  );

  let deleted = 0;

  for (const comment of comments) {
    if (
      typeof comment.body !== "string" ||
      !comment.body.includes(inlineMarker) ||
      !isOwnedByActor(comment.user?.login, actor)
    ) {
      continue;
    }

    await githubFetch(`/repos/${owner}/${repo}/pulls/comments/${comment.id}`, {
      method: "DELETE",
    });
    deleted += 1;
  }

  return deleted;
}

function isOwnedByActor(commentLogin, actor) {
  return commentLogin === actor || commentLogin === "github-actions[bot]";
}

async function createInlineComment({ owner, repo, prNumber, headSha, inlineMarker, finding }) {
  const body = `${inlineMarker}
### ${finding.title}
Severity: \`${finding.severity}\`

${finding.body}
`;

  await githubFetch(`/repos/${owner}/${repo}/pulls/${prNumber}/comments`, {
    method: "POST",
    body: JSON.stringify({
      body,
      commit_id: headSha,
      path: finding.path,
      line: finding.line,
      side: "RIGHT",
    }),
  });
}

async function paginate(initialPath) {
  const results = [];
  let nextPath = initialPath;

  while (nextPath) {
    const response = await githubFetch(nextPath, { method: "GET" }, true);
    const page = await response.json();
    results.push(...page);
    nextPath = parseNextLink(response.headers.get("link"));
  }

  return results;
}

function parseNextLink(linkHeader) {
  if (!linkHeader) {
    return null;
  }

  for (const part of linkHeader.split(",")) {
    const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match && match[2] === "next") {
      const url = new URL(match[1]);
      return `${url.pathname}${url.search}`;
    }
  }

  return null;
}

async function githubFetch(apiPath, init, returnResponse = false) {
  const response = await fetch(`https://api.github.com${apiPath}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API ${init.method || "GET"} ${apiPath} failed: ${response.status} ${text}`);
  }

  if (returnResponse) {
    return response;
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}
