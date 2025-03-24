// Banco de dados

const {conectar, desconectar} = require('./db.js')
const clienteModel = require('./src/models/OS.js')

const salvarCliente = async (nomeCli, foneCLi, cpfCli,funC,bic,bicS,cor,tip,prev,obsC,obsT,tot,pag)=> {
    try{
        const novoCliente = new clienteModel({
          nomeCliente: nomeCli,
          telefoneCliente: foneCLi,
          cpfCliente: cpfCli,
          funcionarioResponsavel: funC,
          bicicleta: bic,
          numeroSerieBicicleta: bicS,
          corBicicleta:cor,
          tipoManutencao: tip,
          previsaoEntrega: prev,
          observacaoCliente: obsC,
          conclusaoTecnico: obsT,
          total: tot,
         formasPagamento: pag 
        })
        await novoCliente.save()
        console.log("Os Salva")
    }catch (error){
        if(error.code = 11000){
            console.log(`Erro: O CPF: ${cpfCli}ja está cadastrado`)
        }
        else{
            console.log(error)
        }
    }
}
const listarCliente = async ()=>{
    try{
        const Clientes = await clienteModel.find()
        console.log(Clientes)
    }catch(error){
        console.log(error)
    }
}
const buscarClienteNome = async(nome)=>{
    try {
        const clienteNome = await clienteModel.find({nomeCliente: new RegExp(nome ,'i')})
        console.log(clienteNome)
    } catch (error) {
        console.log(error)
    }
}
const buscarClienteCPF = async(cpf)=>{
    try {
        const clienteCPF = await clienteModel.find({cpfCliente: new RegExp(cpf)})
        console.log(clienteCPF)
    } catch (error) {
        console.log(error)
    }
}

const atualizarCliente = async (id, nomeCli, foneCLi, cpfCli)=>{
    try {
        const clienteEditado = await clienteModel.findByIdAndUpdate(id,{nomeCliente: nomeCli,telefoneCliente: foneCLi, cpfCliente:cpfCli},{new: true, runValidators: true})
        console.log("OS Atualizada")
    } catch (error) {
        if(error.code = 11000){
            console.log(`Erro: O CPF: ${cpfCli}ja está cadastrado`)
        }
        else{
            console.log(error)
        }
    }
}

const excluirCliente = async (id)=>{
    try {
        const clienteDeletado = await clienteModel.findOneAndDelete(id)
        console.log("Os deletada")
    } catch (error) {
        console.log(error)
    }
}


const Iniciarsistema = async ()=> {
  console.clear()
  console.log("Estudo do MongoDB")
  console.log("------------------")
  await conectar()
  //await listarCliente()
  //await salvarCliente("solange","7323777-7777","4324812434","toninho","Caloi","21321","Preta","Melhoria","20/10/01","Precisa trocar as rodas ", "Trocar as Rodase a marcha",1250,"Dinheiro")
  //await buscarClienteNome("raiam ")
  //await buscarClienteCPF("44829057800")
  //await atualizarCliente("67db28275a1dadb30a5c4411","solange","7323777-7777",4324812434,"toninho","Caloi","21321","Preta","Melhoria","20/10/01","Precisa trocar as rodas ", "Trocar as Rodase a marcha",1250,"Dinheiro)
  //await excluirCliente("67db2386b6501ad6704953b7")
  await desconectar()
}

Iniciarsistema()