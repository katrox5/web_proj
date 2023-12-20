from json import load
from pymysql import connect


def create_conn():
    config = load(open('db_conf.json', 'r'))
    conn = connect(
        host=config['host'],
        port=config['port'],
        user=config['username'],
        passwd=config['password'],
        db=config['database'],
        charset=config['charset']
    )
    return conn
