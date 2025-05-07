//===================================================================
//Pegar as informações da Os
let frmOS = document.getElementById("frmOS")
let statusOS = document.getElementById("maintenance-type")
let funcioOs = document.getElementById("inputNameFuncionario")
let bikeOs = document.getElementById("inputBIKEClient")
let numS = document.getElementById("inputNUMClient")
let cor = document.getElementById("color")
let manutencao = document.getElementById("maintenance-typeT")
let previsao = document.getElementById("inputprevisaoClient")
let obsC = document.getElementById("floatingTextareaC")
let obsF = document.getElementById("floatingTextareaF")
let pecas = document.getElementById("floatingTextareaP")
let acessorios = document.getElementById("floatingTextareaA")
let  total = document.getElementById("inputtotalCliente")
let formas = document.getElementById("maintenance-typeD")
//===================================================================
frmOS.addEventListener("submit", async(event)=>{
    event.preventDefault()
    console.log(statusOS.value,funcioOs.value,bikeOs.value,numS.value,cor.value,manutencao.value,previsao.value,obsC.value,obsF.value,pecas.value,acessorios.value,total.value,formas.value)

    const os = {
        status: statusOS.value,
        fun: funcioOs.value,
        bike: bikeOs.value,
        numeroQuadro: numS.value,
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

//====== Reset form =======================================================================
function resetForm() {
    location.reload()
    }
    
    api.resetForm((args)=>{
        resetForm()
    })

    // buscar cliente
//const foco = document.getElementById('inputNameClient')
document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true
    btnImprimir.disabled = true
    

    //foco.focus()
})
// ================= CRUD READ ============================================================
//function BuscarOs (){
  //  let nameOs = document.getElementById('inputNameClient').value
    //console.log(nameOs)
    //api.searchOsClient(nameOs)
    

//}
// =============== Busca avançada
const input = document.getElementById('inputNameClient')
const suggestionList = document.getElementById('viewListSuggestion')
let idClient = document.getElementById('inputIdClient')
let nameClient = document.getElementById('inputNomeClient')
let phoneClient = document.getElementById('inputtelClient')
let cpfCliente = document.getElementById('inputCPFClient')

let arrayClients = []

input.addEventListener('input',() =>{
    const search = input.value.toLowerCase()
    api.searchClients()
    api.listClients((event,clients)=>{
        const dataClients = JSON.parse(clients)
        arrayClients = dataClients
        const result = arrayClients.filter( c=>
            c.nomeClient && c.nomeClient.toLowerCase().includes(search)
        ).slice(0,10)
       // console.log(result)
        suggestionList.innerHTML = ""
        result.forEach(c => {
            const item = document.createElement('li')
            item.classList.add('list-group-item','list-group-item-action')
            item.textContent = c.nomeClient 
            suggestionList.appendChild(item)
            item.addEventListener('click',()=>{
                idClient.value = c._id
                nameClient.value = c.nomeClient
                phoneClient.value = c.phoneCliente
                cpfCliente.value = c.cpfCliente
                input.value = ""
                suggestionList.innerHTML = ""
            })
        })
    }) 
    document.addEventListener('click',(event) =>{
        if(!input.contains(event.target) && !suggestionList.contains(event.target)){
            suggestionList.innerHTML = ""
        }
    })
})

//================ Buscar OS ============================================================


function inputOS() {
    api.searchOS()
 }