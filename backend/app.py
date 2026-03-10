from flask import Flask, jsonify
from flask_cors import CORS
from database import get_db_connection

app = Flask(__name__)
CORS(app)


# ================= DASHBOARD =================

@app.route("/dashboard", methods=["GET"])
def dashboard():

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    # Room stats
    cursor.execute("SELECT COUNT(*) AS total_rooms FROM room")
    total_rooms = cursor.fetchone()["total_rooms"]

    cursor.execute("SELECT COUNT(*) AS occupied FROM room_status WHERE status='occupied'")
    occupied = cursor.fetchone()["occupied"]

    cursor.execute("SELECT COUNT(*) AS available FROM room_status WHERE status='available'")
    available = cursor.fetchone()["available"]

    cursor.execute("SELECT COUNT(*) AS cleaning FROM room_status WHERE status='cleaning'")
    cleaning = cursor.fetchone()["cleaning"]

    cursor.execute("SELECT COUNT(*) AS maintenance FROM room_status WHERE status='maintenance'")
    maintenance = cursor.fetchone()["maintenance"]

    cursor.execute("SELECT COUNT(*) AS oos FROM room_status WHERE status='oos'")
    oos = cursor.fetchone()["oos"]


    # Activity snapshot
    cursor.execute("SELECT COUNT(*) AS checkins FROM booking WHERE checkin_date = CURDATE()")
    checkins = cursor.fetchone()["checkins"]

    cursor.execute("SELECT COUNT(*) AS checkouts FROM booking WHERE checkout_date = CURDATE()")
    checkouts = cursor.fetchone()["checkouts"]

    cursor.execute("""
        SELECT COUNT(*) AS stayovers
        FROM booking
        WHERE checkin_date < CURDATE() AND checkout_date > CURDATE()
    """)
    stayovers = cursor.fetchone()["stayovers"]

    cursor.execute("SELECT COUNT(*) AS noshows FROM booking WHERE status='no_show'")
    noshows = cursor.fetchone()["noshows"]

    cursor.execute("SELECT COUNT(*) AS walkins FROM booking WHERE booking_type='walkin'")
    walkins = cursor.fetchone()["walkins"]


    data = {
        "total_rooms": total_rooms,
        "occupied": occupied,
        "available": available,
        "cleaning": cleaning,
        "maintenance": maintenance,
        "oos": oos,
        "checkins": checkins,
        "checkouts": checkouts,
        "stayovers": stayovers,
        "noshows": noshows,
        "walkins": walkins
    }

    cursor.close()
    db.close()

    return jsonify(data)


# ================= HOUSEKEEPING =================

@app.route("/housekeeping", methods=["GET"])
def housekeeping():

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT room_number, room_type, status, attendant, updated_time
        FROM housekeeping
    """)

    rows = cursor.fetchall()

    # convert time to string
    for row in rows:
        row["updated_time"] = str(row["updated_time"])

    cursor.close()
    db.close()

    return jsonify(rows)


# ================= ALERTS =================

@app.route("/alerts", methods=["GET"])
def alerts():

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    alerts = []

    # Overbooking Alert
    cursor.execute("""
        SELECT COUNT(*) AS bookings
        FROM booking
        WHERE checkin_date = CURDATE()
    """)
    bookings = cursor.fetchone()["bookings"]

    cursor.execute("SELECT COUNT(*) AS rooms FROM room")
    rooms = cursor.fetchone()["rooms"]

    if bookings > rooms:
        alerts.append({
            "icon": "🚨",
            "title": "Overbooking Risk",
            "description": f"{bookings} bookings but only {rooms} rooms available",
            "type": "critical",
            "alert_time": "Now"
        })


    # Maintenance Alerts
    # Maintenance Alerts
    cursor.execute("""
        SELECT room.no
        FROM room_status
        JOIN room ON room.no = room_status.room_id
        WHERE room_status.status = 'maintenance'
    """)

    maintenance_rooms = cursor.fetchall()

    for room in maintenance_rooms:
        alerts.append({
        "icon": "🔧",
        "title": f"Maintenance Issue — Room {room['no']}",
        "description": "Room blocked until repaired",
        "type": "warning",
        "alert_time": "Recent"
    })


   
    cursor.close()
    db.close()

    return jsonify(alerts)


# ================= RUN SERVER =================

if __name__ == "__main__":
    app.run(debug=True)