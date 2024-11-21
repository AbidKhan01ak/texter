# backend/db_config.py
import mysql.connector
from mysql.connector import Error
from app.config import Config

def create_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="abid",
            password="Imak@143",
            database="texter"
        )
        if connection.is_connected():
            print("Connected to MySQL database")
        return connection
    except Error as e:
        print(f"Error: {e}")
        return None
