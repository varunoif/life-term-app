### STAGE 1: Build ###
FROM node:14.21.3-alpine AS build
WORKDIR /usr/src/app
COPY . .
#COPY package.json package-lock.json ./
RUN npm install
#COPY . .
RUN npm run build -- --prod --output-hashing=all --base-href /life-insurance/term-insurance/
##RUN npm run build -- --base-href=/health-insurance/##
### STAGE 2: Run ####
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/term-life /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/50x.html
