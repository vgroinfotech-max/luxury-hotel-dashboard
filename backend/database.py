import mysql.connector

def get_db_connection():

    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="pass",
        database="hotel_booking_system",
        port=3306
    )

    return connection