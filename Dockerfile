FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

WORKDIR /app/frontend
RUN npm install
RUN npm run build

WORKDIR /app//backend

EXPOSE 3000

CMD ["node", "server.js"]
