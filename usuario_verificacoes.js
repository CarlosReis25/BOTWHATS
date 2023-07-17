const {copiando_dados_cliente_verificado} = require ('./operando_dados_usuario')
const pool = require('./ConectarBancoIPTV');
const { deletando_clientes } = require('./Funcoes');
const { showMenu } = require('./menu');
const { showMenuadm } = require('./menuadm');

//=======================================================================================================
//Verificando Qual usuario é o correto  e captando seus dados 

async function verificacao_usuario_telefone(phoneNumber) {
    const result = await pool.query('SELECT ID FROM pessoal WHERE telefone = $1', [phoneNumber]);
    if (result.rows.length > 0) {
        const proprietarioId = result.rows[0].id;
        const acessoResult = await pool.query('SELECT * FROM IPTV WHERE proprietario = $1', [proprietarioId]);
        const acesso1 = acessoResult.rows;
        if (acesso1 != null && acesso1.length > 0) {
            acesso = proprietarioId;
            return acesso;
        } else {return console.log('Não retornou usuario verificação por telefone')}
    }
}
//=======================================================================================================
//Verificando Qual usuario é o correto  e captando seus dados 

async function verificacao_usuario_usuario(usuario, senha) {
    const result = await pool.query('SELECT proprietario FROM IPTV WHERE UPPER(usuario) = $1 AND UPPER(senha) = $2', [usuario.trim().toUpperCase(), senha.trim().toUpperCase()]);
    const acesso1 = result.rows;
    if (acesso1 != null && acesso1.length > 0) {
        const acesso = result.rows[0].proprietario;
        return acesso;
    }else{return console.log('Usuario e senha não tiveram retorno')
  }
}

//=============================================================================================================================
async function autenticar_acesso_cliente(client, message, cliente, phoneNumber){

  if (!cliente.marcador_submenu){
    
    if (!cliente.marcador_funcao){
      client.sendMessage(message.from, 'Deseja fazer login no chatbot puxando o seu numero de telefone ou inserindo usuario?:\n\n\n ```( 1 )``` *para puxar seu acesso via numero telefone* \n\n ```( 2 )``` *para usar seu usuario e senha:* ');
      cliente.marcador_funcao = 1;
    }
    else {
      switch (message.body.trim().toUpperCase()){

        case "1": 
          cliente.marcador_aleatorio = 1;
          cliente.marcador_submenu = 1;
          cliente.marcador_funcao = null;
          return autenticar_acesso_cliente(client, message, cliente, phoneNumber)
        case "2": 
        cliente.marcador_submenu = 1;
        cliente.marcador_funcao = null;
        return autenticar_acesso_cliente(client, message, cliente, phoneNumber)
        default: 
        cliente.marcador_funcao = null;
        return client.sendMessage(message.from, 'Por favor, digite uma opção valida:')
      }
    }
  }else {
    try {
      if (cliente.marcador_aleatorio == 1){
         cliente.acesso = await verificacao_usuario_telefone(phoneNumber);
         cliente.marcador_aleatorio = null;
         if (cliente.acesso) {
            console.log('Login efetuado com sucesso pelo telefone');
            await copiando_dados_cliente_verificado(cliente);
            cliente.marcador_menu = '1';
            cliente.marcador_submenu = null;
            cliente.marcador_aleatorio = null;
            if (phoneNumber == '556596889744'){return showMenuadm(client, message, cliente, phoneNumber);}else{
              return showMenu(client, message, cliente, phoneNumber);
              }
          } else {
            client.sendMessage(message.from, 'Nenhum usuario cadastrado com seu numero!');
            deletando_clientes(phoneNumber);
            return autenticar_acesso_cliente(client, message, cliente, phoneNumber);
          }
        }  else {
          if (!cliente.usuario) {
            await client.sendMessage(message.from, 'Digite um nome de usuário');
            cliente.usuario = message.body;
          } else {
            if (cliente.usuario !== message.body) {
              if (!cliente.senha) {
                await client.sendMessage(message.from, 'Agora digite sua senha de usuário:');
                cliente.usuario = message.body;
                cliente.senha = cliente.i;
              }
            }
          }

          if (cliente.senha === cliente.i) {
            if (cliente.senha === 2) {
              cliente.senha = message.body;
              cliente.acesso = await verificacao_usuario_usuario(cliente.usuario, cliente.senha);
              cliente.i = 320;

                if (cliente.acesso) {
                  console.log('Autenticado com sucesso');
                  await copiando_dados_cliente_verificado(cliente);
                  cliente.marcador_menu = '1';
                  cliente.marcador_submenu = null;
                  if (phoneNumber == '556596889744'){return showMenuadm(client, message, cliente, phoneNumber);}else{
                    return showMenu(client, message, cliente, phoneNumber);
                    }
                } 
                else {
                  deletando_clientes(phoneNumber);
                  console.log('Loop do cliente fechado');
                  return await client.sendMessage(message.from, 'Erro autenticação, por favor tente novamente!');
                }
              } 
              else {
                cliente.i = 2;
                cliente.senha = 2;
              }
            }
          }
        
    }
    catch (error) {
      console.error('Ocorreu um erro:', error);
      return console.log('Mensagem:', message);
    }
  }
}

module.exports = {
  autenticar_acesso_cliente
  };
