#include "a.h"
#include <stdio.h>
struct inputs in11 = {
    1,1,0,0
};
struct outputs out11 = {
    0,0,0
};


int main (){
    // outputs.OUT1 = logic(inputs).OUT1;
    printf("%d",logic(in11).OUT1);
    // printf("%d", in11.IN1);
    return 0;
}