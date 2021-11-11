FROM node:16.13.0

WORKDIR /usr/retail-ai/

COPY package.json /usr/retail-ai/
COPY yarn.lock /usr/retail-ai/

RUN yarn install

COPY . /usr/retail-ai/

EXPOSE 8080

# Chalk Coloring
ENV FORCE_COLOR 1

CMD ["yarn", "dev"]