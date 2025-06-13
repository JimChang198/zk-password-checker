const circomlib = require("circomlibjs");

async function calculatePoseidonHash(input) {
    try {
        const poseidon = await circomlib.buildPoseidon();
        
        // 如果輸入是字符串，轉換為數字
        let numericInput;
        if (typeof input === 'string') {
            // 將字符串轉換為數字（簡單方法）
            numericInput = parseInt(input) || 0;
        } else {
            numericInput = input;
        }
        
        const hash = poseidon([numericInput]);
        const hashString = poseidon.F.toString(hash);
        
        return {
            input: input,
            numericInput: numericInput,
            hash: hashString
        };
    } catch (error) {
        console.error("計算哈希時發生錯誤:", error);
        return null;
    }
}

// 如果直接運行此腳本
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log("使用方法: node utils/hash-calculator.js <password>");
        console.log("範例: node utils/hash-calculator.js 1234");
        process.exit(1);
    }
    
    const password = args[0];
    
    calculatePoseidonHash(password).then(result => {
        if (result) {
            console.log("\n=== Poseidon 哈希計算結果 ===");
            console.log(`原始輸入: ${result.input}`);
            console.log(`數字輸入: ${result.numericInput}`);
            console.log(`Poseidon 哈希: ${result.hash}`);
            console.log("\n複製以下JSON到 input/input.json:");
            console.log(JSON.stringify({
                "password": result.numericInput.toString(),
                "expected_hash": result.hash
            }, null, 4));
        }
    });
}

module.exports = { calculatePoseidonHash }; 