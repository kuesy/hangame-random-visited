FROM centos:centos7
LABEL maintainer="kuesy <kuesy0816@gmail.com>"
ENV ZALENIUM_HD=35.238.199.82:4444
RUN yum install -y epel-release
RUN yum install -y nodejs npm
RUN npm install
CMD node sample-test.js
