import sqlite3
import datetime

DB_NAME = "sahaita.db"

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    
    # Table for storing human escalation requests
    c.execute('''
        CREATE TABLE IF NOT EXISTS human_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chat_history TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

def save_human_request(chat_history):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('INSERT INTO human_requests (chat_history) VALUES (?)', (str(chat_history),))
    conn.commit()
    request_id = c.lastrowid
    conn.close()
    return request_id
