const { AES, enc } = require('crypto-js');
const { cfg } = require('../dist/config');

for (let i = 2; i < process.argv.length; i++) {
    const text = process.argv[i];

    const bytes = AES.decrypt(text, cfg.encryption);
    const clearText = bytes.toString(enc.Utf8);

    console.log(`${i - 1}: ${clearText}`);
}
