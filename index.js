const autenticarCliente = require("./AutenticarNumero");
const { showMenu } = require("./menu.js");
const { showMenuadm } = require("./menuadm.js");
const { autenticar_acesso_cliente } = require("./usuario_verificacoes.js");
const { criar_novo_cliente } = require("./operando_dados_usuario.js");
const { formatarData } = require('./Funcoes');

const client = autenticarCliente();
const clientes = new Map();
let cliente;

client.on("message", async (message) => {
  const data_atual_formatada = formatarData(new Date());
  const phoneNumber = message.from.replace(/@c\.us$/, "");
  console.log(`Numero telefone: ${phoneNumber}  Mensagem:  ${message.body}  Data: ${data_atual_formatada}`);

  if(!clientes.get(phoneNumber)){
    cliente = criar_novo_cliente(clientes, phoneNumber);
  }
  
  if (phoneNumber == '556596889744') {
    if (message.type === 'chat') {
      if (!message.author) {
        if (!cliente.acesso) {
          await autenticar_acesso_cliente(client, message, cliente, phoneNumber, clientes);
        } else
          if (cliente.acesso) {
            await showMenuadm(client, message, cliente, phoneNumber);
          }
      } else {
        await client.sendMessage(message.from, 'Este bot não pode ser usado em grupos');
      }
    } else {
      await client.sendMessage(message.from, 'Por favor, envie somente mensagem de texto!');
      message.body = null;
    }
  } else {
    if (message.type === 'chat') {
      if (!message.author) {
        if (!cliente.acesso) {
          await autenticar_acesso_cliente(client, message, cliente, phoneNumber, clientes);
        }
        if (cliente.acesso) {
          await showMenu(client, message, cliente, phoneNumber);
        }
      } else {
        await client.sendMessage(message.from, 'Este bot não pode ser usado em grupos');
      }
    } else {
      await client.sendMessage(message.from, 'Por favor, envie somente mensagem de texto!');
      message.body = null;
    }
  }
});

module.exports = {
  clientes
};
