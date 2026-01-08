FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm install

EXPOSE 3001

USER node

CMD ["node", "src/server.js"]
