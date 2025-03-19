const {model,Schema} = require('mongoose')
const { type } = require('os')

const clienteSchema = new Schema({
    numeroOS: { type: String }, // Número da OS
    data: { type: Date, default: Date.now }, // Data de criação da OS
    nomeCliente: { type: String }, // Nome do cliente
    cpfCliente: { type: String,  unique: true, index: true }, // CPF do cliente
    telefoneCliente: { type: String }, // Telefone do cliente
    status: { type: String, enum: ['Aberta', 'Em andamento', 'Concluída', 'Cancelada'], default: 'Aberta' }, // Status da OS
    funcionarioResponsavel: { type: String }, // Nome do funcionário responsável
    bicicleta: { type: String }, // Tipo de bicicleta
    numeroSerieBicicleta: { type: String }, // Número de série da bicicleta
    corBicicleta: { type: String }, // Cor da bicicleta
    tipoManutencao: { type: String }, // Tipo de manutenção realizada
    previsaoEntrega: { type: String }, // Previsão de entrega da bicicleta
    observacaoCliente: { type: String }, // Observações fornecidas pelo cliente
    conclusaoTecnico: { type: String }, // Conclusão do técnico sobre a manutenção
    total: { type: Number }, // Valor total da OS
    formasPagamento: { 
        type: [String], // Lista de formas de pagamento utilizadas
        enum: ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'PIX', 'Transferência' ], 
            
}},{versionKey:false})
module.exports = model ('OS', clienteSchema)