from flask import Flask, jsonify,request
from flask_cors import CORS
from database import get_db_connection
import os
import uuid
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# ================= DASHBOARD =================

from datetime import datetime, timedelta

BASE_DATE = datetime(2026, 3, 8)

def to_date(day):
    return BASE_DATE + timedelta(days=day)

def to_days(date):
    return (date - BASE_DATE).days

def convert_booking(row):
    if not row["checkIn"] or not row["checkOut"]:
        return None

    start_day = to_days(row["checkIn"])
    end_day = to_days(row["checkOut"])

    return {
        "id": row["reservation_id"],
        "room": row["room_id"],
        "startDay": start_day,
        "endDay": end_day,
        "nights": end_day - start_day,
        "guest": f"{row.get('first_name','')} {row.get('last_name','')}".strip(),
        "status": row.get("status", "confirmed"),
        "rate": 0,
        "source": "DB"
    }

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
from datetime import timedelta

@app.route("/api/occupancy", methods=["GET"])
def occupancy():

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    query = """
    SELECT 
        r.no AS room,
        ra.date,
        CASE 
            WHEN ra.is_available = 1 THEN 'available'
            ELSE 'occupied'
        END AS status
    FROM room_availability ra
    JOIN room r ON r.no = ra.room_id
    WHERE ra.date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
    ORDER BY r.no, ra.date
    """

    cursor.execute(query)
    data = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(data)

@app.route("/api/reservations", methods=["GET"])
def get_reservations():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            reservation_id,
            guestName,
            roomType,
            rooms,
            guests,
            checkIn,
            checkOut,
            vip,
            status,
            room_id
        FROM reservations
    """)

    rows = cursor.fetchall()

    data = []
    for row in rows:
        # calculate nights
        nights = 0
        if row["checkIn"] and row["checkOut"]:
            nights = (row["checkOut"] - row["checkIn"]).days

        data.append({
            "id": row["reservation_id"],
            "guestName": row["guestName"],
            "roomNumber": row["room_id"],  # using room_id
            "roomType": row["roomType"],
            "checkIn": str(row["checkIn"]),
            "checkOut": str(row["checkOut"]),
            "nights": nights,
            "source": row["company"] if "company" in row else "Direct",
            "status": row["status"],
            "isVIP": bool(row["vip"])
        })

    cursor.close()
    db.close()

    return jsonify(data)
@app.route("/api/reservations", methods=["POST"])
def add_reservation():
    data = request.json

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
    INSERT INTO reservations 
    (guestName, roomType, rooms, guests, checkIn, checkOut, vip, status, room_id, company)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        data["guestName"],
        data["roomType"],
        data.get("rooms", 1),
        data.get("guests", 1),
        data["checkIn"],
        data["checkOut"],
        int(data.get("isVIP", 0)),
        data.get("status", "confirmed"),
        data.get("roomNumber"),
        data.get("source", "Direct")
    ))

    db.commit()
    cursor.close()
    db.close()

    return jsonify({"message": "Reservation added"})

@app.route("/api/booking-sources", methods=["GET"])
def booking_sources():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            IFNULL(source, 'Direct') AS source,
            COUNT(*) as count
        FROM reservations
        GROUP BY source
    """)

    rows = cursor.fetchall()

    total = sum(row["count"] for row in rows)

    data = []
    for row in rows:
        percent = round((row["count"] / total) * 100, 1)

        data.append({
            "source": row["source"],
            "count": row["count"],
            "percent": percent
        })

    cursor.close()
    db.close()

    return jsonify(data)




# ─────────────────────────────────────────────
# ✅ 1. CREATE GUEST + LINK RESERVATION
# ─────────────────────────────────────────────
@app.route("/api/guest/create", methods=["POST"])
def create_guest():
    data = request.json

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO guests (first_name, last_name, email, phone, id_type, id_number)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        data.get("firstName"),
        data.get("lastName"),
        data.get("email"),
        data.get("phone"),
        data.get("docType"),
        data.get("docNumber")
    ))

    guest_id = cursor.lastrowid

    # Link reservation
    cursor.execute("""
        UPDATE reservations
        SET guest_id = %s
        WHERE reservation_id = %s
    """, (guest_id, data.get("reservation_id")))

    db.commit()

    return jsonify({
        "status": "guest_created",
        "guest_id": guest_id
    })


# ─────────────────────────────────────────────
# ✅ 2. DOCUMENT UPLOAD + OCR MOCK
# ─────────────────────────────────────────────
@app.route("/api/doc/upload", methods=["POST"])
def upload_doc():
    try:
        file = request.files.get("file")
        docType = request.form.get("docType", "Document")

        if not file:
            return jsonify({"error": "No file uploaded"}), 400

        filename = str(uuid.uuid4()) + "_" + file.filename
        path = os.path.join(UPLOAD_FOLDER, filename)

        file.save(path)

        db = get_db_connection()
        cursor = db.cursor()

        cursor.execute("""
            INSERT INTO evidence (
                id, tenant_id, compliance_item_id, title,
                file_url, uploaded_by
            )
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            str(uuid.uuid4()),
            "tenant1",
            "doc1",
            docType,
            path,
            "guest"
        ))

        db.commit()

        return jsonify({
            "name": "Rahul Sharma",
            "dob": "10 Jul 1990",
            "nat": "Indian",
            "docNo": "XXXX1234",
            "exp": "2030",
            "vType": "Tourist",
            "vStatus": "ok"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# ─────────────────────────────────────────────
# ✅ 3. VISA CHECK
# ─────────────────────────────────────────────
@app.route("/api/doc/visa-check", methods=["POST"])
def visa_check():
    data = request.json

    status = "ok"
    if data.get("docType") == "Iqama":
        status = "expired"

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO compliance_reports (code, title, description, format, scope)
        VALUES (%s, %s, %s, %s, %s)
    """, (
        str(uuid.uuid4())[:8],
        "Visa Check",
        status,
        "PDF",
        "guest"
    ))

    db.commit()

    return jsonify({"status": status})


# ─────────────────────────────────────────────
# ✅ 4. PAYMENT
# ─────────────────────────────────────────────
@app.route("/api/pay/pay", methods=["POST"])
def make_payment():
    data = request.json

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO payments (payment_method, payment_status)
        VALUES (%s, %s)
    """, (
        data.get("payment_method","UPI"),
        "Completed"
    ))

    db.commit()

    return jsonify({"status": "payment_success"})


# ─────────────────────────────────────────────
# ✅ 5. FINAL CHECK-IN
# ─────────────────────────────────────────────
@app.route("/api/booking/complete", methods=["POST"])
def complete_booking():
    data = request.json

    db = get_db_connection()
    cursor = db.cursor()

    # Get reservation data
    cursor.execute("""
        SELECT guestName, room_id, checkIn, checkOut
        FROM reservations
        WHERE reservation_id = %s
    """, (data.get("reservation_id"),))

    res = cursor.fetchone()

    if not res:
        return jsonify({"error": "Reservation not found"}), 404

    cursor.execute("""
        INSERT INTO booking (
            guest_name, room_id, checkin_date, checkout_date,
            booking_type, status
        )
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        res[0],
        res[1],
        res[2],
        res[3],
        "pre_checkin",
        "checked_in"
    ))

    db.commit()
    return jsonify({"status": "checkin_complete"})
# ─────────────────────────────────────────────
# ✅ PRE-CHECKIN DATA (DYNAMIC USER DATA)
# ─────────────────────────────────────────────
@app.route("/api/precheckin/<int:res_id>", methods=["GET"])
def get_precheckin(res_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            r.reservation_id,
            g.first_name,
            g.last_name,
            r.roomType,
            r.room_id,
            r.checkIn,
            r.checkOut,
            DATEDIFF(r.checkOut, r.checkIn) AS nights
        FROM reservations r
        LEFT JOIN guests g ON r.guest_id = g.guest_id
        WHERE r.reservation_id = %s
    """, (res_id,))

    data = cursor.fetchone()

    if not data:
        return jsonify({"error": "Reservation not found"}), 404

    cursor.close()
    db.close()

    return jsonify({
        "name": f"{data.get('first_name','Guest')} {data.get('last_name','')}",
        "room": f"{data['roomType']} Room {data['room_id']}",
        "checkIn": str(data["checkIn"]),
        "nights": data["nights"]
    })
    return jsonify({"status": "checkin_complete"})


@app.route("/api/reservation/<int:id>", methods=["GET"])
def get_reservation(id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    query = "SELECT * FROM reservations WHERE reservation_id = %s"
    cursor.execute(query, (id,))
    res = cursor.fetchone()

    cursor.close()
    db.close()  # ✅ ALSO ADD THIS

    if not res:
        return jsonify({"error": "Not found"}), 404

    # ✅ Calculate nights
    nights = 0
    if res["checkIn"] and res["checkOut"]:
        nights = (res["checkOut"] - res["checkIn"]).days

    # ✅ CORRECT INDENTATION
    return jsonify({
        "id": res["reservation_id"],
        "guestName": res["guestName"],

        "hotelName": "Grand Palace",
        "city": "New Delhi",

        "roomType": res["roomType"],
        "roomNumber": res["room_id"],

        "checkIn": res["checkIn"].strftime("%d %b") if res["checkIn"] else "",
        "checkOut": res["checkOut"].strftime("%d %b") if res["checkOut"] else "",

        "nights": nights,

        "rooms": res["rooms"],
        "guests": res["guests"],

        "deposit": 2000,
        "arrTime": "14:00"
    })

@app.route("/api/rooms", methods=["GET"])
def get_rooms():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            no AS id,
            floor,
            occupancy,
            view
        FROM room
    """)

    rooms = cursor.fetchall()

    # optional: map fields for frontend
    for r in rooms:
        r["type"] = "Room"   # default (since no type table used)
        r["bed"] = f"{r.get('occupancy', 2)} Guest"

    cursor.close()
    return jsonify(rooms)

@app.route("/api/bookings", methods=["GET"])
def get_bookings():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM booking")
    data = cursor.fetchall()

    from datetime import datetime
    BASE_DATE = datetime(2026, 4, 1)  # 🔥 match your UI start date

    bookings = []

    for b in data:
        checkin = datetime.combine(b["checkin_date"], datetime.min.time())
        checkout = datetime.combine(b["checkout_date"], datetime.min.time())

        startDay = (checkin - BASE_DATE).days
        endDay = (checkout - BASE_DATE).days

        bookings.append({
            "id": b["booking_id"],
            "room": b["room_id"],
            "startDay": startDay,
            "endDay": endDay,
            "nights": endDay - startDay,
            "status": b["status"] or "confirmed",
            "guest": b["guest_name"] or "Guest",
            "rate": 3000,
            "source": b["booking_type"] or "Direct"
        })

    cursor.close()
    return jsonify(bookings)

@app.route("/api/bookings", methods=["POST"])
def create_booking():
    data = request.json

    db = get_db_connection()
    cursor = db.cursor()

    # Insert guest
    cursor.execute(
        "INSERT INTO guests (first_name) VALUES (%s)",
        (data["guest"],)
    )
    guest_id = cursor.lastrowid

    check_in = to_date(data["startDay"])
    check_out = to_date(data["endDay"])

    cursor.execute("""
        INSERT INTO reservations (room_id, guest_id, checkIn, checkOut, status)
        VALUES (%s, %s, %s, %s, %s)
    """, (
        data["room"],
        guest_id,
        check_in,
        check_out,
        data["status"]
    ))

    db.commit()
    cursor.close()
    db.close()

    return jsonify({"message": "Booking created"})


@app.route("/api/bookings/<int:id>", methods=["PUT"])
def update_booking(id):
    data = request.json

    check_in = to_date(data["startDay"])
    check_out = to_date(data["endDay"])

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
        UPDATE reservations
        SET room_id=%s, checkIn=%s, checkOut=%s
        WHERE reservation_id=%s
    """, (
        data["room"],
        check_in,
        check_out,
        id
    ))

    db.commit()
    cursor.close()
    db.close()

    return jsonify({"message": "Booking updated"})

@app.route("/api/check-conflict", methods=["POST"])
def check_conflict():
    data = request.json

    check_in = to_date(data["startDay"])
    check_out = to_date(data["endDay"])

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM reservations
        WHERE room_id = %s
        AND NOT (%s <= checkIn OR %s >= checkOut)
    """, (
        data["room"],
        check_out,
        check_in
    ))

    conflicts = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify({"conflict": len(conflicts) > 0})






if __name__ == "__main__":
    app.run(debug=True)