#include <stdio.h>

int main(){
	int x = 25;

	if (x < 10){
		printf("%d is less than 10\n", x);
	} else {
		printf("%d is greater than or equal to 10\n", x);
	
	}

	switch (x) {
		case 5:
			printf("%d is equal to 5\n", x);
			break;
		default:
			printf("%d is not equal to 5\n", x);
	}
	
	return 0;
}