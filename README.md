# ZK Password Checker

一個基於零知識證明（Zero-Knowledge Proof）的密碼驗證器，使用 Circom 和 snarkjs 構建。這個項目允許你證明你知道某個密碼，而無需透露密碼本身。

## 🌟 特性

- **零知識驗證**: 證明你知道密碼，但不透露密碼內容
- **Poseidon Hash**: 使用 Poseidon 哈希函數，專為 zk-SNARKs 優化
- **Groth16 協議**: 使用高效的 Groth16 證明系統
- **完整工作流**: 包含電路編譯、證明生成和驗證的完整流程

## 📋 前置需求

在開始之前，請確保你已經安裝了以下工具：

- [Node.js](https://nodejs.org/) (v16 或更高版本)
- [Circom](https://docs.circom.io/getting-started/installation/) (v2.0.0 或更高版本)
- [snarkjs](https://github.com/iden3/snarkjs) (全局安裝)

### 安裝 Circom

```bash
# macOS (使用 Homebrew)
brew install circom

# 或者從源碼編譯
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom
```

### 安裝 snarkjs

```bash
npm install -g snarkjs
```

## 🚀 快速開始

### 1. 克隆並安裝依賴

```bash
git clone <your-repo-url>
cd zk-password-checker
npm install
```

### 2. 運行完整的證明生成流程

```bash
chmod +x scripts/generate.sh
npm run generate
```

或者使用原始腳本：

```bash
./scripts/generate.sh
```

這個腳本會執行以下步驟：
1. 編譯 Circom 電路
2. 生成見證（witness）
3. 執行 Powers of Tau 儀式（如果需要）
4. 設置 zkey
5. 導出驗證密鑰
6. 生成證明
7. 驗證證明

## 📁 項目結構

```
zk-password-checker/
├── circuits/
│   └── password.circom          # 主要的 Circom 電路
├── input/
│   └── input.json              # 輸入數據（密碼和期望的哈希值）
├── scripts/
│   └── generate.sh             # 自動化構建和證明生成腳本
├── utils/                      # 實用工具
│   ├── hash-calculator.js      # Poseidon 哈希計算工具
│   └── verify-only.js          # 證明驗證工具
├── build/                      # 編譯輸出目錄
│   ├── password.r1cs           # 約束系統
│   ├── password.wasm           # WebAssembly 見證生成器
│   ├── password.zkey           # 證明密鑰
│   ├── verification_key.json   # 驗證密鑰
│   ├── proof.json              # 生成的證明
│   └── public.json             # 公開輸出
├── package.json
└── README.md
```

## 🔧 使用方法

### NPM 腳本（推薦）

```bash
# 計算密碼的 Poseidon 哈希
npm run hash 1234

# 只編譯電路（不生成證明）
npm run build

# 生成完整的零知識證明
npm run generate

# 驗證現有的證明
npm run verify

# 清理構建文件
npm run clean
```

### 計算新密碼的哈希

使用內建的哈希計算工具：

```bash
npm run hash 5678
```

這會輸出：
```
=== Poseidon 哈希計算結果 ===
原始輸入: 5678
數字輸入: 5678
Poseidon 哈希: 12345678901234567890...

複製以下JSON到 input/input.json:
{
    "password": "5678",
    "expected_hash": "12345678901234567890..."
}
```

### 修改輸入密碼

1. 使用哈希計算工具獲取新密碼的哈希值
2. 將結果複製到 `input/input.json` 文件：

```json
{
    "password": "your_password_here",
    "expected_hash": "corresponding_poseidon_hash"
}
```

### 完整工作流程示例

以下是一個完整的使用示例：

```bash
# 1. 計算新密碼 "mypassword" 的哈希
npm run hash mypassword

# 2. 複製輸出的 JSON 到 input/input.json

# 3. 生成零知識證明
npm run generate

# 4. 驗證證明
npm run verify
```

### 手動步驟

如果你想手動執行各個步驟：

```bash
# 1. 編譯電路
circom circuits/password.circom --r1cs --wasm --sym -o build/ -l node_modules

# 2. 生成見證
node build/password_js/generate_witness.js \
     build/password_js/password.wasm \
     input/input.json \
     build/witness.wtns

# 3. 生成證明
snarkjs groth16 prove build/password.zkey build/witness.wtns build/proof.json build/public.json

# 4. 驗證證明
snarkjs groth16 verify build/verification_key.json build/public.json build/proof.json
```

## 🔍 電路解析

`password.circom` 電路的工作原理：

```circom
template PasswordVerifier() {
    signal input password;            // 私密輸入：你的密碼
    signal input expected_hash;       // 公開輸入：期望的哈希值
    signal output is_valid;           // 輸出：驗證結果（1=有效，0=無效）

    // 使用 Poseidon 哈希函數
    component hash = Poseidon(1);
    hash.inputs[0] <== password;

    // 比較哈希值
    component equal = IsEqual();
    equal.in[0] <== hash.out;
    equal.in[1] <== expected_hash;
    is_valid <== equal.out;
}
```

## 📊 輸出解讀

成功運行後，你會看到：

- `public.json`: `["1"]` 表示密碼驗證成功，`["0"]` 表示失敗
- `proof.json`: 包含零知識證明的所有組件
- `verification_key.json`: 用於驗證證明的公開密鑰

## 🛠️ 故障排除

### 常見問題

1. **"circomlib/poseidon.circom not found"**
   - 確保已安裝 `circomlib`: `npm install circomlib`
   - 檢查 include 路徑是否正確

2. **"Non quadratic constraints are not allowed"**
   - 使用 `IsEqual` 組件而不是直接比較運算符
   - 確保所有約束都是二次的

3. **"MODULE_NOT_FOUND generate_witness.js"**
   - 確保電路編譯成功
   - 檢查 `build/password_js/` 目錄是否存在

### 清理和重新構建

```bash
rm -rf build/
./scripts/generate.sh
```

## 🔒 安全性注意事項

- 這是一個演示項目，不建議在生產環境中使用
- 密碼以明文形式存儲在 `input.json` 中，實際應用中需要安全處理
- Powers of Tau 儀式在生產環境中需要多方可信設置

## 📚 學習資源

- [Circom 官方文檔](https://docs.circom.io/)
- [snarkjs GitHub](https://github.com/iden3/snarkjs)
- [零知識證明入門](https://github.com/matter-labs/awesome-zero-knowledge-proofs)

## 🤝 貢獻

歡迎提交 Issues 和 Pull Requests！

## 📄 許可證

MIT License

---

## 🚀 下一步

- 添加更複雜的密碼策略
- 實現密碼強度檢查
- 集成到 Web 應用中
- 添加批量驗證功能
