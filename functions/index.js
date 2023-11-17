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
        if(data.length == 0){
            WriteJSONFile({iv:{}})  // Conteudo padrão
            return
        }
        
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

function Setup(Dirname){
    if(fs.existsSync(Dirname+'\/Settings.json')){
        console.log('arquivo existe')
    }else{
        console.log('não existe')
        WriteJSONFile({iv:{}}) // Conteudo template
    }
    
    let date = GetDate()
    let month = date.getMonth()
    
    let res = ReadJSONFile()
    if(res == undefined){
        WriteJSONFile({iv:{}})
    }
    let {iv} = ReadJSONFile()
    if(iv == undefined){
        WriteJSONFile({iv: {}})
        Setup(Dirname)
        return
    }
    let keysIV = Object.keys(iv)
    let valuesIV = Object.values(iv)
    let sizeIVValues = valuesIV.length

    if(sizeIVValues == 0){        // Não existe nenhum IV associado
        for(let i = 0; i< month;i++){
            valuesIV[i] = 0
        }
        valuesIV[month] = crypto.randomBytes(16).toString('hex')
        if(!(month+1>12)){
            for(let i= month+1;i<12;i++){
                valuesIV[i]=0
            }
        }

        for(let i = 0; i<12;i++){
            let value = valuesIV[i]
            iv[i]=value             // iv já feito
        }
    }else if(sizeIVValues>0){    // Em todo e qualquer caso com tamnho superior a 0
        let MONTH_APROVED = ['0','1','2','3','4','5','6','7','8','9','10','11']
        keysIV = keysIV.filter((key) => {
            for(let i = 0; i<MONTH_APROVED.length; i++){
                if(key == MONTH_APROVED[i]){
                    return key
                }
            }
        })
        
        let CopyIv = {...iv}
        iv = {}
        
        for(let i=0;i<keysIV.length;i++){
            iv[keysIV[i]] = CopyIv[keysIV[i]]   // iv já feito
        }
    }
    WriteJSONFile({iv})

    if(Object.keys(iv).length == 0){
        // Caso 
        Setup(Dirname)
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

module.exports = {EncryptJSON, DecryptJSON, Setup}