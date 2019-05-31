FROM python:3

RUN pip install flask
COPY duo.py users.py /
CMD ip addr && python duo.py
