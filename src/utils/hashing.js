const {hash, compare} = require('bcrypt');
const { createHmac } = require("crypto");

const resolveHmacKey = (key) => {
    if (key) return key;
    const isProd = String(process.env.NODE_ENV).toLowerCase() === 'production';
    if (isProd) return null;
    return process.env.JWT_SECRET || 'dev-crypto-key';
};

exports.doHash = async (data, saltRound) => {
    try {
        return await hash(data, saltRound)
    } catch (error) {
        throw new Error(`Hashing fail: ${error.message}`)
    }
}
exports.doCompare = async (data, hashedData) => {
    try {
        return await compare(data, hashedData)
    } catch (error) {
        throw new Error(`Comparing fail: ${error.message}`)
    }
}

exports.doHmac = (data, key) => {
    const resolvedKey = resolveHmacKey(key);
    if (!data || !resolvedKey) throw new Error('CRYPTO_KEY is required for HMAC (set CRYPTO_KEY in your environment)');
    return createHmac('sha256', String(resolvedKey)).update(String(data)).digest('hex')
}

exports.compareHmac = (data, key, hmacToCompare) => {
    const resolvedKey = resolveHmacKey(key);
    if (!data || !resolvedKey) throw new Error('CRYPTO_KEY is required for HMAC comparison (set CRYPTO_KEY in your environment)');
    const generatedHmac = createHmac('sha256', String(resolvedKey)).update(String(data)).digest('hex');
    return generatedHmac === hmacToCompare;
}
