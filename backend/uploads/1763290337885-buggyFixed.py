"""
Factorial Program (Fixed Version)
This function computes factorial using a safe tail-recursive approach.
It includes full input validation, stack-overflow protection, and tests.
"""

def factorial(n):
    # -------- Input Validation --------
    if not isinstance(n, int):
        raise ValueError("Input must be an integer.")
    if n < 0:
        raise ValueError("Factorial is not defined for negative numbers.")
    if n > 15:
        raise ValueError("Input too large — maximum allowed is 15.")

    # -------- Stack Overflow Guard --------
    MAX_DEPTH = 20
    if n > MAX_DEPTH:
        raise RecursionError("Input too deep, potential stack overflow.")

    # -------- Tail-Recursive Efficient Implementation --------
    def helper(x, acc):
        if x == 0 or x == 1:
            return acc
        return helper(x - 1, acc * x)

    return helper(n, 1)


def run_tests():
    print("Running factorial tests for inputs 0 to 15...")
    expected = [
        1, 1, 2, 6, 24, 120, 720, 5040,
        40320, 362880, 3628800, 39916800,
        479001600, 6227020800, 87178291200, 1307674368000
    ]

    for i in range(16):
        result = factorial(i)
        assert result == expected[i], f"Test failed for {i}"
    print("All tests passed!")


if __name__ == "__main__":
    try:
        run_tests()
        user_input = input("Enter a number (0–15): ")
        n = int(user_input)
        print("Factorial:", factorial(n))
    except Exception as e:
        print("Error:", e)
