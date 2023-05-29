#include <stdio.h>
struct inputs {
    bool IN1 , IN2 , IN3;
};
struct outputs {
    bool OUT1 , OUT2 , OUT3;
};
struct outputs logic(struct inputs IN) {
    bool in1=0 , in2=0 , in3=0;
    bool out1=0 , out2=0 , out3=0;
    in1 =( IN.IN1 &  1);
    in2 =( IN.IN2 &  1);
    out1 =(  in1 | in2);
    in3 =( IN.IN3 &  out1);
    out3 =(  in3);
    out2 =(  in3);

    struct outputs OUT ={out1 , out2 , out3};
    return OUT;
}

int main() {
    struct inputs in = {0,1,1};
    struct outputs o = logic(in);
    printf("%d %d %d",o.OUT1,o.OUT2,o.OUT3);
    return 0;
}