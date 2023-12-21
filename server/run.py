from json import load
from secrets import token_hex
from flask import Flask, jsonify
from flask_cors import CORS

from util.conn import create_conn

app = Flask(__name__)
app.secret_key = token_hex(16)
CORS(app)


@app.route('/getUser', methods=['POST'])
def get_user():
    conn = create_conn()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM user')
    result = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify({'type': 'comment', 'content': str(result)})


@app.route('/getComment', methods=['POST'])
def get_comment():
    conn = create_conn()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM comment')
    result = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify({'type': 'comment', 'content': str(result)})


if __name__ == '__main__':
    config = load(open('config.json', 'r'))

    print(f"Running on {config['port']}")
    app.run(**config)
    print(f"Closing port {config['port']}")
