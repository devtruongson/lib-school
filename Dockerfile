FROM node:18.16.0
WORKDIR /app
COPY package.json ./
RUN npm install -f
COPY . .
EXPOSE 8081
CMD [ "npm", "run", "start:dev" ]
