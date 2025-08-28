#include <immintrin.h>
#include <iostream>

// just a test doesn't run on ARM
int main() {
    __m256 v1 = _mm256_set_ps(8,7,6,5,4,3,2,1);  // 8 floats
    __m256 v2 = _mm256_set_ps(1,2,3,4,5,6,7,8);  // 8 floats

    __m256 result = _mm256_mul_ps(v1, v2);       // element-wise multiply

    float out[8];
    _mm256_storeu_ps(out, result);               // store back to memory

    for (int i=0; i<8; i++)
        std::cout << out[i] << " ";
	std::cout << '\n';	
}
