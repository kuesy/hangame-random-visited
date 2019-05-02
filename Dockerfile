FROM node:8.16.0-jessie
LABEL maintainer="kuesy <kuesy0816@gmail.com>"
# Install app dependencies
COPY package.json /src/package.json
RUN cd /src; npm install
RUN touch /tmp/healthy
# Bundle app source
COPY . /src
# execute app
CMD bash -c "node /src/random.js ; rm /tmp/healthy"
