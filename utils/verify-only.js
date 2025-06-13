const fs = require('fs');
const { spawn } = require('child_process');

async function verifyProof() {
    try {
        // 檢查必要的文件是否存在
        const requiredFiles = [
            'build/verification_key.json',
            'build/public.json',
            'build/proof.json'
        ];

        for (const file of requiredFiles) {
            if (!fs.existsSync(file)) {
                console.error(`❌ 找不到必要文件: ${file}`);
                console.error('請先運行 npm run generate 來生成證明');
                return false;
            }
        }

        console.log('🔍 正在驗證零知識證明...');

        // 運行 snarkjs 驗證命令
        const verifyProcess = spawn('snarkjs', [
            'groth16',
            'verify',
            'build/verification_key.json',
            'build/public.json',
            'build/proof.json'
        ]);

        let output = '';
        let errorOutput = '';

        verifyProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        verifyProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        return new Promise((resolve) => {
            verifyProcess.on('close', (code) => {
                if (code === 0) {
                    console.log('✅ 證明驗證成功！');
                    console.log(output);
                    
                    // 讀取並顯示公開輸出
                    try {
                        const publicData = JSON.parse(fs.readFileSync('build/public.json', 'utf8'));
                        console.log(`📊 驗證結果: ${publicData[0] === '1' ? '密碼正確 ✅' : '密碼錯誤 ❌'}`);
                    } catch (e) {
                        console.log('📊 無法讀取公開輸出');
                    }
                    
                    resolve(true);
                } else {
                    console.error('❌ 證明驗證失敗！');
                    console.error(errorOutput);
                    resolve(false);
                }
            });
        });

    } catch (error) {
        console.error('驗證過程中發生錯誤:', error);
        return false;
    }
}

// 如果直接運行此腳本
if (require.main === module) {
    verifyProof();
}

module.exports = { verifyProof }; 