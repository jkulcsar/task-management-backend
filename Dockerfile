FROM node:lts AS builder
WORKDIR /usr/src/app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:lts-alpine as production

ENV NODE_ENV production
ENV RDS_HOSTNAME 192.168.1.122
ENV RDS_PORT 5432
ENV RDS_USERNAME postgres
ENV RDS_PASSWORD postgressecretpassword
ENV RDS_DB_NAME taskmanagement
ENV JWT_SECRET TopSecret51

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./
EXPOSE 3000
CMD ["npm", "run", "start:prod"]

