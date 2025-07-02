# Etapa 1: build do React
FROM node:18-alpine as build

WORKDIR /app

COPY .env .env   
# Copia package.json e package-lock.json
COPY package*.json ./

# (Opcional) Instala o git se você usa dependências via git
RUN apk update && apk add --no-cache git

# Instala todas as dependências (inclusive dev)
RUN npm install --legacy-peer-deps

# Copia o restante do código
COPY . .

# Gera build otimizado
RUN npm run build

# Etapa 2: container final com Nginx
FROM nginx:stable-alpine

# Remove página padrão
RUN rm -rf /usr/share/nginx/html/*

# Copia build do React para Nginx
COPY --from=build /app/build /usr/share/nginx/html

# (Opcional) Copia nginx.conf customizado, se houver
# COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
