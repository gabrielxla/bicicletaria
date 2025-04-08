const { app, BrowserWindow, nativeTheme, Menu,ipcMain, dialog, shell} = require('electron')
const {conectar, desconectar} = require('./db.js')
const clientModel = require('./src/models/Cliente.js')
const osModel = require ("./src/models/OS.js")
const  {jspdf, default: jsPDF} = require('jspdf')
const fs = require('fs')

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
      submenu: [{label: 'Clientes',click: () => relatorioClientes()},{type: 'separator'},{label:'OS abertas'},{label:'OS concluidas'}]
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


//===================================================================================================================================
// CRUD Os

ipcMain.on('new-os', async (event,os)=>{
  console.log(os)
  try {
    const newOs = new osModel({
      status: os.status,
      funcionarioResponsavel: os.fun,
      bicicleta: os.bike,
      numeroSerieBicicleta: os.numQuadro,
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
