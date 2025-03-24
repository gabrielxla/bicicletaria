/**
 * Processo de renderização
 * 
 */
console.log("processo de renderição")

function cliente(){
    //console.log("louco")
    api.clientWindow ()
}
function os(){
    api.osWindow ()
}

// troca do icone do banco de dados
api.dbStatus((event,message)=>{
    console.log(message)
    if(message === "conectado"){
        document.getElementById('statusdb').src = "../public/img/dbon.png"
    }
})