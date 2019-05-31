#!/usr/bin/python
from flask import Flask
from flask import request
from flask import jsonify
from flask import abort
from users import USERS
import sys

AUTHTOKEN = "thisismysecuretoken2"

app = Flask(__name__)

@app.route('/map')
def map():
    if request.headers.get("Authorization") != AUTHTOKEN:
        abort(403)
    username = request.args.get("username", default="", type=str)
    try:
        localname = USERS[username]
    except ValueError:
        abort(404)
    return jsonify({"username": username, "localname": localname})

if __name__ == '__main__':
    app.run(host="0.0.0.0")
