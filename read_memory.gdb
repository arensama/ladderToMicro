target extended-remote localhost:4242
monitor reset halt
x /1xw 0x0000000020000028 
x /1xw 0x000000002000002c 
x /1xw 0x0000000020000030 
x /1xw 0x0000000020000034 
quit
