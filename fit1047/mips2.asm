
	.data
my_array: .word 20 24 10 11 9 21
len: .word 0
hulk_power: .word 15
smash_count: .word 0
i: .word 0
dummy: .word  0
smash_string: .asciiz "Hulk SMASH! >:(\n"
sad_string: .asciiz "Hulk Sad :(\n"
out_string1: .asciiz "Hulk smashed "
out_string2: .asciiz " people"
length_prompt: .asciiz "Array length: "
power_prompt: .asciiz "Enter the value of hulk power: "
num_prompt: .asciiz "Enter num: "
endl: .asciiz "\n:"


	.text

main: 
	#prints array length input prompt
	addi $v0, $0, 4
	la $a0, length_prompt
	syscall
	
	#takes lenth input
	addi $v0, $0, 5
	syscall
	sw $v0, len
	
	#prints hulk power input prompt
	addi $v0, $0, 4
	la $a0, power_prompt
	syscall
	
	#takes hulk power input
	addi $v0, $0, 5
	syscall
	sw $v0, hulk_power
	
	arrayInputLoop:
		#prints array num input prompt
		addi $v0, $0, 4
		la $a0, power_prompt
		syscall

		# load the ith element
		lw $t0, i                # load the value of i
		addi $t0, $t0, 1         # add 1 to account for the length
		sll $t0, $t0, 2          # multiply by 4   
		add $t0, $t0, $t1        # add starting address + required bytes

		# accept the input from the user
		addi $v0, $0, 5
		syscall
		
		# store the input to the array
		sw $v0, ($t0)
		
		#print newline
		addi $v0, $0, 4
		lw $a0, endl
		syscall
		
		j arrayInputLoop
		
	#gets length of array
	la $t0, my_array		#$t0 = address of my_array 			
   	la $t1, len			#$t1 = address of len
   	sub $t2, $t1, $t0		#$t2 = (address of my_array) - (address of len) 
    	add $t3, $0, 4			#$t3 = 0 + 4
   	div $t2, $t3			#(address of my_array) - (address of len) // 4, gives the number of processes
    	mflo $t2			#$t2(address of my_array) - (address of len) // 4, gives the number of processes
    	sw $t2, len			#store $t2 as len
	
	lw $a2, hulk_power
	
	jal smash_or_sad

	addi $v0, $0, 4			#system call code for string print
	la $a0, out_string1		#$a0 = address of out_string1
	syscall
	
	addi $v0, $0, 1			#system call code for integer print
	lw $a0, smash_count		#$a0 = smash_count
	syscall	
	
	addi $v0, $0, 4			#system call code for string print
	la $a0, out_string2		#$a0 = address of out_string2
	syscall
	
	addi $v0, $0, 10		#system call code for exit
	syscall	

smash_or_sad:
	addi $t0, $0, 0			#$t0 = 0
	sw $t0, smash_count		#store smash_count = 0
	lw $t1, len			#$t1 = len
	addi $t5, $0, 4			#
	mult $t1, $t5
	mflo $t1			#t1 = 
	add $a2, $a2, 1			#let $a2 = hulk_power + 1 too use for set less than statement
	
forRangeList:
	lw $t0, i 			#$t0 = i
	lw $t2, my_array($t0)		#$t2 = my_array[i]
	slt $t3, $t2, $a2		#$t3 = 1 if my_array[i] < hulk_power + 1, else is 0
	beq $t0, $t1, return		#branch to return if i = lenghth of my_array
	addi $t0, $t0, 4
	sw $t0, i	
	beq $t3, 1, hulkSmash		#branch to hulkSmash if my_array[i] <= hulk_power
	beq $t3, 0, hulkSad		#else branch to hulkSad


	hulkSmash:
		addi $v0, $0, 4			#system call code for string print
		la $a0, smash_string		#$a0 = address of smash_string
		syscall
	
		lw $t4, smash_count		#$t4 = smash_count
		add $t4, $t4, 1 		#smash_count += 1
		sw $t4, smash_count		#re-store $t4 into the address of smash_count
	
		j forRangeList
	
	hulkSad:
		addi $v0, $0, 4			#system call code for string print
		la $a0, sad_string		#$a0 = address of sad_string
		syscall
	
		j forRangeList

	return:
		jr $ra
