const { app, BrowserWindow, nativeTheme, Menu,ipcMain, dialog, shell} = require('electron')
const {conectar, desconectar} = require('./db.js')
const clientModel = require('./src/models/Cliente.js')
const osModel = require ("./src/models/OS.js")
const  {jspdf, default: jsPDF} = require('jspdf')
const fs = require('fs')
const prompt = require ('electron-prompt')
const mongoose = require('mongoose')
const { Types } = require('mongoose')

const path = require('node:path')
let win

const createWindow = () => {
   nativeTheme.themeSource ='dark'
   win = new BrowserWindow({
    width: 1010,
    height: 720,
   // minimizable: false,
    //resizable:false,
    webPreferences: {
      preload: path.join(__dirname,'preload.js')
    }
   
  })
// menu personalizado
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  
  win.loadFile('./src/views/index.html')
  // recebimento dos pedido do renderizador
  ipcMain.on('client-window', () => {
    clientWindow ()
  })
   // recebimento dos pedido do renderizador
   ipcMain.on('os-window', () => {
    osWindow ()
  })
}
// Janela Sobre
function aboutWindow(){
  nativeTheme.themeSource = 'dark'
  const main = BrowserWindow.getFocusedWindow()
  let about
  if (main) {
    about =  new BrowserWindow({
      width: 360,
      height:200,
      autoHideMenuBar: true,
      resizable: false,
      minimizable:false,
      modal: true,
      parent:main
    })
  }
  about.loadFile('./src/views/sobre.html')
}
//fim da janela sobre
//janela cliente
let client
function clientWindow() {
  nativeTheme.themeSource = 'dark'
  const main = BrowserWindow.getFocusedWindow()
  if (main) {
    client =  new BrowserWindow({
      width: 1010,
      height:720,
      resizable: false,
      modal:true,
      webPreferences: {
        preload: path.join(__dirname,'preload.js')
      },
      minimizable:false,
      parent:main
    })

}
client.loadFile('./src/views/cliente.html')
client.center()
}
// janela OS
let os
function osWindow() {
  nativeTheme.themeSource = 'dark'
  const main = BrowserWindow.getFocusedWindow()
  if (main) {
    os =  new BrowserWindow({
      width: 1010,
      height:720,
      resizable: false,
      modal:true,
      minimizable:false,
      parent:main,
      webPreferences: {
        preload: path.join(__dirname,'preload.js')
      },
    })

}
os.loadFile('./src/views/os.html')
os.center()
}
// inicia a aplicação
app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  })
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  //reduzir logs nao criticos
  app.commandLine.appendSwitch('log-level','3')

ipcMain.on('db-connect', async (event)=>{
  let conectado = await conectar()
  if (conectado){
    setTimeout(()=>{
      event.reply('db-status',"conectado")
    }, 500)
  }
})



app.on('before-quit', ()=>{
 desconectar()
})

  // template do menu
const  template = [
  {
     label: 'Cadastro',
     submenu: [{label: 'Clientes', click: () => clientWindow ()},{label:'OS', click: () => osWindow ()},{type:'separator'},{label:'Sair', click: () => app.quit(), accelerator:'Alt+F4'}]
  },
  {
      label: 'Relatorios',
      submenu: [{label: 'Clientes',click: () => relatorioClientes()},{type: 'separator'},{label:'OS abertas', click: () => relatorioOS()},{label:'OS concluidas',click: () => relatorioOSconcluida()}]
  },
  {
      label: 'Ferramentas',
      submenu: [{label: 'Aplicar Zoom', role: 'zoomIn'},{label: 'Reduzir', role: 'zoomOut'},{ label: 'Restaurar o Zoom', role: 'resetZoom'},{ type: 'separator'},{label: 'Reiniciar', role: 'reload'},{ label: 'Ferramenta do desenvolvedor', role:'toggleDevTools'}]
  },
  {
      label: 'Ajuda',
      submenu: [{label:'Sobre',click: () => aboutWindow()}]
  }
]
//--------------------------------------------------------------------------------------------------------------------------------
// == Clientes = CRUD
ipcMain.on('new-client', async (event,client)=>{
  console.log(client)
  try {
    const newClient = new clientModel({
      nomeClient: client.nameCli,
      cpfCliente: client.cpfCli,
      emailCliente: client.emailCli,
      phoneCliente: client.phoneCli,
      cepCliente: client.cepCli,
      addressCliente: client.addressCli,
      numberCliente: client.numberCli,
      complementCliente: client.complementCli,
      bairroCliente: client.bairroCli,
      cityCliente: client.cityCli,
      ufCliente: client.ufCli    })
      await newClient.save()
      dialog.showMessageBox({
        type: 'info',
        title: "Aviso",
        message: "Cliente adicionado com sucesso",
        buttons: ['OK']
      }).then((result)=>{
        if(result.response === 0){
         event.reply('reset-form') 
        }
         
      })
  } catch (error) {
       // se o código de erro for 11000 (cpf duplicado) enviar uma mensagem ao usuário
       if(error.code === 11000) {
        dialog.showMessageBox({
            type: 'error',
            title: "Atenção!",
            message: "CPF já está cadastrado\nVerifique se digitou corretamente",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                // limpar a caixa de input do cpf, focar esta caixa e deixar a borda em vermelho
            }
        })
    }
    console.log(error)
  }
})
//======================================
//relatorio do clientes
async function relatorioClientes() {
  try {
      const clientes = await clientModel.find().sort({nomeClient:1})
     const doc = new jsPDF('p','mm','a4')
     const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.png')
     const imageBase64 = fs.readFileSync(imagePath, {encoding: 'base64'})
     doc.addImage(imageBase64, 'PNG', -3,-23)
     doc.setFontSize(18)
     doc.text("Relatorio de clientes", 14, 45)
     const dataAtual = new Date().toLocaleDateString('pt-br')
     doc.setFontSize(12)
     doc.text(`Data: ${dataAtual}`, 170,10)
     let y = 60
     doc.text("Nome", 14,y)
     doc.text("telefone", 80,y)
     doc.text("email", 130,y)
     y+= 5
     doc.setLineWidth(0.5)
     doc.line(10,y,200,y)
    
     y+= 10
     clientes.forEach((c)=>{
      if (y > 280){
        doc.addPage()
        y = 20
        doc.text("Nome", 14,y)
        doc.text("telefone", 80,y)
        doc.text("email", 130,y)
        y+= 5
        doc.setLineWidth(0.5)
        doc.line(10,y,200,y)
        y+=10       
      }
      doc.text(c.nomeClient,14,y)
      doc.text(c.phoneCliente,80,y)
      doc.text(c.emailCliente || "N/A",130,y)
      y+=10

     })
     const paginas = doc.internal.getNumberOfPages ()
     for (let i = 1; i <= paginas; i++){
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(`Pagina ${i} de ${paginas}`, 105, 290, {align: 'center'})
     }
     const tempDir = app.getPath('temp')
     const filePath = path.join(tempDir, 'clientes.pdf')
     doc.save(filePath)
     shell.openPath(filePath)
  } catch (error) {
    console.log(error)
  }
}

//relatorio das OS ABERTA
async function relatorioOS() {
  try {
    const clientes = await osModel.find({ status: 'aberta' }).sort({ previsaoEntrega: 1 })
     const doc = new jsPDF('p','mm','a4')
     const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.png')
     const imageBase64 = fs.readFileSync(imagePath, {encoding: 'base64'})
     doc.addImage(imageBase64, 'PNG', -3,-23)
     doc.setFontSize(18)
     doc.text("Relatorio de OS Abertas", 14, 45)
     const dataAtual = new Date().toLocaleDateString('pt-br')
     doc.setFontSize(12)
     doc.text(`Data: ${dataAtual}`, 170,10)
     let y = 60
     doc.text("Funcionario", 14,y)
     doc.text("Numero de identificação", 60,y)
     doc.text("Tipo", 125,y)
     doc.text("Previsão de entrega", 160,y)
     y+= 5
     doc.setLineWidth(0.5)
     doc.line(10,y,200,y)
    
     y+= 10
     clientes.forEach((c)=>{
      if (y > 280){
        doc.addPage()
        y = 20
        doc.text("Funcionario", 14,y)
        doc.text("Numero de identificação", 60,y) 
        doc.text("Tipo", 125,y)
        doc.text("Previsão de entrega", 160,y)
        y+= 5
        doc.setLineWidth(0.5)
        doc.line(10,y,200,y)
        y+=10       
      }
      doc.text(c.funcionarioResponsavel,14,y)
      doc.text(c.numeroQuadro|| "N/A",60,y)
      doc.text(c.tipoManutencao || "N/A",115,y)
      doc.text(c.previsaoEntrega || "N/A",160,y)
      y+=10

     })
     const paginas = doc.internal.getNumberOfPages ()
     for (let i = 1; i <= paginas; i++){
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(`Pagina ${i} de ${paginas}`, 105, 290, {align: 'center'})
     }
     const tempDir = app.getPath('temp')
     const filePath = path.join(tempDir, 'OS.pdf')
     doc.save(filePath)
     shell.openPath(filePath)
  } catch (error) {
    console.log(error)
  }
}
async function relatorioOSconcluida() {
  try {
    const clientes = await osModel.find({ status: 'Concluida' }).sort({ previsaoEntrega: 1 })
     const doc = new jsPDF('p','mm','a4')
     const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.png')
     const imageBase64 = fs.readFileSync(imagePath, {encoding: 'base64'})
     doc.addImage(imageBase64, 'PNG', -3,-23)
     doc.setFontSize(18)
     doc.text("Relatorio de OS Concluidas", 14, 45)
     const dataAtual = new Date().toLocaleDateString('pt-br')
     doc.setFontSize(12)
     doc.text(`Data: ${dataAtual}`, 170,10)
     let y = 60
     doc.text("Funcionario", 14,y)
     doc.text("Formas de pagamento", 65,y)
     doc.text("R$", 115,y)
     doc.text("Tipo de manutenção", 160,y)
     y+= 5
     doc.setLineWidth(0.5)
     doc.line(10,y,200,y)
    
     y+= 10
     clientes.forEach((c)=>{
      if (y > 280){
        doc.addPage()
        y = 20
        doc.text("Funcionario", 14,y)
        doc.text("Formas de pagamento", 65,y) 
        doc.text("R$", 115,y)
        doc.text("Tipo de manutenção", 160,y)
        y+= 5
        doc.setLineWidth(0.5)
        doc.line(10,y,200,y)
        y+=10       
      }
      doc.text(c.funcionarioResponsavel,14,y)
      doc.text(c.formasPagamento|| "N/A",70,y)
      doc.text(`${c.total ?? 'N/A'}`, 115, y)
      doc.text(c.tipoManutencao || "N/A",160,y)
      y+=10

     })
     const paginas = doc.internal.getNumberOfPages ()
     for (let i = 1; i <= paginas; i++){
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(`Pagina ${i} de ${paginas}`, 105, 290, {align: 'center'})
     }
     const tempDir = app.getPath('temp')
     const filePath = path.join(tempDir, 'OS.pdf')
     doc.save(filePath)
     shell.openPath(filePath)
  } catch (error) {
    console.log(error)
  }
}
//================================================================================
ipcMain.on('validate-search', ()=>{
  dialog.showMessageBox({
    type: 'warning',
    title: 'Atenção!',
    message: 'Preencha o campo de busca',
    buttons: ['OK']

  })
})
ipcMain.on('search-name', async(event,name)=>{
  try {
    //const dataClient  = await clientModel.find({nomeClient: new RegExp(name, 'i')}|| { cpfCliente: new RegExp(name, 'i')})
    //console.log(dataClient)
    // teste
    const dataClient  = await clientModel.find({
      $or: [
        { nomeClient: new RegExp(name, 'i') },
        { cpfCliente: new RegExp(name, 'i') }
      ]
    })
    if (dataClient.length === 0) {
      dialog.showMessageBox({
        type: "warning",
        title: "aviso",
        message: "Cliente não cadastrado, deseja cadastrar?",
        defaultId: 0,
        buttons: ['Sim', 'Não']

      }).then((result) =>{
        if (result.response===0) {
          event.reply('set-client')
        } else {
          event.reply('reset-form')
        }
      })
    } 
    
    event.reply ('render-client', JSON.stringify(dataClient))
    
  } catch (error) {
    console.log(error)  }
})


//===================================================================================================================================
// CRUD Os
// Validação de busca (preenchimento obrigatório Id Cliente-OS)
ipcMain.on('validate-client', (event) => {
  dialog.showMessageBox({
      type: 'warning',
      title: "Aviso!",
      message: "É obrigatório vincular o cliente na Ordem de Serviço",
      buttons: ['OK']
  }).then((result) => {
      //ação ao pressionar o botão (result = 0)
      if (result.response === 0) {
          event.reply('set-search')
      }
  })
})


ipcMain.on('new-os', async (event,os)=>{
  console.log(os)
  try {
    console.log(os.idClient, typeof os.idClient)
    const newOs = new osModel({
      idCliente: os.idClient,
      status: os.status,
      funcionarioResponsavel: os.fun,
      bicicleta: os.bike,
      numeroQuadro: os.numeroQuadro,
      corBicicleta: os.cor,
      tipoManutencao: os.manutencao,
      previsaoEntrega: os.previsaoEntrega,
      observacaoCliente: os.obsCliente,
      conclusaoTecnico: os.obsFuncionario,
      pecasTroca: os.pecas,
      acessorios: os.acessorios,
      total: os.total,
      formasPagamento: os.formasPagamento
       

    })
      await  newOs.save()
      dialog.showMessageBox({
        type: 'info',
        title: "Aviso",
        message: "Os adicionado com sucesso",
        buttons: ['OK']
      }).then((result)=>{
        if(result.response === 0){
         event.reply('reset-form') 
        }
         
      })
  } catch (error) {
    console.log(error)
  }
})
//=============================================== Buscar OS========================================
ipcMain.on('search-os', (event) =>{
  //console.log("teste: busca OS")
  prompt({
    title: 'Buscar OS',
    label: 'Digite o número da OS:',
    inputAttrs: {
        type: 'text'
    },
    type: 'input',        
    width: 400,
    height: 200
}).then(async(result) => {
    if (result !== null) {
        
        //buscar a os no banco pesquisando pelo valor do result (número da OS)
        if (mongoose.Types.ObjectId.isValid(result)) {
          try {
              const dataOS = await osModel.findById(result)
              if (dataOS) {
                  console.log(dataOS) // teste importante
                  // enviando os dados da OS ao rendererOS
                  // OBS: IPC só trabalha com string, então é necessário converter o JSON para string JSON.stringify(dataOS)
                  event.reply('render-os', JSON.stringify(dataOS))
              } else {
                  dialog.showMessageBox({
                      type: 'warning',
                      title: "Aviso!",
                      message: "OS não encontrada",
                      buttons: ['OK']
                  })
              }
          } catch (error) {
              console.log(error)
          }
      } else {
          dialog.showMessageBox({
              type: 'error',
              title: "Atenção!",
              message: "Formato do número da OS inválido.\nVerifique e tente novamente.",
              buttons: ['OK']
          })
      }
    } 
})
})
//ipcMain.on('search-os', async(event,nameOS)=>{
  //try {
    //const dataOS  = await osModel.find({nomeClient: new RegExp(name, 'i')})
    //console.log(dataClient)
    //event.reply ('render-client', JSON.stringify(dataClient))
    
  //} catch (error) {
    //console.log(error)  }
//})
// buscar cliente para vincular
ipcMain.on('search-clients', async (event)=>{
  try {
    const clients = await clientModel.find().sort({ nomeClient: 1})
    event.reply('list-clients', JSON.stringify(clients))
  } catch (error) {
    console.log(error)
  }
})

// =============== CRUD DELETE =============================
ipcMain.on('delete-client',async(event, id)=> {
  console.log(id)
  try {
    const {response } = await dialog.showMessageBox(client,{
      type: 'warning',
      title: "Atenção",
      message: "DESEJA EXCLUIR ESTE CLIENTE REALMENTE?",
      buttons: ['Cancelar','Excluir']
    })
    if (response === 1){
      const delClient = await clientModel.findByIdAndDelete(id)
      event.reply('reset-form')
    }
  } catch (error) {
    console.log(error)
  }
})
ipcMain.on('delete-OS',async(event, id)=> {
  console.log("TESTE")
  try {
    const {response } = await dialog.showMessageBox(os,{
      type: 'warning',
      title: "Atenção",
      message: "DESEJA EXCLUIR ESTA OS REALMENTE?",
      buttons: ['Cancelar','Excluir']
    })
    if (response === 1){
      const delos = await osModel.findByIdAndDelete(id)
      event.reply('reset-form')
    }
  } catch (error) {
    console.log(error)
  }
})
//Crud UPDATE ====================================================
 
ipcMain.on('update-client', async (event, client) => {
  console.log(client)//Teste importante do recebimento dos dados do cliente

  try {
      //Criar uma nova estrutura de dados usando a classe modelo
      //Atenção! OS atributos precisam ser identicos ao modelo de dados clientes.js
      //e os valores são definidos pelo conteúdo ao objeto client
      const updateClient = await clientModel.findByIdAndUpdate(
          client.idCli,
          {
              nomeClient: client.nameCli,
              cpfCliente: client.cpfCli,
              emailCliente: client.emailCli,
              phoneCliente: client.phoneCli,
              cepCliente: client.cepCli,
              addressCliente: client.addressCli,
              numberCliente: client.numberCli,
              complementCliente: client.complementCli,
              bairroCliente: client.bairroCli,
              cityCliente: client.cityCli,
              ufCliente: client.ufCli
          },
          {
              new: true
          }
      )

      //Messagem de confirmação
      dialog.showMessageBox({
          //Customização
          type: 'info',
          title: "Aviso",
          message: "Dados do cliente alterados com sucesso",
          buttons: ['OK']
      }).then((result) => {
          //Ação ao pressionar o botão
          if (result.response === 0) {
              //Enviar um pedido para o renderizador limpar os campos e resetar as configurações pré definidas (rotulo preload)
              event.reply('reset-form')
          }
      });
  } catch (error) {
      console.log(error)
  }
})
ipcMain.on('update-OS', async (event, OSupd) => {
  console.log("Recebido:", OSupd)
  console.log("ID bruto recebido:", OSupd._id)

  try {
    // 🛠️ Converte ID corretamente
    const idConvertido = new Types.ObjectId(OSupd._id.trim())

    // ✅ Testa se o documento existe com findById
    const docTest = await osModel.findById(idConvertido)
    console.log("📄 Documento encontrado com findById:", docTest)

    if (!docTest) {
      dialog.showErrorBox("Erro", "Documento com esse ID não encontrado.")
      return
    }

    // 🎯 Faz o update
    const updateOS = await osModel.findByIdAndUpdate(
      idConvertido,
      {
        status: OSupd.status,
        funcionarioResponsavel: OSupd.fun,
        bicicleta: OSupd.bike,
        numeroQuadro: OSupd.numeroQuadro,
        corBicicleta: OSupd.cor,
        tipoManutencao: OSupd.manutencao,
        previsaoEntrega: OSupd.previsaoEntrega,
        observacaoCliente: OSupd.obsCliente,
        conclusaoTecnico: OSupd.obsFuncionario,
        pecasTroca: OSupd.pecas,
        acessorios: OSupd.acessorios,
        total: OSupd.total,
        formasPagamento: OSupd.formasPagamento
      },
      { new: true }
    )

    console.log("🟢 Resultado do update:", updateOS)

    if (!updateOS) {
      dialog.showErrorBox("Erro", "Erro ao atualizar OS (update nulo).")
      return
    }

    dialog.showMessageBox({
      type: 'info',
      title: "Aviso",
      message: "Dados da OS alterados com sucesso",
      buttons: ['OK']
    }).then((result) => {
      if (result.response === 0) {
        event.reply('reset-form')
      }
    })

  } catch (error) {
    console.error("❌ Erro ao atualizar OS:", error)
    dialog.showErrorBox("Erro inesperado", "Erro ao atualizar OS. Veja o console.")
  }
})

//FIM Crud UPDATE ====================================================
// Impressao OS
ipcMain.on('print-os', (event) =>{
  //console.log("teste: busca OS")
  prompt({
    title: 'Imprimir OS',
    label: 'Digite o número da OS:',
    inputAttrs: {
        type: 'text'
    },
    type: 'input',        
    width: 400,
    height: 200
}).then(async(result) => {
    if (result !== null) {
        
        //buscar a os no banco pesquisando pelo valor do result (número da OS)
        if (mongoose.Types.ObjectId.isValid(result)) {
          try {
            const dataOS = await osModel.findById(result)
            if (dataOS && dataOS !== null) {
                console.log(dataOS) // teste importante
                const dataClient  = await clientModel.find({ _id: dataOS.idCliente}) 
                console.log(dataClient)
                // Impressão 
                const doc = new jsPDF('p', 'mm', 'a4')
                        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.png')
                        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
                        doc.addImage(imageBase64, 'PNG', 5, -5)
                        doc.setFontSize(18)
                        doc.text("OS:", 14, 45) //x=14, y=45
                        
                        // Extração dos dados da OS e do cliente vinculado

                        // Texto do termo de serviço
                        doc.setFontSize(10)
                        const termo = `
Termo de Serviço e Garantia

O cliente autoriza a realização dos serviços técnicos descritos nesta ordem, ciente de que:

- Diagnóstico e orçamento são gratuitos apenas se o serviço for aprovado. Caso contrário, poderá ser cobrada taxa de análise.
- Peças substituídas poderão ser retidas para descarte ou devolvidas mediante solicitação no ato do serviço.
- A garantia dos serviços prestados é de 90 dias, conforme Art. 26 do Código de Defesa do Consumidor, e cobre exclusivamente o reparo executado ou peça trocada, desde que o equipamento não tenha sido violado por terceiros.
- Não nos responsabilizamos por dados armazenados. Recomenda-se o backup prévio.
- Equipamentos não retirados em até 90 dias após a conclusão estarão sujeitos a cobrança de armazenagem ou descarte, conforme Art. 1.275 do Código Civil.
- O cliente declara estar ciente e de acordo com os termos acima.`

                        // Inserir o termo no PDF
                        doc.text(termo, 14, 60, { maxWidth: 180 }) // x=14, y=60, largura máxima para quebrar o texto automaticamente

                        // Definir o caminho do arquivo temporário e nome do arquivo
                        const tempDir = app.getPath('temp')
                        const filePath = path.join(tempDir, 'os.pdf')
                        // salvar temporariamente o arquivo
                        doc.save(filePath)
                        // abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuário
                        shell.openPath(filePath)
                
            } else {
                dialog.showMessageBox({
                    type: 'warning',
                    title: "Aviso!",
                    message: "OS não encontrada",
                    buttons: ['OK']
                })
            }
          } catch (error) {
              console.log(error)
          }
      } else {
          dialog.showMessageBox({
              type: 'error',
              title: "Atenção!",
              message: "Formato do número da OS inválido.\nVerifique e tente novamente.",
              buttons: ['OK']
          })
      }
    } 
})
})
// Alert erro 
ipcMain.on('show-error-box', (event, message) => {
  dialog.showMessageBox({
    type: 'error',
    title: 'Erro',
    message: message,
    buttons: ['OK']
  });
});