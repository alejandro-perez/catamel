FROM satosa/satosa

RUN sed -i "s/STATE_COOKIE_SECURE = True/STATE_COOKIE_SECURE = False/g" /src/satosa/src/satosa/state.py
COPY attribute_modifications.py /src/satosa/src/satosa/micro_services/
RUN /setup.sh
