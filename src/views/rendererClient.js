//const { ipcMain } = require("electron")

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
// vetor global do blau
let arrayClient = []

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
// captura do id do cliente 
let id = document.getElementById('idClient')

// Função para manipular o enter
function teclaEnter(event){
    if (event.key === "Enter") {
        event.preventDefault()
        buscarCliente()
    } 
}
function restaurarEnter(){
    frmClient.removeEventListener('keydown', teclaEnter)
}
frmClient.addEventListener('keydown', teclaEnter)
//===========================================================
frmClient.addEventListener("submit", async(event)=> {
    event.preventDefault()
    console.log(nameClient.value,cpfClient.value,emailClient.value,phoneClient.value,cepClient.value,addressClient.value,numberClient.value,complementClient.value,bairroClient.value,cityClient.value,ufClient.value)

// Limpa o CPF antes de salvar no banco
let cpfSemFormatacao = cpfClient.value.replace(/\D/g, "");
const client = {
    nameCli: nameClient.value,
    cpfCli: cpfSemFormatacao,
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
// ================= CRUD READ ============================================================
function buscarCliente () {
   let name = document.getElementById('searchClient').value
   console.log(name)
   if (name ===""){
    api.validateSearch()
    foco.focus()
    

    }else{
    api.searchNameClient(name)
    api.renderClient((event,dataClient)=>{
    console.log(dataClient)
    const dadosCliente = JSON.parse(dataClient)
    arrayClient = dadosCliente
    arrayClient.forEach((c)=> {
        id.value = c._id,
        nameClient.value = c.nomeClient,
        cpfClient.value = c.cpfCliente,
        emailClient.value = c.emailCliente,
        phoneClient.value = c.phoneCliente,
        cepClient.value = c.cepCliente,
        addressClient.value = c.addressCliente,
        numberClient.value = c.numberCliente,
        complementClient.value = c.complementCliente,
        bairroClient.value = c.bairroCliente,
        cityClient.value = c.cityCliente,
        ufClient.value = c.ufCliente
        //Bloqueio do botao adicionar 
        btnCreate.disabled = true
        btnUpdate.disabled = false
        btnDelete.disabled = false

    })
   })
   }
   
}

// Setar o cliente não cadastrado
api.setClient((args) => {
    let campoBusca = document.getElementById('searchClient').value.trim()

    // Regex para verificar se o valor é só número (CPF) teste
    if (/^\d{11}$/.test(campoBusca)) {
        // É um número → CPF
        cpfClient.focus()
        foco.value = ""
        cpfClient.value = campoBusca
    } 
    else if(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(campoBusca)){
        cpfClient.focus()
        foco.value = ""
        cpfClient.value = campoBusca
    }
    else {
        // Não é número → Nome
        nameClient.focus()
        foco.value = ""
        nameClient.value = campoBusca
    }
})

// ======= Crud Delete =================================================================
function excluirClient() {
    console.log(id.value)
    api.deleteClient(id.value)
}


//====== Reset form =======================================================================
function resetForm() {
location.reload()
}

api.resetForm((args)=>{
    resetForm()
})

// === Função para aplicar máscara no CPF ===
function aplicarMascaraCPF(campo) {
    let cpf = campo.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cpf.length > 3) cpf = cpf.replace(/^(\d{3})(\d)/, "$1.$2");
    if (cpf.length > 6) cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    if (cpf.length > 9) cpf = cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");

    campo.value = cpf;
}

// === Função para validar CPF ===
function validarCPF() {
    let campo = document.getElementById('inputCPFClient');
    let cpf = campo.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        campo.style.borderColor = "red";
        campo.style.color = "red";
        return false;
    }

    let soma = 0, resto;

    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) {
        campo.style.borderColor = "red";
        campo.style.color = "red";
        return false;
    }

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) {
        campo.style.borderColor = "red";
        campo.style.color = "red";
        return false;
    }

    campo.style.borderColor = "green";
    campo.style.color = "green";
    return true;
}

// Adicionar eventos para CPF
cpfClient.addEventListener("input", () => aplicarMascaraCPF(cpfClient)); // Máscara ao digitar
cpfClient.addEventListener("blur", validarCPF); // Validação ao perder o foco



