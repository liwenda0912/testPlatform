
// 生成随机密钥和IV
import {dataHandle} from "@/utils/handleData";
import * as CryptoJS from 'crypto-js';

export function generateKeyAndIV() {
    let key = CryptoJS.lib.WordArray.random(128 / 8); // 128-bit key
    let iv = CryptoJS.lib.WordArray.random(128 / 8);  // 128-bit IV
    return { key, iv };
}
// 加密函数
export function encryptWithDynamicKey(word:any) {
    const { key, iv } = generateKeyAndIV();
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    // 将密钥和IV与加密后的数据一起编码
    return {
        ciphertext: CryptoJS.enc.Base64.stringify(encrypted.ciphertext),
        key: CryptoJS.enc.Base64.stringify(key),
        iv: CryptoJS.enc.Base64.stringify(iv)
    };
}

export function decryptWithDynamicKey(ciphertextBase64:any, keyBase64:any, ivBase64:any) {
    // 将Base64编码的密钥和IV解码为WordArray
    const key = CryptoJS.enc.Base64.parse(keyBase64);
    const iv = CryptoJS.enc.Base64.parse(ivBase64);
    // 将Base64编码的密文解码为WordArray
    // 创建AES解密器
    const ciphertext = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(ciphertextBase64)
    });
    const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    // 将解密后的WordArray转换为字符串
    return decrypted.toString(CryptoJS.enc.Utf8);
}

export const getSecretData=(data:any)=>{
    let data_:any = {}
    let secretData = encryptWithDynamicKey(data)
    data_.iv = secretData.iv
    data_.key = secretData.key
    data_.ciphertext = secretData.ciphertext
    return data_
}

export const getDecryptData=(secret:any)=>{
    if(typeof secret != "object" && secret!=null){
        let secretData = dataHandle(secret)
        // 获取到解密的数据
        let string:string = decryptWithDynamicKey(secretData.iciphertext, secretData.key, secretData.iv)
        return string
    }else {
        return secret
    }
}