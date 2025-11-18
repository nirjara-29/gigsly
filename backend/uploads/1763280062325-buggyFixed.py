# buggy.py
"""
Fixed factorial program.
- Accepts non-negative integers.
- Returns factorial for inputs 0..15.
- Input validation and simple CLI included.
"""

import sys

def factorial_recursive(n: int) -> int:
    """Correct recursive factorial with proper base case."""
    if n == 0:
        return 1
    return n * factorial_recursive(n - 1)

def factorial_iterative(n: int) -> int:
    """Iterative factorial (safe, avoids recursion depth issues)."""
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

def factorial(n: int) -> int:
    """Main factorial function. Uses iterative implementation for safety."""
    if not isinstance(n, int):
        raise TypeError("Input must be an integer")
    if n < 0:
        raise ValueError("Input must be a non-negative integer")
    if n > 15:
        raise ValueError("Input must be <= 15 for this problem")
    # Use iterative; recursion is fine for 0..15 too.
    return factorial_iterative(n)

def run_cli():
    """Simple CLI: reads an integer from stdin and prints the factorial."""
    try:
        raw = input("Enter a non-negative integer (0..15): ").strip()
        if raw == "":
            print("No input provided.")
            return
        n = int(raw)
        result = factorial(n)
        print(result)
    except ValueError as ve:
        print(f"Error: {ve}")
    except TypeError as te:
        print(f"Error: {te}")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    # If script is run directly, run CLI
    run_cli()
