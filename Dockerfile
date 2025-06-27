FROM node:20-slim
WORKDIR '/app'
COPY ./package.json ./
RUN npm install 
COPY ./ ./app
EXPOSE 7240
CMD [ "npm", "run", "start" ]   