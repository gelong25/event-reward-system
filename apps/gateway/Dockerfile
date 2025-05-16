FROM node:18

WORKDIR /app

COPY . .

RUN npm install

WORKDIR /app/apps/gateway

RUN npm run build

CMD ["node", "dist/main"]
