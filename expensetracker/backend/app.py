from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
import sqlite3
import os

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('expenses.db')
    conn.row_factory = sqlite3.Row
    return conn

# Create the expenses table if it doesn't exist
with get_db_connection() as conn:
    conn.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id TEXT PRIMARY KEY,
            amount REAL NOT NULL,
            description TEXT NOT NULL,
            date TEXT NOT NULL
        )
    ''')
    conn.commit()

@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    conn = get_db_connection()
    expenses = conn.execute('SELECT * FROM expenses').fetchall()
    conn.close()
    return jsonify([dict(expense) for expense in expenses])

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    data = request.json
    expense_id = str(uuid.uuid4())
    amount = data.get('amount')
    description = data.get('description')
    date = data.get('date')
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO expenses (id, amount, description, date) VALUES (?, ?, ?, ?)',
        (expense_id, amount, description, date)
    )
    conn.commit()
    conn.close()
    return jsonify({
        'id': expense_id,
        'amount': amount,
        'description': description,
        'date': date
    }), 201

@app.route('/api/expenses/<expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    conn = get_db_connection()
    conn.execute('DELETE FROM expenses WHERE id = ?', (expense_id,))
    conn.commit()
    conn.close()
    return '', 204

@app.route('/')
def home():
    return "Expense Tracker Flask API is running with SQLite!"

from flask import send_from_directory

from flask import send_from_directory

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join("build", path)):
        return send_from_directory('build', path)
    else:
        return send_from_directory('build', 'index.html')

if __name__ == '__main__':
    app.run(debug=True)