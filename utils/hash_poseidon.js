// utils/hash_poseidon.js
const circomlibjs = require("circomlibjs");
const { Scalar } = require("ffjavascript");

(async () => {
  try {
    console.log("🚀 開始建構 Poseidon...");
    const poseidon = await circomlibjs.buildPoseidon();
    console.log("✅ Poseidon 建構完成");

    const password = 1234;
    console.log("🔐 輸入密碼為:", password);

    const rawHash = poseidon([BigInt(password)]);
    console.log("🧮 Raw Poseidon output:", rawHash);

    const hash = poseidon.F.toObject(rawHash);
    console.log("✅ Poseidon hash of", password, "is:\n", hash.toString());
  } catch (e) {
    console.error("❌ 發生錯誤：", e);
  }
})();
