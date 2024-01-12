# Usar uma imagem específica do Node.js (21-alpine neste caso)
FROM node:21-alpine

# Mudar para o usuário root temporariamente para realizar algumas operações
USER root

# Criar o diretório da aplicação e definir as permissões
RUN mkdir -p /apps/littlegram/node_modules && chown -R root:root /apps/littlegram

# Definir o diretório de trabalho para o diretório da aplicação
WORKDIR /apps/littlegram

# Copiar apenas os arquivos necessários para instalar as dependências
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar todos os arquivos da aplicação para o contêiner
COPY --chown=root:root . .

# Expor a porta que a aplicação estará escutando (não é estritamente necessário no modo bridge)
EXPOSE 3000

# Comando padrão para iniciar a aplicação
CMD [ "npm", "start" ]
