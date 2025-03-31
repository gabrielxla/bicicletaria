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