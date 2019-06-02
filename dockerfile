FROM node:11.3-alpine

RUN yarn global add prisma@1.32.2 graphql-cli

WORKDIR /app/ligapay

COPY package.json /app/ligapay/package.json
RUN yarn
COPY . ./

CMD [ "sh", "start.sh" ]