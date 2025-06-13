pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";

template PasswordVerifier() {
    signal input password;            // 私密輸入
    signal input expected_hash;       // 公開的目標 hash
    signal output is_valid;

    component hash = Poseidon(1);
    hash.inputs[0] <== password;

    component equal = IsEqual();
    equal.in[0] <== hash.out;
    equal.in[1] <== expected_hash;
    is_valid <== equal.out;
}

component main = PasswordVerifier();