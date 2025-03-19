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
        console.log("Cliente adicionado com sucesso")
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
        console.log("Dados cadastrados com sucesso")
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
        console.log("Cliente deletado")
    } catch (error) {
        console.log(error)
    }
}


const Iniciarsistema = async ()=> {
  console.clear()
  console.log("Estudo do MongoDB")
  console.log("------------------")
  await conectar()
  //await listarCliente('67db1fba6e7fa5b3641bc81f')
  await salvarCliente("Raiam Santos","77777-7777","44829057800","toninho","Caloi","21321","Preta","Melhoria","20/10/01","Precisa trocar as rodas ", "Trocar as Rodase a marcha",120,"Dinheiro")
  //await buscarClienteNome("raiam ")
  //await buscarClienteCPF("44829057800")
  //await atualizarCliente("67d882316d13723f88c5cb24","Raiam Santos")
  //await excluirCliente("67db1fba6e7fa5b3641bc81f")
  await desconectar()
}

Iniciarsistema()