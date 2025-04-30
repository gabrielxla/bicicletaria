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

//====== Reset form =======================================================================
function resetForm() {
    location.reload()
    }
    
    api.resetForm((args)=>{
        resetForm()
    })

    // buscar cliente
const foco = document.getElementById('inputOSClient')
document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true
    btnImprimir.disabled = true
     

    foco.focus()
})
// ================= CRUD READ ============================================================
function BuscarOs (){
    let nameOs = document.getElementById('inputOSClient').value
    console.log(nameOs)
    api.searchOsClient(nameOs)
    if (nameOs ===""){
     api.validateSearch()
     foco.focus()
     
 
     }else{
     api.searchOsClient(nameOs)
     api.renderOS((event,dataOS)=>{
     console.log(dataOS)
     const dadosCliente = JSON.parse(dataOS)
     arrayClient = dadosCliente
     arrayClient.forEach((c)=> {
        statusOS.value = c.status || ""
        funcioOs.value = c.funcionarioResponsavel || ""
        bikeOs.value = c.bicicleta || ""
        numS.value = c.numeroQuadro || ""
        cor.value = c.corBicicleta || ""
        manutencao.value = c.tipoManutencao || ""
        previsao.value = c.previsaoEntrega || ""
        obsC.value = c.observacaoCliente || ""
        obsF.value = c.conclusaoTecnico || ""
        pecas.value = c.pecasTroca || ""
        acessorios.value = c.acessorios || ""
        total.value = c.total || ""
        formas.value = c.formasPagamento || ""
    
        // Bloqueio do botão adicionar
        btnCreate.disabled = true
        btnUpdate.disabled = false
        btnDelete.disabled = false
    })
    })
    }
    

}