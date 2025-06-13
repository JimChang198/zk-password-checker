#!/bin/bash

CIRCUIT_NAME=password

# 1. Compile the circuit
circom circuits/${CIRCUIT_NAME}.circom --r1cs --wasm --sym -o build/ -l node_modules

# 2. Generate witness
node build/${CIRCUIT_NAME}_js/generate_witness.js \
     build/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm \
     input/input.json \
     build/witness.wtns

# 3. Powers of Tau (通用初始設定一次即可)
if [ ! -f build/pot12_final.ptau ]; then
    snarkjs powersoftau new bn128 12 build/pot12_0000.ptau -v
    snarkjs powersoftau contribute build/pot12_0000.ptau build/pot12_0001.ptau --name="First contribution" -v
    snarkjs powersoftau prepare phase2 build/pot12_0001.ptau build/pot12_final.ptau -v
fi

# 4. Setup zkey
snarkjs groth16 setup build/${CIRCUIT_NAME}.r1cs build/pot12_final.ptau build/${CIRCUIT_NAME}.zkey

# 5. Export verifier key
snarkjs zkey export verificationkey build/${CIRCUIT_NAME}.zkey build/verification_key.json

# 6. Prove
snarkjs groth16 prove build/${CIRCUIT_NAME}.zkey build/witness.wtns build/proof.json build/public.json

# 7. Verify
snarkjs groth16 verify build/verification_key.json build/public.json build/proof.json