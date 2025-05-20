FROM node:18

WORKDIR /app

COPY . .

RUN npm install

WORKDIR /app/apps/auth

RUN npm run build:auth

CMD ["node", "../../dist/apps/auth/main"]
