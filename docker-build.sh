#/bin/bash

# Docker compose cannot be used to easily build image with context because
# build time secrets are not implemented yet. Instead use this script to build
# docker image and then launch with:
# LOGIN_APP_IMAGE=<image_id> docker compose up
DOCKER_BUILDKIT=1 docker build . \
  --secret id=npm_registry_username,src=secrets/npm_registry_username \
  --secret id=npm_registry_password,src=secrets/npm_registry_password \
  --secret id=npm_registry_email,src=secrets/npm_registry_email
