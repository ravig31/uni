### System Info

```zsh
-> % lscpu
Architecture:             aarch64
  CPU op-mode(s):         64-bit
  Byte Order:             Little Endian
CPU(s):                   8
  On-line CPU(s) list:    0-7
Vendor ID:                Apple
  Model name:             -
    Model:                0
    Thread(s) per core:   1
```


### Compile commands (no optimisations)

task1:

`g++ task1.cpp -o task1.o`

task2:

`g++ task2.cpp -o task2.o`

task3: 

`g++ -fopenmp task3.cpp -o task3.o`

### Performance

tested with `n = 100,000,000`

```zsh
-> % diff task1out.txt task2out.txt
< Time taken: 1.13523seconds
---
> Time taken: 0.515643seconds
-> % diff task1out.txt task3out.txt
< Time taken: 1.13523seconds
---
> Time taken: 1.14731seconds 
```

thread overhead task3 with the current input size no performance gain

### Things to explore

- how do pthreads scale based on the hardware? Do logical threads make a difference
- what is the overhead?
- what is the difference between pthreads and openmp under the hood?
- which of these to use when?
- where is openmp and pthreads used in the industry?
- Amdahls law?
- how is work distributed amongst threads with pthreads vs openmp?
- should you reuse existing threads i.e. when should you consider a thread pool?
- what is the general structure of creating a paralell program?
- how to set the omp thread, what does it do?
- scheduling system inside the openMP?
- Shared or private key attribute inside the OpenMP