const pool = require('./ConectarBancoIPTV');
const {formatarData2} = require('./Funcoes.js');

async function avisovencimento(client, message, cliente, phoneNumber) {
    const { showMenuadm } = require('./menuadm.js');
    cliente.marcador_funcao_mensagem2 = '';
    
    try{
        if(message.body.replace(/\s+/g, '').toUpperCase() !== '!SAIR'){

            if (!cliente.marcador_funcao) {
                let result_vencimento = null;
                let data_atual_formatada = null;
                const lista_clientes_vencendo = [];
                
                result_vencimento = await pool.query('SELECT pt.data_vencimento, pt.proprietario, pt.usuario, ps.nome, ps.sobre_nome FROM IPTV pt JOIN pessoal ps ON pt.proprietario = ps.id');

                data_atual_formatada = formatarData2(new Date(new Date().setDate(new Date().getDate() + 6)));

                for (let i = 0; i < result_vencimento.rows.length ; i++) {
                    lista_clientes_vencendo[i] = `\n\nNome: ${result_vencimento.rows[i].nome} ${result_vencimento.rows[i].sobre_nome}\nVencimento: ${result_vencimento.rows[i].data_vencimento}\nUsuario: ${result_vencimento.rows[i].usuario} ID: ${result_vencimento.rows[i].proprietario.trim()}`;
                    
                    if(formatarData2(result_vencimento.rows[i].data_vencimento) < data_atual_formatada){
                        cliente.marcador_funcao_mensagem2 += lista_clientes_vencendo[i];
                    }
                }
                
                if (!cliente.marcador_funcao_mensagem2){
                    await client.sendMessage(message.from, `Não encontramos nenhum cliente com data de vencimento próxima`);
                    cliente.marcador_menu = 1;
                    cliente.mensagem_menu = null;
                    cliente.marcador_submenu = null;
                    cliente.marcador_funcao = null;
                    cliente.marcador_funcao_mensagem2 = null;
                    return showMenuadm(client, message, cliente, phoneNumber);
                }else{
                    await client.sendMessage(message.from, `Caso queira sair desse menu, digite *!SAIR* a qualquer momento.\n\n\nAqui está a lista de usuários cujo vencimento está próximo: ${cliente.marcador_funcao_mensagem2}`);
                    await client.sendMessage(message.from,'Quer enviar um aviso para os usuários?\n( 1 ) Para sim e ( 2 ) Para não');
                    cliente.marcador_funcao = 1;
                }
            
            } else if (cliente.marcador_funcao === 1) {
                cliente.marcador_funcao_mensagem = message.body;
                cliente.marcador_funcao = 2;
                return avisovencimento(client, message, cliente, phoneNumber);
            
            } else if (cliente.marcador_funcao === 2) {
                
                switch (cliente.marcador_funcao_mensagem) {
                case '1':
                    client.sendMessage(message.from,'Caso queira sair desse menu, digite *!SAIR* a qualquer momento.\n\n\nEnvie o ID dos usuários separado por barra de espaço, da seguinte forma:\n```1/2/3/10/25/4```');
                    cliente.marcador_funcao = 3;
                    break;
                case '2':
                    client.sendMessage(message.from,'OK, obrigado!');
                    cliente.marcador_menu = 1;
                    cliente.mensagem_menu = null;
                    cliente.marcador_submenu = null;
                    cliente.marcador_funcao = null;
                    cliente.marcador_funcao_mensagem = null;
                    cliente.marcador_funcao_mensagem2 = null;
                    return showMenuadm(client, message, cliente, phoneNumber);
                default:
                    cliente.marcador_funcao = null;
                    client.sendMessage(message.from,'Digite uma opção válida!');
                    return avisovencimento(client, message, cliente, phoneNumber);
                }

            } else if (cliente.marcador_funcao === 3) {
                let result_telefone = null;
                const marcadorID = [];
                const phone = [];
                const vencimento = [];
                const nome = [];
                const mensagem = message.body.split('/');

                
                for (let i = 0; i < mensagem.length; i++) {

                    if (mensagem[i].match(/^\d[\d]?$/)){
                        marcadorID.push(parseInt(mensagem[i], 10));
                    }else{
                        await client.sendMessage(message.from, `Valor invalido: ${mensagem[i]}`);
                    }
                }
                
                for (let i = 0; i < marcadorID.length; i++) {
                    try {
                        result_telefone = await pool.query(`SELECT ps.telefone, ps.nome, ps.sobre_nome, pt.data_vencimento FROM pessoal ps JOIN IPTV pt ON pt.proprietario = ps.id WHERE '${marcadorID[i]}' = ps.id`);
                    } catch (error) {
                        client.sendMessage(message.from, 'Ocorreu um erro durante a busca no banco de dados pelos proprietarios, nomes e telefones\n\n');
                        console.log('//===========================================================\n'+error+'\n')
                        cliente.marcador_menu = 1; 
                        cliente.marcador_funcao_mensagem = null;
                        cliente.marcador_funcao_mensagem2 = null;
                        cliente.marcador_submenu = null;
                        cliente.mensagem_menu = null;
                        cliente.marcador_funcao = null;
                        return showMenuadm(client, message, cliente, phoneNumber);     
                    }
                    if (result_telefone.rows.length > 0){
                        if (!phone.includes(result_telefone.rows[0].telefone)) {
                            phone[i] = result_telefone.rows[0].telefone;
                            vencimento[i] = result_telefone.rows[0].data_vencimento;
                            nome[i] = `${result_telefone.rows[0].nome} ${result_telefone.rows[0].sobre_nome}`;
                        }
                    } else {
                        await client.sendMessage(message.from, `\n\n*O ID: ${marcadorID[i]}*\n *não foi encontrado na base de dados!*\n\n`)
                    }
                }
                if (phone.length){
                    for (let i = 0; i < phone.length; i++) {
                        try {
                            await client.sendMessage(`${phone[i]}@c.us`, `Olá ${nome[i]}, verificamos que a sua fatura está próxima do vencimento\n*Dia de vencimento: ${vencimento[i]}*\n\nRealize o pagamento para não ficar sem nossas novidades, contamos com a sua contribuição para tornar a P2SPEED cada vez melhor!`);
                            client.sendMessage(message.from,`O envio da mensagem para\n *Nome: ${nome[i]}*\n*Telefone: ${phone[i]}*\n foi enviado com sucesso!`)
                        } catch (error) {
                                client.sendMessage(message.from,`O envio da mensagem para\n *Nome: ${nome[i]}*\n*Telefone: ${phone[i]}*\nnão foi enviada, por algum erro em sua execução`)
                                console.log('//===========================================================\n'+error+'\n')
                                continue;
                        }
                    }
                    
                    cliente.marcador_menu = 1;
                    cliente.mensagem_menu = null;
                    cliente.marcador_submenu = null;
                    cliente.marcador_funcao = null;
                    cliente.marcador_funcao_mensagem = null;
                    cliente.marcador_funcao_mensagem2 = null;
                    return showMenuadm(client, message, cliente, phoneNumber);    
                } else {
                    await client.sendMessage(message.from, 'Nenhum dos IDs digitados foram encontrados, por favor verifique novamente os clientes e envie os IDs corretos' );
                    cliente.marcador_funcao = 3;
                    return avisovencimento(client, message, cliente, phoneNumber);
                }
            
            }
        }else{cliente.marcador_menu = 1;
            cliente.mensagem_menu = null;
            cliente.marcador_submenu = null;
            cliente.marcador_funcao = null;
            cliente.marcador_funcao_mensagem = null;
            cliente.marcador_funcao_mensagem2 = null;
            return showMenuadm(client, message, cliente, phoneNumber);   
        }
    }catch (error) {
        return console.log('==============================================================\n'+error+'\nErro na função AVISO VENCIMENTO\n');
    }
}
async function enviarmensagem(client, message, cliente, phoneNumber) {
    const { showMenuadm } = require('./menuadm.js');
cliente.marcador_funcao_mensagem2 = '';
    try{
        if(message.body.replace(/\s+/g, '').toUpperCase() !== '!SAIR'){

            if (!cliente.marcador_funcao){
                client.sendMessage(message.from, `Caso queira sair desse menu, digite *!SAIR* a qualquer momento.\n\n\nOlá ${cliente.nome} ${cliente.sobre_nome}. que tipo de mensagem vc deseja enviar?`+
                `\n1 - 🩸Adição de filmes🩸`+
                `em breve`
                )
                cliente.marcador_funcao = 1;
    
            } else if (cliente.marcador_funcao === 1){
                cliente.marcador_funcao_mensagem = message.body;
                cliente.marcador_funcao = 2;
            }
            if(cliente.marcador_funcao ===2){

                switch (cliente.marcador_funcao_mensagem){
                    case '1' :
                        if (!cliente.marcador_aleatorio){
                            client.sendMessage(message.from,'Quer enviar para quais usuários e quais filmes?\n\n ```Envie no formato: \n<ID>/<o filme ou a serie + nome> 1/o filme gato de botas/...```');
                            cliente.marcador_aleatorio = 1;
                        } else if (cliente.marcador_aleatorio === 1){
                            let valido = true;
                            cliente.marcador_funcao_mensagem2 = message.body.split('/');

                            if(cliente.marcador_funcao_mensagem2.length % 2 === 0) {
                                for(let i = 0; i< cliente.marcador_funcao_mensagem2.length; i += 2){
                                    let inteiro = cliente.marcador_funcao_mensagem2[i];
                                    let string = cliente.marcador_funcao_mensagem2[i + 1];
                                    
                                    if (!string.match(/^[\w\d]+[\w\s]{2,}$/) || string.match(/^\d+/) || inteiro.match(/[\w\s]+$/) && !inteiro.match(/^\d[\d]?$/) ){
                                        valido = false;
                                        break;
                                    }
                                }
                                
                                if (valido){
                                    cliente.marcador_aleatorio = 2
                                }else{
                                    client.sendMessage(message.from,'Por favor digite uma opção valida!');
                                    cliente.marcador_aleatorio = null;
                                    return enviarmensagem(client, message, cliente, phoneNumber)
                                }
                            }else{
                                client.sendMessage(message.from,'Por favor digite uma opção valida!');
                                cliente.marcador_aleatorio = null;
                                return enviarmensagem(client, message, cliente, phoneNumber)
                            }
                            
                        }
                        if (cliente.marcador_aleatorio === 2){
                            for (let i = 0; i < cliente.marcador_funcao_mensagem2.length; i += 2){
                                const result_telefone = await pool.query('SELECT telefone, nome, sobre_nome FROM pessoal where id = $1',[cliente.marcador_funcao_mensagem2[i]]);
                                client.sendMessage(`${result_telefone.rows[0].telefone}@c.us`,`Olá, ${result_telefone.rows[0].nome} ${result_telefone.rows[0].sobre_nome}! A equipe da P2SPEED agradece seu feedback. Temos o prazer de anunciar que ${cliente.marcador_funcao_mensagem2[i + 1]} já está disponível para você!`);
                                client.sendMessage(message.from, 'Mensagem enviada com sucesso!\nReceptor ID: '+cliente.marcador_funcao_mensagem2[i]);
                            }               
                            cliente.marcador_menu = 1;
                            cliente.mensagem_menu = null;
                            cliente.marcador_submenu = null;
                            cliente.marcador_funcao = null;
                            cliente.marcador_funcao_mensagem = null;
                            cliente.marcador_funcao_mensagem2 = null;
                            cliente.marcador_aleatorio = null;
                            return showMenuadm(client, message, cliente, phoneNumber);
                        }
                        break;
                    default:
                        client.sendMessage(message.from, 'Digite uma opção valida!')
                        cliente.marcador_funcao = null;
                    return enviarmensagem(client, message, cliente, phoneNumber);
                }
            }
        }else{cliente.marcador_menu = 1;
            cliente.mensagem_menu = null;
            cliente.marcador_submenu = null;
            cliente.marcador_funcao = null;
            cliente.marcador_funcao_mensagem = null;
            cliente.marcador_funcao_mensagem2 = null;
            return showMenuadm(client, message, cliente, phoneNumber);   
        }
    } catch (error) {
        console.log('//============================================================================================================================='+error+'\nErro função ENVIAR MENSAGEM 1\n');
    }
}
module.exports = {
  avisovencimento,
  enviarmensagem
};