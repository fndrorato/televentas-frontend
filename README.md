
# 💬 Sistema de WhatsApp Apolo/Box - Frontend

Interface web construída em **React.js**, com suporte a build de produção via **Express**.

---

## 🧰 Pré-requisitos

Certifique-se de ter instalado:

- Node.js (recomendado: versão >= 18.x)
- NPM (ou Yarn)

---

## 🚀 Passos para Instalação e Execução

### 1. Instalar as dependências

No diretório raiz do projeto, execute:

```bash
npm install
# ou
yarn install
```

> Este comando instalará todas as dependências listadas no `package.json`.

---

### 2. Executar em modo de desenvolvimento

Para iniciar o servidor React (modo dev), execute:

```bash
npm start
# ou
yarn start
```

A aplicação será aberta no navegador, geralmente em:  
📍 `http://localhost:3000`

---

### 3. Corrigir erro de OpenSSL (caso ocorra)

Se aparecer erro relacionado ao OpenSSL (em Node >=17), execute:

```bash
export NODE_OPTIONS=--openssl-legacy-provider && npm start
```

---

### 4. Criar build de produção

Para gerar uma versão otimizada para produção:

```bash
npm run build
# ou
yarn build
```

> Isso criará a pasta `build/` com os arquivos finais.

---

### 5. Servir a versão de produção (com Express)

O projeto inclui um servidor Express simples. Para usá-lo:

1. Gere o build (como no passo 4).
2. Execute o servidor:

```bash
node server.js
```

A aplicação estará acessível em:  
📍 `http://localhost:3000`

---

## 🌐 Deploy em Produção (opcional)

Você pode servir a build de produção em qualquer servidor web como:

- **Nginx**
- **Apache**
- **Vercel / Netlify**
- **Docker**

---

## 🧪 Testes (se aplicável)

Caso o projeto tenha testes configurados:

```bash
npm test
# ou
yarn test
```

---

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe responsável.

---

## 📄 Licença

Este projeto está licenciado sob os termos da licença MIT.
