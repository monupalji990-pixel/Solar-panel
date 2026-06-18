ARG pm2file
FROM node:14.18.0
ENV FILE=${pm2file}
RUN echo "Based on commit: $pm2file"
RUN mkdir -p /home/node/app
WORKDIR ./
COPY . .
RUN npm install pm2 -g
RUN npm install
CMD ["pm2-runtime", "pm2-stag.json"]
EXPOSE 8333