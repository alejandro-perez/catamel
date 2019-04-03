FROM node:10

RUN apt-get -y update
RUN apt-get -y install curl sudo gnupg
RUN set -x \
    && echo "deb http://cdi-master.ci.ti.ja.net/repo-moonshot/debian-moonshot/ stretch main" > /etc/apt/sources.list.d/moonshot.list \
    && curl "http://repository.project-moonshot.org/debian-moonshot/key.gpg" | apt-key add - \
    && apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4 \
    && echo "deb http://repo.mongodb.org/apt/debian stretch/mongodb-org/4.0 main" > /etc/apt/sources.list.d/mongodb.list \
    && apt-get -y update \
    && apt-get -y install moonshot-ui moonshot-gss-eap-noshib moonshot-trust-router freeradius mongodb-org \
                          apache2 libapache2-mod-auth-gssapi
RUN echo 'alice@test1.org         Cleartext-Password := "alicepwd"' >> /etc/freeradius/users \
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
COPY . workdir
WORKDIR workdir
RUN set -x \
    && cp 000-default.conf /etc/apache2/sites-enabled \
    && npm install \
    && cd server \
    && cp datasources.json-sample datasources.json \
    && cp providers.json-sample providers.json \
    && cp config.local.js-sample config.local.js
CMD freeradius \
    && /etc/init.d/apache2 start \
    && /usr/bin/mongod --config /etc/mongod.conf --fork \
    && echo "To get a token with moonshot execute the following:" \
    && echo '  docker exec -ti '$(hostname)' dbus-launch curl --negotiate -u ":" http://localhost/auth/moonshot/callback' \
    && node .
