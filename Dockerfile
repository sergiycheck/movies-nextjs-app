FROM node:latest AS base
RUN npm i -g pnpm

FROM base as dependencies
WORKDIR /home/node/client_app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM base as web_api
WORKDIR /home/node/client_app
COPY . .
COPY --from=dependencies /home/node/client_app/node_modules ./node_modules
RUN pnpm run build

EXPOSE $PORT
VOLUME [ "/home/node/client_app" ]
CMD npm run start

