// buscar CEP
function buscarCEP(){
    let cep =document.getElementById('inputCEpClient').value
    let urlAPI = `https://viacep.com.br/ws/${cep}/json/`
    fetch(urlAPI)
        .then(response=> response.json())
        .then(dados => {
            document.getElementById('inputLogradouroClient').value = dados.logradouro
            document.getElementById('inputBAIClient').value = dados.bairro
            document.getElementById('inputESTClient').value = dados.localidade
            document.getElementById('uf').value = dados.uf

        } )
        .catch(error => console.log(error)
        )
    }
    function teste(){
        let lap=document.getElementById('floatingTextarea').value
        console.log(lap)
    }
// buscar cliente
const foco = document.getElementById('searchClient')
document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true

    foco.focus()
})
// captura dos dados dos inputs
let frmClient = document.getElementById("frmClient")
let nameClient = document.getElementById("inputNameClient")
let cpfClient = document.getElementById("inputCPFClient")
let emailClient = document.getElementById("inputEmailClient")
let phoneClient = document.getElementById("inputTelefoneClient")
let cepClient = document.getElementById("inputCEpClient")
let addressClient = document.getElementById("inputLogradouroClient")
let numberClient = document.getElementById("inputNUMClient")
let complementClient = document.getElementById("inputCOMClient")
let bairroClient = document.getElementById("inputBAIClient")
let cityClient = document.getElementById("inputESTClient")
let ufClient = document.getElementById("uf")

//===================================================================
//Pegar as informações da Os
let frmOS = document.getElementById("frmOS")
let statusOS = document.getElementById("maintenance-type")
let funcioOs = document.getElementById("inputNameFuncionario")
let bikeOs = document.getElementById("inputBIKEClient")
let numS = document.getElementById("inputNUMClient")
let cor = document.getElementById("color")
let manutencao = getElementById("maintenance-typeT")
let previsao = getElementById("inputprevisaoClient")
let obsC = getElementById("floatingTextareaC")
let obsF = getElementById("floatingTextareaF")
let pecas = getElementById("floatingTextareaP")
let acessorios = getElementById("floatingTextareaA")
let  total = getElementById("inputtotalCliente")
let formas = getElementById("maintenance-typeD")
//===================================================================
frmOS.addEventListener("submit", async(event)=>{
    event.preventDefault()
    console.log(statusOS.value,funcioOs.value,bikeOs.value,numS.value,cor.value,manutencao.value,previsao.value,obsC.value,obsF.value,pecas.value,acessorios.value,total.value,formas.value)

    const os = {
        status: statusOS.value,
        fun: funcioOs.value,
        bike: bikeOs.value,
        numQuadro: numS.value,
        cor: cor.value,
        manutencao: manutencao.value,
        previsaoEntrega: previsao.value,
        obsCliente: obsC.value,
        obsFuncionario: obsF.value,
        pecas: pecas.value,
        acessorios: acessorios.value,
        total: total.value,
        formasPagamento: formas.value
    }
    api.newOs(os)
})
//===========================================================
frmClient.addEventListener("submit", async(event)=> {
    event.preventDefault()
    console.log(nameClient.value,cpfClient.value,emailClient.value,phoneClient.value,cepClient.value,addressClient.value,numberClient.value,complementClient.value,bairroClient.value,cityClient.value,ufClient.value)

const client = {
    nameCli: nameClient.value,
    cpfCli: cpfClient.value,
    emailCli: emailClient.value,
    phoneCli: phoneClient.value,
    cepCli: cepClient.value
    ,addressCli: addressClient.value,
    numberCli: numberClient.value,
    complementCli: complementClient.value,
    bairroCli: bairroClient.value,
    cityCli: cityClient.value,
    ufCli: ufClient.value
}
 api.newClient(client)
})
