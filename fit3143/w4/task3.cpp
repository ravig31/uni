#include <chrono>
#include <cmath>
#include <iostream>
#include <vector>
#include <omp.h>

#define ll long long

std::vector<int> getPrimesToSqrtN(int k) {
    std::vector<bool> isComp(k + 1, false);
    isComp[0] = isComp[1] = true;
    for (int p = 2; (long long)p * p <= k; ++p) {
		// if the value is a prime factor below k find all multiples of 
		// the prime factor upto k and mark as composite
        if (!isComp[p]) {
            for (int i = p * p; i <= k; i += p)
                isComp[i] = true;
        }
    }

	//collect the primes
    std::vector<int> primes;
    for (int i = 2; i <= k; i++) {
        if (!isComp[i])
            primes.push_back(i);
    }

    return primes;
}


std::vector<bool> printPrimesToOpenMP(int n, int threads) {
    if (n < 2)
        return {true, true};
    // get primes < sqrt(n)
    auto basePrimes = getPrimesToSqrtN((int)floor(sqrt(n)));

    std::vector<bool> isComp(n + 1);
    isComp[0] = isComp[1] = true;

    ll totalChunks = n - 1;
	ll segments = threads * 10;
    ll chunkSize = (totalChunks + segments - 1) / segments; // 8 threads 


    omp_set_num_threads(threads);
    #pragma omp parallel for schedule(dynamic, 1)
	for (ll rangeStart = 2; rangeStart <= n; rangeStart += chunkSize) {
        ll rangeEnd = rangeStart + chunkSize - 1; // inclusive
        if (rangeEnd > n)
            rangeEnd = n;
        for (auto p : basePrimes) {
            ll p2 = p * p; 
            ll first = std::max(p2, ((rangeStart + p - 1) / p) * p);
            for (ll i = first; i <= rangeEnd; i += p) {
                isComp[i] = true;
            }
        }
    }

	return isComp;


}

int main() {
    int n;
    std::cout << "Enter a value for n: ";
    std::cin >> n;

	const int threads = 8;

    {
        using namespace std::chrono;
        auto start = high_resolution_clock::now();
        const auto isComp = printPrimesToOpenMP(n, threads);
        auto end = high_resolution_clock::now();

		// for (int64_t i = 2; i < n; ++i)
        // 	if (!isComp[i])
        //     	std::cout << i << '\n'; // output rest

        std::cout << "Time taken: "
                  << duration_cast<microseconds>(end - start).count() / 10e6
                  << "seconds\n";
    }
}
