FROM node:18

WORKDIR /app

COPY . .

RUN npm install

WORKDIR /app/apps/gateway

RUN npm run build:gateway

CMD ["node", "../../dist/apps/gateway/main"]
