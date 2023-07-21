struct inputs {
    int IN1 , IN2 , IN3 , IN4;
};
struct outputs {
    int OUT1 , OUT2 , OUT3;
};
struct outputs logic(struct inputs IN) {
    int in1=0 , in2=0 , in3=0 , in4=0;
    int edge_1=0 , edge_3=0 , edge_4=0 , edge_5=0;
    int out1=0 , out2=0 , out3=0;
    edge_1=(1);
    in1=(IN.IN1 & edge_1);
    in2=(IN.IN2 & edge_1);
    edge_4=(in1 |in2);
    out1=(edge_4);
    edge_3=(out1);
    in3=(IN.IN3 & edge_3);
    in4=(IN.IN4 & edge_1);
    edge_5=(in3 |in4);
    out3=(edge_5);
    out2=(edge_5);

    struct outputs OUT ={out1 , out2 , out3};
    return OUT;
}