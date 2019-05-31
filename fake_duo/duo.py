#!/usr/bin/python
from flask import Flask
from flask import request
from flask import jsonify
from flask import abort
import sys

AUTHTOKEN = "thisismysecuretoken2"

USERS = {
    "Alex": "This_is_Alex_local_account",
    "Peter": "This_is_Peter_local_ccount",
}

app = Flask(__name__)


@app.route('/map')
def map():
    print("Received request with TOKEN={} Expected: {}".format(request.headers.get("Authorization"), AUTHTOKEN), file=sys.stderr)
    if request.headers.get("Authorization") != AUTHTOKEN:
        abort(403)
    username = request.args.get("username", default="", type=str)
    try:
        localname = USERS[username]
    except ValueError:
        abort(404)
    return jsonify({"username": username, "localname": localname})

if __name__ == '__main__':
    print("RUN")
    app.run(host="0.0.0.0")
