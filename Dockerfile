FROM node:14.15.4

RUN mkdir -p /server/src
WORKDIR /server

COPY packages/server/node_modules /server/node_modules
RUN rm -rf /server/node_modules/armadillo-auth-ui
RUN mkdir -p /server/node_modules/armadillo-auth-ui/dist
COPY packages/client/dist /server/node_modules/armadillo-auth-ui/dist
COPY packages/server/src/ /server/src

ENV NODE_ENV production

CMD ["node", "src/index.js"]