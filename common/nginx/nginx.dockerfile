FROM nginx:alpine

COPY ./configs/nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

EXPOSE 81