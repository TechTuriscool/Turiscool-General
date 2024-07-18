ARG NODE_VERSION=18.0.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /app-react

COPY package.json .

RUN npm i

COPY . .

CMD [ "npm", "run", "dev" ]