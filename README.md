# 🔐 ZK Password Checker

🚀 使用零知識證明，驗證密碼而不洩漏密碼！

這是一個基於 Circom 和 snarkjs 的簡單密碼驗證器，透過零知識證明 (Zero-Knowledge Proof)，你可以證明你知道一個密碼，而不需要透露它的內容。

---

## ✨ 功能特色

* ✅ **零知識驗證**：驗證你知道密碼，但不洩漏密碼內容
* 🔐 **Poseidon 哈希**：專為 zk-SNARKs 設計的高效哈希函數
* ⚡ **Groth16 協議**：快速且常用的 ZK 證明系統
* 🧬 **全流程腳本化**：輕鬆建立與驗證證明

---

## 📦 安裝前準備

請先安裝以下工具：

* [Node.js](https://nodejs.org/)（v16+）
* [Circom](https://docs.circom.io/getting-started/installation/)（v2.0+）
* [snarkjs](https://github.com/iden3/snarkjs)

### 安裝 snarkjs

```bash
npm install -g snarkjs
```

### 安裝 circom

```bash
# 使用 Homebrew（macOS）
brew install circom

# 或從源碼安裝
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom
```

---

## 🚀 快速開始

### 1. 下載專案並安裝依賴

```bash
git clone <your-repo-url>
cd zk-password-checker
npm install
```

### 2. 執行驗證流程

```bash
npm run hash 1234          # 計算 Poseidon 哈希
# ✍️ 複製結果 JSON 到 input/input.json

npm run generate           # 編譯電路並產生證明
npm run verify             # 驗證證明是否正確
```

---

## 📂 專案結構

```
zk-password-checker/
├── circuits/              # password.circom 電路檔案
├── input/                 # 輸入檔案 input.json
├── scripts/               # 建構腳本 generate.sh
├── utils/                 # 哈希與驗證工具
├── build/                 # 編譯與輸出檔案夾
├── package.json
└── README.md
```

---

## 🔧 常用指令

```bash
npm run hash <密碼>       # 計算 Poseidon 哈希
npm run build             # 編譯電路（不產生證明）
npm run generate          # 編譯 + 產生證明
npm run verify            # 驗證證明
npm run clean             # 清除 build 檔案
```

---

## 🔍 範例流程

```bash
npm run hash mypassword
# → 將輸出複製到 input/input.json
npm run generate
npm run verify
```

驗證成功時，`public.json` 會顯示：

```json
["1"] ✅
```

---

## 🔬 電路設計（password.circom）

```circom
template PasswordVerifier() {
    signal input password;
    signal input expected_hash;
    signal output is_valid;

    component hash = Poseidon(1);
    hash.inputs[0] <== password;

    component equal = IsEqual();
    equal.in[0] <== hash.out;
    equal.in[1] <== expected_hash;

    is_valid <== equal.out;
}
```

---

## 🚧 常見問題

| 問題                        | 解決方式                                       |
| ------------------------- | ------------------------------------------ |
| 找不到 `poseidon.circom`     | 確保 `circomlib` 已安裝並使用 `-l node_modules` 編譯 |
| 找不到 `generate_witness.js` | 電路尚未成功編譯，請先執行 `npm run build`              |
| 非二次約束錯誤                   | 使用 `IsEqual()` 來比較，不可用 `==`                |

---

## 🔒 安全注意

⚠️ 本專案為學習用途，**請勿直接使用於生產環境**：

* 輸入密碼以明文儲存在 `input.json`
* 若要在正式環境使用，請務必進行可信的 Powers of Tau 設置

---

## 📚 延伸學習

* [Circom 官方文檔](https://docs.circom.io/)
* [snarkjs GitHub](https://github.com/iden3/snarkjs)
* [Awesome ZK 資源清單](https://github.com/matter-labs/awesome-zero-knowledge-proofs)

---

## 🤝 貢獻方式

歡迎任何 PR、建議與討論！這是一個開放學習與實驗的空間。

---

## 📄 License

本專案採用 [MIT License](LICENSE)

---

## 🚀 專案的下一步...

* 加入更嚴格的密碼策略
* 加入前端介面（例如 React）
* 支援批量驗證
* 支援密碼強度分析
