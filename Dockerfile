FROM node
WORKDIR /glitchi

RUN apt-get update && \
apt-get upgrade -y --no-install-recommends && \
apt-get install -y --no-install-recommends libfontconfig1 ttf-ancient-fonts yarn && \
apt-get clean

ARG PORT
ENV PORT=$PORT

# Build the bot
ENV NODE_ENV='development'
COPY package*.json ./
COPY yarn.lock  ./

RUN yarn install --immutable

# run the bot
ENV NODE_ENV='production'
COPY . .
CMD ["yarn", "start"]
