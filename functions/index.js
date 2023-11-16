const crypto = require('crypto')
const fs = require('fs')

function GetDate(){
    const ptDate = Date.now()
    let newDate = new Date(ptDate)

    return newDate
}

function ReadJSONFile(){
    try{
        const data = fs.readFileSync('Settings.json', 'utf-8')
        const objetoJSON = JSON.parse(data)

        return objetoJSON
    }catch(err){
        console.error('Erro ao ler o arquivo:', err)
        return
    }
}
function WriteJSONFile(data){
    try{
        fs.writeFileSync('Settings.json',JSON.stringify(data,null,2))
        return
    }catch(err){
        console.error('Erro ao escrever o arquivo:', err)
        return
    }
}

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

module.exports = {EncryptJSON, DecryptJSON, Test}