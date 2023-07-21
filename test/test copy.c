 struct inputs {
       int NEW1 , IN1 , IN2 , IN3;
    };
    struct outputs {
       int OUT1 , OUT2 , OUT3;
    };
    struct outputs logic(struct inputs IN) {
       int new1=0 , in1=0 , in2=0 , in3=0;
       int out1=0 , out2=0 , out3=0;
       in1 =( IN.IN1 &  1);
       in2 =( IN.IN2 &  1);
       out1 =(  in1 | in2);
       in3 =( IN.IN3 &  out1);
       out3 =(  in3);
       new1 =( IN.NEW1 &  1);
       out2 =(  in3 | new1);

       struct outputs OUT ={out1 , out2 , out3};
       return OUT;
    }

    1_edge =(  1);
   in1 =( IN.IN1 &  1_edge);
   2_edge =(  1);
   in2 =( IN.IN2 &  2_edge);
   4_edge =(  in1 | in2);
   out1 =(  4_edge);
   3_edge =(  out1);
   in3 =( IN.IN3 &  3_edge);
   6_edge =(  in3);
   out3 =(  6_edge);
   7_edge =(  1);
   in4 =( IN.IN4 &  7_edge);
   5_edge =(  in3 | in4);
   out2 =(  5_edge);

    1_edge =(  1);
       in1 =( IN.IN1 &  1_edge);
       in2 =( IN.IN2 &  1);
       4_edge =(  in1 | in2);
       out1 =(  4_edge);
       3_edge =(  out1);
       in3 =( IN.IN3 &  3_edge);
       in4 =( IN.IN4 &  1);
       out3 =(  in3 | in4);
       5_edge =(  in3 | in4);
       out2 =(  5_edge);

       1_edge =(  1);
       in1 =( IN.IN1 &  1_edge);
       in2 =( IN.IN2 &  1_edge);
       4_edge =(  in1 | in2);
       out1 =(  4_edge);
       3_edge =(  out1);
       in3 =( IN.IN3 &  3_edge);
       in4 =( IN.IN4 &  1_edge);
       5_edge =(  in3 | in4);
       out3 =(  5_edge);
       out2 =(  5_edge);