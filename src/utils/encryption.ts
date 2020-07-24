import constants = require('constants');

import crypto = require('crypto');

import fs = require('fs');
import NodeRSA = require('node-rsa');
import Keys = require('../config/keys');
/**
 * RSA加密/解密非常慢且占用大量CPU。先使用对称算法（AES）对大输入文件进行加密，
 * 然后再使用(非对称加密)RSA密钥对该算法使用的密钥进行加密
 */
export default class Encryption {
	/**
	 * 非对称加密
	 * @description
	 * 客户端私钥解密数据
	 * @param {*} data 待解密数据
	 * @returns utf8
	 */
	public static async privateDecrypt(data: string) {
		// 解密数据类型
		const privateKey = new NodeRSA(Keys.clientPrivKey);
		// padding 填充方式
		privateKey.setOptions({ "encryptionScheme": 'pkcs1' }); // 因为jsencrypt自身使用的是pkcs1加密方案, nodejs需要修改成pkcs1。
		const decrypted = privateKey.decrypt(data, 'utf8');

		return decrypted;
	}

	/**
	 * 非对称加密
	 * @description
	 * 服务器公钥加密数据
	 * @param {*} data 待加密数据
	 * @returns base64
	 */
	public static publicEncrypt(data: string) {
		const pubKey = new NodeRSA(Keys.serverPubKey);
		pubKey.setOptions({ "encryptionScheme": 'pkcs1' });
		const encrypted = pubKey.encrypt(data, 'base64');

		return encrypted;
	}

	/**
	 * 对称加密
	 * AES_128_CBC 加密
	 * @param data 加密数据体
	 * @return base64
	 */
	public static aesEncrypt(data: string, key: string) {
		const cipherChunks = [];
		const cipher = crypto.createCipheriv('aes-128-ECB', key, '');
		cipher.setAutoPadding(true);
		cipherChunks.push(cipher.update(data, 'utf8', 'base64'));
		cipherChunks.push(cipher.final('base64'));

		return cipherChunks.join('');
	}

	/**
	 * 对称解密
	 * @param encrypt 解密数据体
	 * @return utf8
	 */
	public static async aesDecrypt(encrypt: string, key: any) {
		const cipherChunks = [];
		const decipher = crypto.createDecipheriv('aes-128-ECB', key, '');
		decipher.setAutoPadding(true);
		cipherChunks.push(decipher.update(encrypt, 'base64', 'utf8'));
		cipherChunks.push(decipher.final('utf8'));

		return cipherChunks.join('').toString();
	}
}
