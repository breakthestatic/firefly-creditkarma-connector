FROM node:20-alpine

RUN mkdir -p /app

WORKDIR /app

COPY package.json package-lock.json ./
RUN apk add g++ make py3-pip
RUN npm install
COPY scripts/ ./scripts/
RUN chmod 0755 scripts/cron.sh scripts/entry.sh

RUN echo "* 8,18 * * * /app/scripts/cron.sh" > /app/crontab.txt
RUN /usr/bin/crontab /app/crontab.txt

CMD ["sh","/app/scripts/entry.sh"]