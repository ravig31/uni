#include <stdio.h>
int main()
{
	int c, nc = 0, nl = 0;
	while ((c = getchar()) != EOF)
	{
		nc++;
		if (c == '\n')
			nl++;
	}
	printf("\nNumber of characters = %d, number of lines = %d\n", nc, nl);
	return (0);
}