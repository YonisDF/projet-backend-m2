Binaries operators & equivalent

int a = 0x5A; // a = 01011010
int b = ~a; // b = 10100101, i.e. bits of a inverted
int c = a & b; // c = 00000000, i.e. bits of a and b ANDed together
int d = a | b; // d = 11111111, i.e. bits of a and b ORed together
int e = a ^ 0x3D; // e = 01100110, i.e. bits of a XORed with 00111100
