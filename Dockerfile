
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

RUN npx prisma migrate deploy

RUN npx prisma generate

# Compiler le projet TypeScript
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
