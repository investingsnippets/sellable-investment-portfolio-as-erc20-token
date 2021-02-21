FROM node:12-alpine

# install ganache
RUN npm i -g ganache-cli 

# Install Truffle@5.1.65 since imports is broken in 66
RUN npm install -g truffle@5.1.65 --unsafe-perm=true --allow-root
RUN npm config set bin-links false
