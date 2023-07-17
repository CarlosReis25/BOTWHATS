# BOTWHATS

Estes arquivos são referentes ao Chatbot direcionado a um serviço de streaming, pela grande quantia de codigos sensiveis foi decidido manter somente os arquivos relevante a funções especificas, lembrando que todas são 100% funcionais.

Biblioteca utilizada (WHATSAPP-WEB.JS) 
Banco de dados utilizados (Postegres)
Author (Carlos Augusto Reis)

Funcionalidades{
Com base no banco de dados ele captura informações como data de vencimento para ser utilizado em envio de qr code para pagamento, com ele o usuario pode fazer sugestão para o serviço e inclusive brevemente para o próprio chatbot, também pode ver as novidades que foram acrescentadas no serviço.
Envia um aviso de vencimento para o cliente sempre que desejavel para o administrador 
(numero de telefone cadastrado no codigo)
}

Lembrando que por ser de uso restrito o numero de telefone foi acrescentado diretamente como chave condicional, não havendo necessidade de uma variavel ou função que determine o administrador.

Também não houve um estudo de escalonamento em função de recursos gastos pois o numero de usuarios é relativamente baixo.
