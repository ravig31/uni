#include <chrono>
#include <cmath>
#include <cstddef>
#include <iostream>
#include <pthread.h>
#include <vector>

#define ll long long

struct Task {
    int threadId;
    ll start;
    ll end;
    std::vector<bool> *isComp;
    std::vector<int> *basePrimes;
};

std::vector<int> getPrimesToSqrtN(int k) {
    std::vector<bool> isComp(k + 1, false);
    isComp[0] = isComp[1] = true;
    for (int p = 2; (ll)p * p <= k; ++p) {
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

void *findCompositesInRange(void *arg) {
    // using the primes < sqrt(n) find their multiples that are > sqrt(n) in the current chunk range
    Task &task = *static_cast<Task *>(arg);
    auto &isComp = *task.isComp;

    for (auto p : *task.basePrimes) {
        ll p2 = p * p; // start at the max of p^2 and the first multple of p in the range
		ll first = std::max(p2, ((task.start + p - 1) / p) * p); 

        for (ll i = first; i <= task.end; i += p) {
            isComp[i] = true;
        }
    }

    return nullptr;
}

void printPrimesToNParalell(int n, int threads) {
    if (n < 2)
        return;

	// get primes < sqrt(n)
    auto basePrimes = getPrimesToSqrtN((int)floor(sqrt(n)));

    std::vector<bool> isComp(n + 1);
    isComp[0] = isComp[1] = true;

	// initialise tasks and threads
    std::vector<pthread_t> threadsIds(threads);
    std::vector<Task> tasks(threads);

    int totalChunks = n - 2 + 1;
    int chunkSize = (totalChunks + threads - 1) / threads;
	int threadSpawned = 0;

    for (int t = 0; t < threads; t++) {
        ll rangeStart = 2 + (ll)t * chunkSize;
        ll rangeEnd = rangeStart + chunkSize - 1; // inclusive

        if (rangeStart > n) break;
		if (rangeEnd > n) rangeEnd = n;

        tasks[t] = Task{
            t, rangeStart, rangeEnd, &isComp, &basePrimes,
        };

        if (pthread_create(&threadsIds[t], NULL, findCompositesInRange,
                           &tasks[t]) != 0) {
            perror("pthread_create");
            exit(1);
        }
		threadSpawned++; //increment the successfull threads spawned
    }

    for (int t = 0; t < threadSpawned; t++)
        pthread_join(threadsIds[t], NULL);

    for (int64_t i = 2; i < n; ++i)
        if (!isComp[i])
            std::cout << i << '\n'; //output
}

int main() {
    int n;
    std::cout << "Enter a value for n: ";
    std::cin >> n;

    const int threads = 8;
    {
        using namespace std::chrono;
        auto start = high_resolution_clock::now();
        printPrimesToNParalell(n, threads);
        auto end = high_resolution_clock::now();

        std::cout << "Time taken: "
                  << duration_cast<microseconds>(end - start).count() / 10e6
                  << "seconds\n";
    }
}
