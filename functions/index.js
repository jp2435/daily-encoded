const crypto = require('crypto')

function EncryptJSON(Data,Settings){
    /*
     * Data: JSON -> String
     * Key: String -> Buffer
     * iv: String -> Buffer
    */
    let dataStr = JSON.stringify(Data)
    let key = Buffer.from(Settings.key,'hex')
    let iv = Buffer.from(Settings.iv,'hex')
    const cipher = crypto.createCipheriv('aes-256-cbc',key,iv)
    
    let encrypted = cipher.update(dataStr,'utf-8','hex')
    encrypted += cipher.final('hex')

    return { encryptedText: encrypted}

}

function DecryptJSON(EncryptData,Settings){
    /*
     * EncryptData: String -> JSON
     * Key: String -> Buffer
     * iv: String -> Buffer
    */
    let key = Buffer.from(Settings.key,'hex')
    let iv = Buffer.from(Settings.iv,'hex')

    const decipher = crypto.createDecipheriv('aes-256-cbc',key,iv)
    
    let decrypted = decipher.update(EncryptData,'hex','utf-8')
    decrypted += decipher.final('utf-8')

    let data = JSON.parse(decrypted)
    return { decrypted: data}
}

module.exports = {Setup,EncryptJSON, DecryptJSON}