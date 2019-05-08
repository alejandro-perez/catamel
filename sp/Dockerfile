FROM unicon/shibboleth-sp

RUN yum -y update \
    && yum -y install php mod_ssl

RUN mv /etc/shibboleth/shibd-redhat /tmp
COPY etc-shibboleth /etc/shibboleth/
COPY etc-httpd/ /etc/httpd/
COPY var-www-html/ /var/www/html/
RUN mv /tmp/shibd-redhat /etc/shibboleth/ \
    && chmod +x /etc/shibboleth/shibd-redhat
