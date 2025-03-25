const {model,Schema} = require('mongoose')
const { type } = require('os')

const clienteSchema = new Schema({
    nomeClient: {type:String},
    cpfCliente: {type: String,unique:true,index: true}
    ,emailCliente: {type: String}, 
    phoneCliente:{type:String},
    cepCliente:{type: String},
    addressCliente:{type:String},
    numberCliente:{type: String},
    complementCliente:{type:String},
    bairroCliente:{type: String},
    cityCliente:{type: String},
    ufCliente:{type:String}
},{versionKey:false})
module.exports = model ('CadastroCliente', clienteSchema)