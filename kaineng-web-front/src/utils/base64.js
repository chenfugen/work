import { Base64 } from 'js-base64';


/**
 * Base64加密
 */
const Encrypt = (word) => { //加密
	return Base64.encode(word)
}

/**
 * CryptoJS解密
 */
const Decrypt = (word) => { //解密   
   return Base64.decode(word)
}

export default {
	Encrypt,
	Decrypt,
}
