def is_palindrome(n):
    """Check if a number is a palindrome."""
    s = str(n)
    return s == s[::-1]


def generate_palindromes(limit):
    """Generate all palindrome numbers up to the given limit."""
    palindromes = [n for n in range(1, limit + 1) if is_palindrome(n)]
    return palindromes


def generate_palindromes_in_range(start, end):
    """Generate all palindrome numbers within a given range."""
    palindromes = [n for n in range(start, end + 1) if is_palindrome(n)]
    return palindromes


def generate_first_n_palindromes(n):
    """Generate the first N palindrome numbers."""
    palindromes = []
    num = 1
    while len(palindromes) < n:
        if is_palindrome(num):
            palindromes.append(num)
        num += 1
    return palindromes


def main():
    print("=" * 50)
    print("       PALINDROME NUMBER GENERATOR")
    print("=" * 50)

    # Example 1: Generate palindromes up to 1000
    limit = 1000
    palindromes_up_to = generate_palindromes(limit)
    print(f"\n1. Palindrome numbers up to {limit}:")
    print(palindromes_up_to)
    print(f"   Total count: {len(palindromes_up_to)}")

    # Example 2: Generate palindromes in a range
    start, end = 100, 10000
    palindromes_in_range = generate_palindromes_in_range(start, end)
    print(f"\n2. Palindrome numbers between {start} and {end}:")
    print(palindromes_in_range)
    print(f"   Total count: {len(palindromes_in_range)}")

    # Example 3: Generate first N palindromes
    n = 20
    first_n = generate_first_n_palindromes(n)
    print(f"\n3. First {n} palindrome numbers:")
    print(first_n)

    # Example 4: Check a specific number
    print("\n4. Check specific numbers:")
    test_numbers = [121, 123, 1331, 12321, 99999, 12345]
    for num in test_numbers:
        result = "✅ Palindrome" if is_palindrome(num) else "❌ Not a Palindrome"
        print(f"   {num} -> {result}")

    print("\n" + "=" * 50)


if __name__ == "__main__":
    main()
