FROM nginx:1.17.10-alpine AS builder

ENV NGINX_VERSION 1.17.10
ENV OPENTRACING_CPP_VERSION 1.5.1
ENV NGINX_OPENTRACING_VERSION 0.10.0
ENV JAGER_TRACING 0.4.2

# Download sources
RUN wget "http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz" -O nginx.tar.gz 

# For latest build deps, see https://github.com/nginxinc/docker-nginx/blob/master/mainline/alpine/Dockerfile
RUN apk add --no-cache --virtual .build-deps \
  gcc \
  libc-dev \
  make \
  openssl-dev \
  pcre-dev \
  zlib-dev \
  linux-headers \
  curl \
  gnupg \
  libxslt-dev \
  gd-dev \
  geoip-dev \
  g++ \
  git \
  cmake
RUN wget "https://github.com/jaegertracing/jaeger-client-cpp/archive/v${JAGER_TRACING}.tar.gz" -O jaeger-tracing.tar.gz && \
  mkdir -p jaeger-tracing && \
  tar zxvf jaeger-tracing.tar.gz -C ./jaeger-tracing/ --strip-components=1 && \
  cd jaeger-tracing \
  && mkdir .build && cd .build \
  && cmake -DCMAKE_BUILD_TYPE=Release \
           -DBUILD_TESTING=OFF \
           -DJAEGERTRACING_WITH_YAML_CPP=ON .. \
  && make && make install \
  && export HUNTER_INSTALL_DIR=$(cat _3rdParty/Hunter/install-root-dir) \
  && cp /usr/local/lib64/libjaegertracing.so /usr/local/lib/libjaegertracing_plugin.so 
  
RUN wget "https://github.com/opentracing/opentracing-cpp/archive/v${OPENTRACING_CPP_VERSION}.tar.gz" -O opentracing-cpp.tar.gz && \
  mkdir -p opentracing-cpp/.build && \
  tar zxvf opentracing-cpp.tar.gz -C ./opentracing-cpp/ --strip-components=1 && \
  cd opentracing-cpp/.build && \
  cmake .. && \
  make && \
  make install
RUN cd /etc && git clone --depth 1 --branch v${NGINX_OPENTRACING_VERSION} https://github.com/opentracing-contrib/nginx-opentracing.git
# Reuse same cli arguments as the nginx:alpine image used to build
RUN CONFARGS=$(nginx -V 2>&1 | sed -n -e 's/^.*arguments: //p') \
    CONFARGS=${CONFARGS/-Os -fomit-frame-pointer/-Os} && \
    mkdir /usr/src && \
	tar -zxC /usr/src -f nginx.tar.gz && \
  OPENTRACING="/etc/nginx-opentracing/opentracing" && \
  cd /usr/src/nginx-$NGINX_VERSION && \
  ./configure --with-compat $CONFARGS --add-dynamic-module=$OPENTRACING && \
  make && make install
FROM nginx:1.17.10-alpine

# Extract the dynamic module NCHAN from the builder image
ENV NGINX_VERSION 1.17.10
#COPY --from=builder /usr/local/lib/libjaegertracing.so /usr/local/lib/libjaegertracing_plugin.so
COPY --from=builder /usr/local/lib /usr/local/lib
COPY --from=builder /usr/src/nginx-${NGINX_VERSION}/objs/*_module.so /etc/nginx/modules/
RUN apk add libc6-compat libstdc++

COPY ./configs/nginx.conf /etc/nginx/nginx.conf
COPY ./jaeger/jaeger-config.json /etc/jaeger-config.json

RUN rm -rf /usr/share/nginx/html/*

COPY ./html/502.html /usr/share/nginx/html/502.html

EXPOSE 81