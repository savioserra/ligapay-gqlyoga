FROM node:11.3-alpine

# Heroku dependencies
RUN yarn global add prisma@1.32.2 graphql-cli && \
    apk update && \
    apk add bash openssh curl && \
    rm /bin/sh && \
    ln -s /bin/bash /bin/sh

COPY docker/heroku-exec.sh /app/.profile.d/

WORKDIR /app/ligapay

COPY . /app/ligapay/
RUN yarn

CMD [ "sh", "docker/start.sh" ]