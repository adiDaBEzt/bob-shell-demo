# Test file for GitHub automation
# This file intentionally has some issues for testing purposes

import os
import sys

def calculate_sum(a,b):
    # Missing space after comma in parameters
    result = a+b  # Missing spaces around operator
    return result

def unused_function():
    # This function is never called
    x = 10
    y = 20
    z = x + y
    print("This is an unused function")

class TestClass:
    def __init__(self):
        self.value = 100
    
    def get_value(self):
        return self.value
    
    def set_value(self, val):
        self.value = val

# TODO: Fix this hardcoded value
API_KEY = "sk-1234567890abcdef"  # Hardcoded API key (security issue)

# Unused import
from datetime import datetime

def main():
    # Missing docstring
    result = calculate_sum(5,10)
    print(f"Result: {result}")
    
    # Variable assigned but never used
    unused_var = "This is never used"
    
    obj = TestClass()
    print(obj.get_value())

if __name__ == "__main__":
    main()

# Made with Bob
