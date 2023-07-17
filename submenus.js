const { enviar_imagem_cliente, deletando_clientes } = require("./Funcoes");


async function suporte(client,message,cliente,phoneNumber){
    const {showMenu} = require('./menu.js');
    const {showMenuadm} = require('./menuadm.js');
    if (message.body.replace(/\s+/g, '').toUpperCase() !== '!SAIR'){     
        try {        
            if (!cliente.marcador_funcao){
                client.sendMessage(message.from, 'Você pode sair deste menu a qualquer momento digitando ```( !SAIR )```!\n\n\n' +`Olá ${cliente.nome} ${cliente.sobre_nome}\nParece que esta tendo algum problema!\n\n Descreva o seu problema: `)
                cliente.marcador_funcao = 1
            }else if (cliente.marcador_funcao = 1){
                cliente.marcador_submenu = null;
                cliente.marcador_funcao = null;
                cliente.marcador_menu = 1;
                cliente.mensagem_menu = null;
                await client.sendMessage(message.from, 'Seu problema esta sendo encaminhado para o responsavel, aguarde que entraremos em contato. \nTempo médio de espera 30min!');
                return await client.sendMessage('556596889744@c.us', `*O cliente* ${cliente.nome} ${cliente.sobre_nome}, esta tendo problemas\n *Telefone:* ${phoneNumber}\nProblema: ${message.body}`)
            }else {
                cliente.marcador_submenu = null;
                cliente.marcador_funcao = null;
                cliente.marcador_menu = 1;
                cliente.mensagem_menu = null;
                if (phoneNumber == '556596889744'){
                    return showMenuadm(client, message, cliente, phoneNumber);
                }else{
                    return showMenu(client, message, cliente, phoneNumber);
                }
            }
        } catch (error) {            
            return console.log('==============================================================\n'+error+'\nErro na função SUPORTE\n');
        }
    }else {
        cliente.marcador_submenu = null;
        cliente.marcador_funcao = null;
        cliente.marcador_menu = 1;
        cliente.mensagem_menu = null;
        if (phoneNumber == '556596889744'){
            return showMenuadm(client, message, cliente, phoneNumber);
        }else{
            return showMenu(client, message, cliente, phoneNumber);
        }
    }
}
async function reportarbug(client,message,cliente,phoneNumber){
    const {showMenu} = require('./menu.js');
    const {showMenuadm} = require('./menuadm.js');
    if (message.body.replace(/\s+/g, '').toUpperCase() !== '!SAIR'){
        try {
            if(!cliente.marcador_funcao_mensagem){
                client.sendMessage(message.from, 'Você pode sair deste menu a qualquer momento digitando ```( !SAIR )```!\n\n\n '+
                `Olá, *${cliente.nome} ${cliente.sobre_nome}*!\nLamentamos que tenha encontrado dificuldades ao assistir, vamos começar:\n\n *Diga algumas informações sobre seu aparelho como MODELO, ANO:*` )
                cliente.marcador_funcao_mensagem = message.body;
            }else if (!cliente.marcador_funcao){
                client.sendMessage(message.from, `*Descreva o momento exato em que o erro ocorre:*\n ` + 
                '```Exemplo: (Momento: ao entrar na sub categorias de filmes dentro da categoria netflix).``` \n');
                cliente.marcador_funcao_mensagem = message.body;
                cliente.marcador_funcao = 1;
            }else if (cliente.marcador_funcao == 1){
                client.sendMessage(message.from, `*Descreva o bug:*\n\n ` + 
                '```Exemplo: (bug: Aplicativo entra em outra aba, e trava.).``` \n');
                cliente.marcador_aleatorio = message.body;
                cliente.marcador_funcao = 2;
            } else {
                client.sendMessage('556596889744@c.us', `Numero telefone: ${phoneNumber}\nNome: ${cliente.nome} ${cliente.sobre_nome}\n Dispositivo: ${cliente.marcador_funcao_mensagem}\nMomento do bug: ${cliente.marcador_aleatorio}\nDescrição do bug: ${message.body}`)
                client.sendMessage(message.from, 'Iremos estar repassando o acontecido para o suporte, e daremos um retorno assim que encontrado a causa do problema!');     
                
                cliente.marcador_submenu = null;
                cliente.marcador_funcao_mensagem = null;
                cliente.marcador_funcao = null;
                cliente.marcador_menu = 1;
                cliente.mensagem_menu = null;
                cliente.marcador_aleatorio = null;
                if (phoneNumber == '556596889744'){
                    return showMenuadm(client, message, cliente, phoneNumber);
                }else{
                    return showMenu(client, message, cliente, phoneNumber);
                }
            }
        } catch (error) {
            deletando_clientes(phoneNumber);
            return console.log('==============================================================\n'+error+'\nErro na função REPORTAR BUG\n');
        }
    }else {
        cliente.marcador_submenu = null;
        cliente.marcador_funcao_mensagem = null;
        cliente.marcador_funcao = null;
        cliente.marcador_menu = 1;
        cliente.mensagem_menu = null;
        if (phoneNumber == '556596889744'){
            return showMenuadm(client, message, cliente, phoneNumber);
        }else{
            return showMenu(client, message, cliente, phoneNumber);
        }
    }
}
async function enviar_data(client, message, cliente){
    try{
        cliente.marcador_submenu = null;
        cliente.marcador_menu = 1;
        cliente.mensagem_menu = null;
        return await client.sendMessage(message.from, 'Olá *'+ cliente.nome + '* *' + cliente.sobre_nome + '*!\n'+'Seu usario é: '+ cliente.usuario +'\nE sua senha: ' + cliente.senha+
        '\n\nSua data de vencimento é: ( *' + cliente.data_vencimento + '* )\n'+
        'Pague agora e evite o vencimento de seu plano\n\n*Será cobrado o valor de R$ 5,00 por acesso como taxa de reativação, após o vencimento*');
    } catch (error){
        return console.log('==============================================================\n'+error+'\nErro na função ENVIAR DATA\n');
    }
}
async function novidades(client, message, cliente, phoneNumber){
    const {showMenu} = require('./menu.js');
    const {showMenuadm} = require('./menuadm.js');
    const pool = require('./ConectarBancoIPTV');
    
    if (message.body.replace(/\s+/g, '').toUpperCase() !== '!SAIR'){
        try {
            if (!cliente.marcador_funcao_mensagem){
                client.sendMessage(message.from, 'Você pode sair deste menu a qualquer momento digitando ```( !SAIR )```!\n\n\n '+'Você deseja ver um menu de filmes ou series?\n\n( 1 ) para Filmes e ( 2 ) para Series:');
                cliente.marcador_funcao_mensagem = message.body;

            } else if (!cliente.marcador_funcao){
                if (cliente.marcador_funcao_mensagem !== message.body){
                cliente.marcador_funcao_mensagem = message.body;
                cliente.marcador_funcao = 1;
                return novidades(client,message,cliente,phoneNumber);
                }

            } else if(cliente.marcador_funcao){
                if (cliente.marcador_funcao_mensagem.trim() === '1') {
                    let listafilme = 'Aqui esta a lista com todos os filmes da semana\n atualizaremos essa lista semanalmente nas (segunda-feira)\n\n'
                    let result_filmes = await pool.query('SELECT nomefilmes from filmes');
                    let endereco = './Media/News/1.jpg';

                    for (const filmes of result_filmes.rows) {
                        if (filmes.nomefilmes.charAt(0) === '*' ) {
                            listafilme += '\n\n📌  ' + filmes.nomefilmes.toUpperCase() + '*' + ' 📌\n';
                        }else{
                        listafilme += '\n⚜️  ' + filmes.nomefilmes;
                        }
                    }
                    cliente.marcador_funcao = null;
                    cliente.marcador_funcao_mensagem= null;
                    cliente.marcador_menu = 1;
                    cliente.mensagem_menu = null;
                    return enviar_imagem_cliente(client, message, listafilme + '\n\n*Aqui esta!*\n```Envie qualquer mensagem para abrir o menu!```', endereco);
                
                }else if (cliente.marcador_funcao_mensagem.trim() === '2') {
                    let listaseries = 'Aqui esta a lista com todas as series atualizadas da semana\n atualizaremos essa lista semanalmente nas (segundas-feiras)\n\n'
                    let result_series = await pool.query('SELECT nomeseries from series');
                    let endereco = './Media/News/2.jpg';

                    for (const series of result_series.rows) {
                        if (series.nomeseries.charAt(0) === '*' ) {
                            listaseries += '\n\n📌  ' + series.nomeseries.toUpperCase() + '*' + ' 📌\n';
                        }else{
                        listaseries += '\n⚜️  ' + series.nomeseries;
                        }
                    }
                    cliente.marcador_funcao = null;
                    cliente.marcador_funcao_mensagem= null;
                    cliente.marcador_menu = 1;
                    cliente.mensagem_menu = null;
                    cliente.marcador_submenu = null;
                    return enviar_imagem_cliente(client, message, listaseries + '\n\n*Aqui esta!*\n```Envie qualquer mensagem para abrir o menu!```', endereco);
                }else { 
                    client.sendMessage(message.from, '\n\nPor favor, escolha uma opção valida')
                    cliente.marcador_funcao = null;
                    cliente.marcador_funcao_mensagem= null;
                    return novidades(client, message, cliente, phoneNumber);
                }
            } 
        } 
        catch (error) {
            deletando_clientes(phoneNumber);
            return console.log('==============================================================\n'+error+'\nErro na função NOVIDADES\n');
        }
    } else {
        cliente.marcador_submenu = null;
        cliente.marcador_funcao_mensagem = null;
        cliente.marcador_funcao = null;
        cliente.marcador_menu = 1;
        cliente.mensagem_menu = null;
        if (phoneNumber == '556596889744'){
            return showMenuadm(client, message, cliente, phoneNumber);
        }else{
            return showMenu(client, message, cliente, phoneNumber);
        }
    }
}
async function sugestao_aplicativo(client, message, cliente, phoneNumber){
    const {showMenu} = require('./menu.js');
    const {showMenuadm} = require('./menuadm.js');
    if (message.body.replace(/\s+/g, '').toUpperCase() !== '!SAIR'){
        try {
            if(!cliente.marcador_funcao_mensagem){
            client.sendMessage(message.from, 'caso queira sair desse menu, digite !SAIR a qualquer momento.\n\n⚠️```NÃO UTILIZE ESTE MENU PARA SUGESTÕES DE FILMES```⚠️ \n\n*Digite sua sugestão para o aplicativo:* ')
            cliente.marcador_funcao_mensagem = message.body;

            }else if(!cliente.marcador_funcao){
            cliente.marcador_funcao_mensagem = message.body;
            cliente.marcador_funcao = 1;
            client.sendMessage(message.from, 'Você confirma sua sugestão?\n ```( S )``` para *SIM*  |  ```( N )``` para *NÃO*');

            }else { 
                if(cliente.marcador_funcao_mensagem !== message.body){
                    
                    if(message.body.trim().toUpperCase() === 'S'){          
                        client.sendMessage('120363143695613002@g.us', ('Numero de telefone: '+message.from.replace(/@c\.us$/, '')) +'\n'+'Nome do cliente: '+cliente.nome+' '+cliente.sobre_nome+'\n' + 'Sugestão: ' + cliente.marcador_funcao_mensagem);
                        client.sendMessage(message.from, 'Agradecemos sua sugestão, iremos análisa-la e retornaremos em breve com uma resposta!');
                        
                        cliente.marcador_submenu = null;
                        cliente.marcador_funcao_mensagem = null;
                        cliente.marcador_funcao = null;
                        cliente.marcador_menu = 1;
                        cliente.mensagem_menu = null;
                        if (phoneNumber == '556596889744'){
                            return showMenuadm(client, message, cliente, phoneNumber);
                        }else{
                            return showMenu(client, message, cliente, phoneNumber);
                        }
                    } 
                    else if (message.body.trim().toUpperCase() === 'N'){
                        cliente.marcador_funcao_mensagem = null;
                        cliente.marcador_funcao = null;
                        return sugestao_aplicativo(client, message, cliente, phoneNumber);
                    } else {
                        client.sendMessage(message.from, 'Opção invalida, vamos começar novamente, caso queira sair digite (!sair)');
                        cliente.marcador_funcao_mensagem = null;
                        cliente.marcador_funcao = null;
                        return sugestao_aplicativo(client, message, cliente, phoneNumber);
                    }
                }
            }
        } catch (error) {
            deletando_clientes(phoneNumber);
            client.sendMessage(message.from, 'ERROR');
            return console.log('==============================================================\n'+error+'\nErro na função SUGESTÃO APLICATIVO\n');
        }
    }else {
        cliente.marcador_submenu = null;
        cliente.marcador_funcao_mensagem = null;
        cliente.marcador_funcao = null;
        cliente.marcador_menu = 1;
        cliente.mensagem_menu = null;
        if (phoneNumber == '556596889744'){ 
            return showMenuadm(client, message, cliente, phoneNumber);
        }else{
            return showMenu(client, message, cliente, phoneNumber);
        }
    }
}
async function sugestao_chatbot(client, message, cliente, phoneNumber){
    const {showMenu} = require('./menu.js');
    const {showMenuadm} = require('./menuadm.js');
    if (message.body.replace(/\s+/g, '').toUpperCase() !== '!SAIR'){
        
        try {
            if(!cliente.marcador_funcao_mensagem){
            client.sendMessage(message.from, 'Caso queira sair desse menu, digite !SAIR a qualquer momento.\n\n*Digite sua sugestão para o chatbot:* ')
            cliente.marcador_funcao_mensagem = message.body;
            }else if(!cliente.marcador_funcao){
            cliente.marcador_funcao_mensagem = message.body;
            cliente.marcador_funcao = 1;
            client.sendMessage(message.from, 'Você confirma sua sugestão?\n ```( S )``` para *SIM*  |  ```( N )``` para *NÃO*');
            }else { 
                if(cliente.marcador_funcao_mensagem !== message.body){
                    
                    if(message.body.trim().toUpperCase() === 'S'){
                        client.sendMessage('120363160954888519@g.us', ('Numero de telefone: '+message.from.replace(/@c\.us$/, '')) +'\n'+'Nome do cliente: '+cliente.nome+' '+cliente.sobre_nome+'\n' + 'Sugestão: ' + cliente.marcador_funcao_mensagem);
                        client.sendMessage(message.from, 'Agradecemos sua sugestão, iremos análisa-la e retornaremos em breve com a resposta sobre a viabilidade da funcionalidade');

                        cliente.marcador_submenu = null;
                        cliente.marcador_funcao_mensagem = null;
                        cliente.marcador_funcao = null;
                        cliente.marcador_menu = 1;
                        cliente.mensagem_menu = null;
                        if (phoneNumber == '556596889744'){
                            return showMenuadm(client, message, cliente, phoneNumber);
                        }else{
                            return showMenu(client, message, cliente, phoneNumber);
                        }
                    } 
                    else if (message.body.trim().toUpperCase() === 'N'){
                        cliente.marcador_funcao_mensagem = null;
                        cliente.marcador_funcao = null;
                        return sugestao_chatbot(client, message, cliente, phoneNumber);
                    } else {
                        client.sendMessage(message.from, 'Opção invalida, vamos começar novamente, caso queira sair digite (!sair)');
                        cliente.marcador_funcao_mensagem = null;
                        cliente.marcador_funcao = null;
                        return sugestao_chatbot(client, message, cliente, phoneNumber);
                    }
                }
            }
        } catch (error) {
            deletando_clientes(phoneNumber);
            client.sendMessage(message.from, 'ERROR');
            return console.log('==============================================================\n'+error+'\nErro na função SUGESTÃO CHATBOT');
        }
    }else {
        cliente.marcador_submenu = null;
        cliente.marcador_funcao_mensagem = null;
        cliente.marcador_funcao = null;
        cliente.marcador_menu = 1;
        cliente.mensagem_menu = null;
        if (phoneNumber == '556596889744'){
            return showMenuadm(client, message, cliente, phoneNumber);
        }else{
            return showMenu(client, message, cliente, phoneNumber);
        }
    }
}
async function qrcode_pagamento(client, message, cliente){
    const {formatarData2} = require('./Funcoes');
    const data_atual_formatada = formatarData2(new Date());
    
    try{
    if (formatarData2(cliente.data_vencimento) >= data_atual_formatada ){
        let legenda = `Leia o QR-code ou utilize o código a baixo.\n data de vencimento em: ${cliente.data_vencimento}\n\nQR:`;
        let endereco = (`./Media/Boletos/prazo/${cliente.acesso.trim()}.jpg`);
        
        await enviar_imagem_cliente(client, message, legenda, endereco);               
        cliente.marcador_submenu = null;
        cliente.marcador_menu = 1;
        cliente.mensagem_menu = null;
        await client.sendMessage(message.from, cliente.code_qr);
        return await client.sendMessage(message.from, 'Agradecemos pelo seu contato!');
    }else {
        let legenda = `Leia o QR-code ou utilize o código a baixo.\n  seu vencimento foi em: ${cliente.data_vencimento}, será cobrado um valor de R$ 5,00/acesso para reativação do mesmo.\n\nQR:`;
        let endereco = (`./Media/Boletos/vencido/${cliente.acesso.trim()}.jpg`);

        await enviar_imagem_cliente(client, message, legenda, endereco);
        cliente.marcador_submenu = null;
        cliente.marcador_menu = 1;
        cliente.mensagem_menu = null;
        await client.sendMessage(message.from, cliente.code_qr_venc);
        return await client.sendMessage(message.from, 'Agradecemos pelo seu contato!');
    }
    }catch (error){
        return console.log('==============================================================\n'+error+'\nErro na função QR-CODE PAGAMENTO\n');
    }
}
async function sugestao_filmes(client, message, cliente, phoneNumber){
    const {showMenu} = require('./menu.js');
    const {showMenuadm} = require('./menuadm.js');
    if (message.body.replace(/\s+/g, '').toUpperCase() !== '!SAIR'){
        try {
            if(!cliente.marcador_funcao_mensagem){
            await client.sendMessage(message.from, 'Caso queira sair desse menu, digite !SAIR a qualquer momento.\n\nPara começar, digite o nome do filme: ')
            cliente.marcador_funcao_mensagem = message.body;
            }else if(!cliente.marcador_funcao){
            cliente.marcador_funcao_mensagem = message.body;
            cliente.marcador_funcao = 1;
            await client.sendMessage(message.from, 'O nome do filme esta correto?\n ```( S )``` para *SIM*  |  ```( N )``` para *NÃO*');
            
            }else {  
                if(cliente.marcador_funcao_mensagem !== message.body){
                    if(message.body.trim().toUpperCase() === 'S'){
                       await client.sendMessage('120363143309301528@g.us', `ID: ${cliente.acesso.trim()} \nNome do cliente: ${cliente.nome} ${cliente.sobre_nome}\nFilme: ${cliente.marcador_funcao_mensagem}`);
                        await client.sendMessage(message.from, 'Obrigado pelo seu feedback, agradecemos sua sua sugestão, em breve estará disponivel no aplicativo.')
                        cliente.marcador_submenu = null;
                        cliente.marcador_funcao_mensagem = null;
                        cliente.marcador_funcao = null;
                        cliente.marcador_menu = 1;
                        cliente.mensagem_menu = null;
                        if (phoneNumber == '556596889744'){
                            return showMenuadm(client, message, cliente, phoneNumber);
                        }else{
                            return showMenu(client, message, cliente, phoneNumber);
                        }
                    } 
                    else if (message.body.trim().toUpperCase() === 'N'){
                        cliente.marcador_funcao_mensagem = null;
                        cliente.marcador_funcao = null;
                        return sugestao_filmes(client, message, cliente, phoneNumber);
                    } else {
                        client.sendMessage(message.from, 'Opção invalida, vamos começar novamente, caso queira sair digite (!sair)');
                        cliente.marcador_funcao_mensagem = null;
                        cliente.marcador_funcao = null;
                        return sugestao_filmes(client, message, cliente, phoneNumber);
                    }
                }
            }
        } catch (error) {
            deletando_clientes(phoneNumber);
            return console.log('==============================================================\n'+error+'\nErro na função SUGESTÃO DE FILMES\n');
        }
    }else {
        cliente.marcador_submenu = null;
        cliente.marcador_funcao_mensagem = null;
        cliente.marcador_funcao = null;
        cliente.marcador_menu = 1;
        cliente.mensagem_menu = null;
        if (phoneNumber == '556596889744'){
            return showMenuadm(client, message, cliente, phoneNumber);
        }else{
            return showMenu(client, message, cliente, phoneNumber);
        }
    }
}

module.exports = {
 sugestao_filmes,
 qrcode_pagamento,
 sugestao_chatbot,
 sugestao_aplicativo,
 novidades,
 enviar_data,
 reportarbug,
 suporte
};