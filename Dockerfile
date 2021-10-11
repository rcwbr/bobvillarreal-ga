FROM node:14

WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
RUN npm install
COPY index.js /app
COPY updateAnalytics.js /app

ENTRYPOINT [ "node", "/app/index.js" ]
