FROM node:11.3-alpine

RUN yarn global add prisma@1.32.2 graphql-cli

WORKDIR /app/ligapay
COPY . /app/ligapay/

RUN yarn

CMD [ "sh", "start.sh" ]