import math

def sieve_of_atkin(limit):
    if limit < 2:
        return []
    
    # Initialize sieve
    res = [False] * (limit + 1)
    if limit >= 2: res[2] = True
    if limit >= 3: res[3] = True

    # Main loops up to sqrt(limit)
    x = 1
    while x * x <= limit:
        y = 1
        while y * y <= limit:
            n = 4 * x * x + y * y
            if n <= limit and (n % 12 == 1 or n % 12 == 5):
                res[n] ^= True

            n = 3 * x * x + y * y
            if n <= limit and n % 12 == 7:
                res[n] ^= True

            n = 3 * x * x - y * y
            if x > y and n <= limit and n % 12 == 11:
                res[n] ^= True
            
            y += 1
        x += 1

    # Eliminate squares of primes
    r = 5
    while r * r <= limit:
        if res[r]:
            for i in range(r * r, limit + 1, r * r):
                res[i] = False
        r += 1

    return [i for i, prime in enumerate(res) if prime]
