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