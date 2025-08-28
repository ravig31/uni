#include <chrono>
#include <immintrin.h>
#include <iostream>

int main() {
  alignas(32) float a[8] = {1, 2, 3, 4, 5, 6, 7, 8};
  alignas(32) float b[8] = {8, 7, 6, 5, 4, 3, 2, 1};
  alignas(32) float out[8];

  __m256 va = _mm256_load_ps(a);
  __m256 vb = _mm256_load_ps(b);
  __m256 vc;

  constexpr int ITER = 1000000000; 
	
  auto start_no_intr= std::chrono::high_resolution_clock::now();
	
	for (int i = 0; i < ITER; i++) {
    for (int j=0; j < 8; j++) 
			out[j] = a[j] * b[j];
  }
	
  auto end_no_intr= std::chrono::high_resolution_clock::now();

  std::chrono::duration<double> elasped_no_intr = end_no_intr - start_no_intr;

  auto start_intr = std::chrono::high_resolution_clock::now();

  for (int i = 0; i < ITER; i++) {
    vc = _mm256_mul_ps(va, vb);
  }

  auto end_intr = std::chrono::high_resolution_clock::now();
  std::chrono::duration<double> elapsed_intr = end_intr - start_intr;

  _mm256_store_ps(out, vc); // write result back to memory

  std::cout << "Result: ";
  for (float f : out)
    std::cout << f << " ";
  std::cout << "\n";

  std::cout << "Elapsed time Intrinsics: " << elapsed_intr.count() << " seconds\n";
  std::cout << "Elapsed time NO Intrinsics: " << elasped_no_intr.count() << " seconds\n";
}
