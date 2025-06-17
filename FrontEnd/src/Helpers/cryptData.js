import CryptoJS from 'crypto-js';

const generateUserKey = () => {
  const fingerprint = [
    navigator.userAgent,
    navigator.hardwareConcurrency,
    navigator.deviceMemory || 'unknown'
  ].join('|');
  return CryptoJS.SHA256(fingerprint).toString();
};

const encryptData = (data, secretKey) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const decryptData = (ciphertext, secretKey) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch {
    return null;
  }
};

export {generateUserKey,encryptData,decryptData}