const fs = require("fs");
const { MessageMedia } = require("whatsapp-web.js");

function deletando_clientes(phoneNumber) {
  const { clientes: importedClientes } = require("./index.js");
  return importedClientes.delete(phoneNumber);
}
async function enviar_imagem_cliente(client, message, legenda, endereco) {
  
  const imagePath = endereco;
  if (fs.existsSync(imagePath)) {
    
    const imageBuffer = fs.readFileSync(imagePath);
    const media = new MessageMedia(
      "image/jpeg",
      imageBuffer.toString("base64"),
    );
    return await client.sendMessage(message.from, media, { caption: legenda });

  } else {
    return console.log("O arquivo de imagem não existe.");
  }

}
function formatarData(data) {
  let dataObj;

  if (data instanceof Date) {
    dataObj = data;
    dataObj.setHours(dataObj.getHours() - 4);
  } else {
    const partes = data.split(' '); 
    const dataPartes = partes[0].split('/'); 
    const horaPartes = partes[1].split(':'); 

    const dia = parseInt(dataPartes[0], 10);
    const mes = parseInt(dataPartes[1], 10);
    const ano = parseInt(dataPartes[2], 10);
    const hora = parseInt(horaPartes[0], 10);
    const minuto = parseInt(horaPartes[1], 10);

    dataObj = new Date(ano, mes - 1, dia, hora, minuto);
  }

  const dia = dataObj.getDate();
  const mes = dataObj.getMonth() + 1;
  const ano = dataObj.getFullYear();
  const hora = dataObj.getHours();
  const minuto = dataObj.getMinutes();

  return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano} ${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
}
function formatarData2(data) {
  let dataObj;

  if (data instanceof Date) {
    dataObj = data;
    dataObj.setHours(dataObj.getHours() - 4);
  } else {
    const partes = data.split(' '); 
    const dataPartes = partes[0].split('/'); 
    const horaPartes = partes[1].split(':'); 

    const dia = parseInt(dataPartes[0], 10);
    const mes = parseInt(dataPartes[1], 10) - 1; 
    const ano = parseInt(dataPartes[2], 10);
    const hora = parseInt(horaPartes[0], 10);
    const minuto = parseInt(horaPartes[1], 10);

    dataObj = new Date(ano, mes, dia, hora, minuto);
  }

  return dataObj;
}

module.exports = {
  enviar_imagem_cliente,
  deletando_clientes,
  formatarData,
  formatarData2
};