#
# ---- Build ----
FROM node:dubnium-alpine as base
WORKDIR /root/build

# install and cache node packages
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build


#
# ---- Release ----
FROM node:12.16.1-alpine3.9

WORKDIR /app

COPY --from=base /root/build/build ./build
COPY --from=base /root/build/package.json ./package.json
COPY --from=base /root/build/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "./build/server.js"]
