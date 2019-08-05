FROM node:12.2.0-alpine

COPY . /data
WORKDIR /data/scripts

RUN npm install

VOLUME /data

ENTRYPOINT ["npm", "start"]
