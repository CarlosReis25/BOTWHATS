const { enviar_imagem_cliente, deletando_clientes } = require("./Funcoes");
const { sugestao_filmes, sugestao_chatbot, sugestao_aplicativo, qrcode_pagamento, novidades, suporte, enviar_data, reportarbug} = require("./submenus.js");
const {avisovencimento, enviarmensagem} = require('./submenuadm.js');

//=============================================================================================
// Menu principal
async function showMenuadm(client, message, cliente, phoneNumber) {
  if (cliente.marcador_menu) {
    let legenda =
      "*P2ƧPΣΣD*\n\n\n" +
      "Olá, sou o chatbot da P2Speed, seja bem vindo(a)!\n\n" +
      "Escolha uma das opções a seguir:\n\n" +
      "1 - 💸Qr-Code pagamento💸\n" +
      "2 - ⏳Vencimento de sua fatura⏳\n" +
      "3 - 🔥 Novidades de conteúdos 🔥\n" +
      "4 - 🧠 Faça sugestões de filmes 🧠\n" +
      "5 - 🤖 Sugestão para o chatbot 🤖\n" +
      "6 - 📲 Sugestão sobre a IPTV 📲\n" +
      "7 - ⚠️Reporte um bug⚠️\n" +
      "8 - 🦺Suporte🦺\n" +
      "9 - 🩸Avisar sobre vencimento🩸\n"+
      "10- 🩸Mensagem para cliente🩸\n"+
      "99 - ✈️Sair do acesso✈️";

    let ponteiro_imagem = Math.floor(Math.random() * 5) + 1;
    let endereco = (`./Media/Logo/${ponteiro_imagem}.jpg`);
    await enviar_imagem_cliente(client, message, legenda, endereco);
    
    cliente.marcador_menu = null;
    cliente.marcador_submenu = null;
  } else {
    if (!cliente.marcador_submenu) {
      cliente.mensagem_menu = message.body.trim();
      cliente.marcador_submenu = 1;
    }
    
    switch (cliente.mensagem_menu) {
      case "1":
        return await qrcode_pagamento(client, message, cliente, phoneNumber);
      case "2":
        return await enviar_data(client, message, cliente);
      case "3":
        return await novidades(client, message, cliente, phoneNumber);
      case "4":
        return await sugestao_filmes(client, message, cliente, phoneNumber);
      case "5":
        return await sugestao_chatbot(client, message, cliente, phoneNumber);
      case "6":
        return await sugestao_aplicativo(client, message, cliente, phoneNumber);
      case "7":
        return await reportarbug(client,message,cliente,phoneNumber);
      case "8":
        return await suporte(client,message,cliente,phoneNumber);
      case "9":
        return await avisovencimento(client,message,cliente,phoneNumber);
      case "10":
        return await enviarmensagem(client,message,cliente,phoneNumber);
      case "99":
        deletando_clientes(phoneNumber);
        return await client.sendMessage(message.from, "Saindo do seu usuario!");
      default:
      await client.sendMessage("Opção inválida, por favor digite uma das opções disponiveis!");
      cliente.marcador_submenu = null;
      return await showMenuadm(client, message, cliente, phoneNumber);
    }
  }
}

module.exports = {
  showMenuadm
};
