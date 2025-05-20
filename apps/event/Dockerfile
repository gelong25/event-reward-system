FROM node:18

WORKDIR /app

COPY . .

RUN npm install

WORKDIR /app/apps/event

RUN npm run build:event

CMD ["node", "../../dist/apps/event/main"]
