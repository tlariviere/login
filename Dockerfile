# syntax=docker/dockerfile:1.3

FROM node:16.7.0-alpine

ARG NPM_REGISTRY_USERNAME

ENV NODE_ENV=production

# TLS private key and certificate runtime secrets.
ENV TLS_KEY_PATH=/run/secrets/tls_key
ENV TLS_CERT_PATH=/run/secrets/tls_cert

WORKDIR /login

RUN npm install -g npm-cli-login

COPY . .

# Run all in one step to not expose password in intermediate layers
RUN \
  --mount=type=secret,id=npm_registry_password \
  --mount=type=secret,id=npm_registry_email \
  npm-cli-login \
  -u ${NPM_REGISTRY_USERNAME} \
  -p $(cat /run/secrets/npm_registry_password) \
  -e $(cat /run/secrets/npm_registry_email) \
  -r https://npm.pkg.github.com \
  -s @tlariviere \
  --config-path .npmrc && \
  npm install --production=false && \
  rm -f .npmrc

RUN npm run build --workspace=example

EXPOSE 8080

CMD ["node", "./packages/example"]
