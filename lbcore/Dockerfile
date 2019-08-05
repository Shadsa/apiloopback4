FROM node:10.15.3-alpine

# Install curl
RUN apk add --update --no-cache curl

# Run main process as non-root user
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Deps
COPY --chown=node package*.json ./
RUN npm install

# Build final sources
COPY --chown=node . .
RUN npm run build

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3000 NODE_ENV=production

EXPOSE ${PORT}
ENTRYPOINT [ "node", "." ]
