FROM node:14.17.3

MAINTAINER https://github.com/huangyan321

ENV HOME=/home/app

COPY package.json package-lock.json $HOME/ssr_fst_blog/

WORKDIR $HOME/ssr_fst_blog
RUN npm install --registry=https://registry.npm.taobao.org

COPY . $HOME/ssr_fst_blog