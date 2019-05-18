FROM node:11.3-alpine

RUN yarn global add prisma@1.32.2 graphql-cli

WORKDIR /app

COPY ./* ./

CMD [ "sh", "docker/start.sh" ]