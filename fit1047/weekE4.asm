        .text
    
main:   addi $t0 , $0 , 62
        addi $t1 , $0 , -28
        addi $t2 , $0 , 20
        addi $t3 , $0 , 3
        add $t4 , $t1 , $t0
        sub $t4 , $t4 , $t2
        mult $t3 , $t4
        mflo $t5
        div $t5 , $t4
        mflo $t6
        div $t2 , $t3
        mfhi $t6