FROM node:10

RUN apt-get -y update
RUN apt-get -y install curl sudo gnupg
RUN set -x \
    && echo "deb http://repository.project-moonshot.org/debian-moonshot/ stretch main" > /etc/apt/sources.list.d/moonshot.list \
    && curl "http://repository.project-moonshot.org/debian-moonshot/key.gpg" | apt-key add - \
    && apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4 \
    && echo "deb http://repo.mongodb.org/apt/debian stretch/mongodb-org/4.0 main" > /etc/apt/sources.list.d/mongodb.list \
    && apt-get -y update \
    && apt-get -y install moonshot-ui moonshot-gss-eap-noshib moonshot-trust-router freeradius mongodb-org \
                          apache2 libapache2-mod-auth-gssapi
RUN echo 'alice@test1.org         Cleartext-Password := "alicepwd"' >> /etc/freeradius/users \
    && echo 'bob@test1.org         Cleartext-Password := "bobpwd"' >> /etc/freeradius/users \
    && echo 'carl@test1.org         Cleartext-Password := "carlpwd"' >> /etc/freeradius/users \
    && ln -s /etc/freeradius/sites-available/channel_bindings /etc/freeradius/sites-enabled/ \
    && echo 'realm gss-eap { \n\
            type = "UDP" \n\
            disable_hostname_check = yes \n\
            server { \n\
                hostname = "localhost" \n\
                service = "1812" \n\
                secret = "testing123" \n\
            } \n\
          }' > /etc/radsec.conf \
    && a2enmod proxy proxy_http headers rewrite \
    && sed -i "/post-auth {/a \
             update outer.session-state { \n\
               User-Name := &User-Name \n\
             }" /etc/freeradius/sites-enabled/inner-tunnel
RUN a2enmod ssl
RUN apt-get install -y libapache2-mod-shib2

COPY . workdir
WORKDIR workdir
COPY sp/etc-httpd/ /etc/httpd/
COPY sp/etc-shibboleth /etc/shibboleth/

RUN set -x \
    && cp 000-default.conf /etc/apache2/sites-enabled \
    && npm install \
    && cd server \
    && cp datasources.json-sample datasources.json \
    && cp providers.json-sample providers.json \
    && cp config.local.js-sample config.local.js
CMD freeradius \
    && /etc/init.d/apache2 start \
    && /etc/init.d/shibd start \
    && /usr/bin/mongod --config /etc/mongod.conf --fork \
    && node .
