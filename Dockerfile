FROM node
WORKDIR /app
COPY package.json ./

EXPOSE 3000
EXPOSE 3001
EXPOSE 3002