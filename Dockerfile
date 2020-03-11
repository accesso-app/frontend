#
# ---- Build ----
FROM node:dubnium-alpine as base
WORKDIR /root/build

# install and cache node packages
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build


#
# ---- Release ----
FROM node:12.16.1-alpine3.9

WORKDIR /app

COPY --from=base /root/build/package.json /root/build/yarn.lock ./
RUN yarn install --production
COPY --from=base /root/build/build ./build

EXPOSE 3000

CMD ["node", "./build/server.js"]
