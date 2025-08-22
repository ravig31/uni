#include <chrono>
#include <iostream>
#include <vector>

void printPrimesToN(int n) {
    if (n < 2)
        return;
    std::vector<bool> is_composite(n + 1);

    is_composite[0] = is_composite[1] = true;
    int p = 2;

    for (int p = 2; (long long)p * p <= n; ++p) { // repeat for all p up to sqrt(n)
        if (!is_composite[p]) {
            for (int i = p * p; i < n; i += p) {
                is_composite[i] = true; // mark all muiltiples of p as composite
                                        // upto n (not including)
            }
        }
    }

    for (int i = 0; i < n; i++) {
        if (!is_composite[i]) {
            std::cout << i << '\n';
        }
    }
}

int main() {
    int n;
    std::cout << "Enter a value for n: ";
    std::cin >> n;

    {
        using namespace std::chrono;
        auto start = high_resolution_clock::now();
        printPrimesToN(n);
        auto end = high_resolution_clock::now();

        std::cout << "Time taken: "
                  << duration_cast<microseconds>(end - start).count() / 10e6
                  << "seconds";
    }
}
