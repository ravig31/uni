#include <stdio.h>

void assign_new_int(int* x, int new_int){
	*x = new_int;
	return;
}


void increment(int* x){
	*x += 1;
	return;
}

int main(){
	int a = 5;
	printf("Original value is %d\n", a);
		
	assign_new_int(&a, 10);
	printf("New value is %d\n", a);
	
	increment(&a);
	printf("Incremented value is %d\n", a);
	
	return 0;
}