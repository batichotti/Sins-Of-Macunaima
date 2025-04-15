FROM node:20.11-alpine

# Define diretório de trabalho dentro do container
WORKDIR /src

# Copia os arquivos de dependência
COPY package.json yarn.lock ./

# Instala as dependências
RUN yarn install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta que o NestJS usa (ajuste se necessário)
EXPOSE 3000

# Comando padrão para iniciar a aplicação
CMD ["yarn", "start"]
