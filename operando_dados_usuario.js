const pool = require('./ConectarBancoIPTV');
const {formatarData} = require('./Funcoes');

//========================================================================================================
//Pega todas as variáveis e transfere para o cliente
async function copiando_dados_cliente_verificado(cliente) {


  const result_inicio = await pool.query('SELECT data_inicio FROM IPTV WHERE $1 = proprietario', [cliente.acesso]);
  const dataInicio = result_inicio.rows[0].data_inicio;
  const dataInicioFormatada = formatarData(dataInicio);
  cliente.data_inicio = dataInicioFormatada;

  const result_vencimento = await pool.query('SELECT data_vencimento FROM IPTV WHERE $1 = proprietario', [cliente.acesso]);
  const dataVencimento = result_vencimento.rows[0].data_vencimento;
  const dataVencimentoFormatada = formatarData(dataVencimento);
  cliente.data_vencimento = dataVencimentoFormatada;

  const result_tipo_sistema = await pool.query('SELECT tipo from tipo_sistema where id = (SELECT tipo_sistema FROM IPTV WHERE $1 = proprietario)', [cliente.acesso]);
  cliente.tipo_sistema = result_tipo_sistema.rows[0].tipo_sistema;

  const result_codigo_qr = await pool.query('SELECT codigo_qr FROM boletosPagamentos b WHERE $1 = b.usuario', [cliente.acesso.trim()]);
  cliente.code_qr = result_codigo_qr.rows[0].codigo_qr;
  
  const result_codigo_qr_vencido = await pool.query('SELECT codigo_qr_vencido FROM boletosPagamentos b WHERE $1 = b.usuario', [cliente.acesso.trim()]);
  cliente.code_qr_venc = result_codigo_qr_vencido.rows[0].codigo_qr_vencido;

  const result_usuario = await pool.query('SELECT usuario FROM IPTV WHERE $1 = proprietario', [cliente.acesso]);
  cliente.usuario = result_usuario.rows[0].usuario;

  const result_senha = await pool.query('SELECT senha FROM IPTV WHERE $1 = proprietario', [cliente.acesso]);
  cliente.senha = result_senha.rows[0].senha;

  const result_nome = await pool.query('SELECT nome FROM pessoal WHERE $1 = id', [cliente.acesso]);
  cliente.nome = result_nome.rows[0].nome;

  const result_sobre_nome = await pool.query('SELECT sobre_nome FROM pessoal WHERE $1 = id', [cliente.acesso]);
  cliente.sobre_nome = result_sobre_nome.rows[0].sobre_nome;

  const result_endereco = await pool.query('SELECT endereco FROM pessoal WHERE $1 = id', [cliente.acesso]);
  cliente.endereco = result_endereco.rows[0].endereco;

  const result_telefone = await pool.query('SELECT telefone FROM pessoal WHERE $1 = id', [cliente.acesso]);
  cliente.telefone = result_telefone.rows[0].telefone;
  return; 

}
//=========================================================================================================================
//Cria um novo cliente
function criar_novo_cliente(clientes, phoneNumber) {
  let cliente = clientes.get(phoneNumber);

  cliente = {
    acesso: null,
    usuario: null,
    senha: null,
    data_inicio: null,
    data_vencimento: null,
    tipo_sistema: null,
    nome: null,
    sobre_nome: null,
    endereco: null,
    telefone: null,
    i: 90,
    tipo_acesso: null,
    code_qr: null,
    code_qr_venc: null,
    mensagem_menu: null,
    marcador_menu: null,
    marcador_submenu: null,
    marcador_funcao: null,
    marcador_funcao_mensagem: null,
    marcador_funcao_mensagem2: null,
    marcador_aleatorio: null
  };
  clientes.set(phoneNumber, cliente);
  return cliente;
}

module.exports = {
  copiando_dados_cliente_verificado,
  criar_novo_cliente
}
