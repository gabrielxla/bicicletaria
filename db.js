const { connect } = require('http2')
const mongoose = require('mongoose')

const url = 'mongodb+srv://gabriel:123senac@projetoestudo.2fwgx.mongodb.net/dbbicicletaria'

let conectado = false

const conectar = async () => {
    if (!conectado){
        try{
            await mongoose.connect(url)
            conectado=true
            console.log("MongoDB conectado")
        }catch (error){
            if (error.code = 8000){
                console.log("Erro de autentificação")
            }else{
               console.log(error)
            }
        }
    }
}

const desconectar = async () => {
    if (conectado){
        try{
            await mongoose.disconnect(url)
            conectado=false
            console.log("MongoDB desconectado")
        }catch (error){
            console.log(error)
        }
    }
}

module.exports = {conectar,desconectar}