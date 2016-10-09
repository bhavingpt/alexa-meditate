from flask import Flask, request, Response, render_template, jsonify
from functools import wraps
import sqlite3
import logging


app = Flask(__name__)

@app.route('/')
def main():
    return "Home page"

@app.route('/session_rating')
def add_session():
    rating = request.args.get('rating')
    conn = sqlite3.connect("main.db")
    conn.execute("INSERT INTO Feedback (time, rating) values(DateTime('now'), ?)",(rating,))
    conn.commit()
    conn.close()
    return "true"

@app.route('/display')
def admin():
    conn = sqlite3.connect("main.db")
    cursor = conn.execute("SELECT * from Feedback")
    entries = cursor.fetchall()
    conn.close()
    return render_template('display.html',entries = entries)


if(__name__ == "__main__"):
    app.run()
