import { useState, useRef, useCallback, useEffect } from "react";

/* ─── Fonts ─── */
const FONT = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Syne:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`;

/* ─── Palette ─── */
const C = {
  bg:      '#0e0f0d',
  panel:   '#141510',
  surface: '#1a1c17',
  surface2:'#222420',
  border:  '#2a2c25',
  border2: '#373930',
  teal:    '#1a6b5a',
  tealL:   '#22876f',
  tealBg:  'rgba(26,107,90,.15)',
  tealBd:  'rgba(26,107,90,.4)',
  gold:    '#c49a2a',
  goldBg:  'rgba(196,154,42,.12)',
  goldBd:  'rgba(196,154,42,.35)',
  green:   '#2a7a4a',
  greenBg: 'rgba(42,122,74,.15)',
  greenBd: 'rgba(42,122,74,.4)',
  amber:   '#b86820',
  amberBg: 'rgba(184,104,32,.15)',
  amberBd: 'rgba(184,104,32,.4)',
  red:     '#8b3030',
  redBg:   'rgba(139,48,48,.15)',
  redBd:   'rgba(139,48,48,.4)',
  slate:   '#404540',
  slateBg: 'rgba(64,69,64,.25)',
  slateBd: 'rgba(64,69,64,.5)',
  ink:     '#e8e5de',
  ink2:    '#b8b5ae',
  ink3:    '#7a7870',
  ink4:    '#484540',
};

/* ─── Booking colors by status ─── */
const STATUS = {
  confirmed: { bg:'rgba(26,107,90,.22)', border:'rgba(34,135,111,.6)', text:'#7dd8b8', label:'Confirmed' },
  checkedin:  { bg:'rgba(42,122,74,.22)',  border:'rgba(56,160,100,.6)', text:'#7dcc9a', label:'Checked In' },
  blocked:    { bg:'rgba(64,69,64,.35)',   border:'rgba(90,95,88,.6)',  text:'#90928c', label:'Blocked' },
  cleaning:   { bg:'rgba(184,104,32,.2)',  border:'rgba(220,140,50,.5)',text:'#e0a860', label:'Cleaning' },
  tentative:  { bg:'rgba(196,154,42,.18)', border:'rgba(220,180,60,.5)',text:'#d4b840', label:'Tentative' },
};


/* ─── Dynamic Date Setup (NO HARDCODE) ─── */

// ✅ Base = today
const BASE = new Date();
BASE.setHours(0, 0, 0, 0);

// ✅ Today index always 0
const TODAY = 0;

// ✅ Number of days to show (UI choice)
const DAYS = 14;

// ✅ Generate day labels dynamically
const dayLabel = (i) => {
  const d = new Date(BASE);
  d.setDate(d.getDate() + i);

  return {
    day: d.getDate(),
    mon: d.toLocaleString('default', { month: 'short' }),
    dow: d.toLocaleString('default', { weekday: 'short' }).slice(0, 2),
    date: d
  };
};

// ✅ Final labels array
const DAY_LABELS = Array.from({ length: DAYS }, (_, i) => dayLabel(i));

/* ─── CSS ─── */
const CSS = `
${FONT}
html, body, #root {
  background: #0e0f0d !important;
  color: #e8e5de !important;
}
*,*::before,*::after{
  box-sizing:border-box;
  margin:0;
  padding:0
}

body{
  font-family:'Syne',sans-serif;
  background:${C.bg};
  color:${C.ink};
  font-size:13px;
  line-height:1.5;
  overflow:hidden;
}

.inventory-page {
  background: ${C.bg} !important;
  min-height: 100vh;
}

.shell{display:flex;flex-direction:column;height:100vh;overflow:hidden}

/* Top bar */
.topbar{background:${C.panel};border-bottom:1px solid ${C.border};padding:0 20px;height:52px;display:flex;align-items:center;gap:14px;flex-shrink:0;z-index:100}
.tb-logo{width:28px;height:28px;border-radius:6px;background:${C.gold};display:flex;align-items:center;justify-content:center;font-family:'DM Serif Display',serif;font-size:14px;color:#fff;flex-shrink:0}
.tb-hotel{font-family:'DM Serif Display',serif;font-size:15px;color:${C.ink}}
.tb-sep{width:1px;height:18px;background:${C.border2}}
.tb-crumb{font-size:11.5px;color:${C.ink3};display:flex;align-items:center;gap:5px}
.tb-crumb .cur{color:${C.gold};font-weight:600}
.tb-right{margin-left:auto;display:flex;align-items:center;gap:8px}
.tbtn{padding:5px 13px;border-radius:6px;font-family:'Syne',sans-serif;font-size:11.5px;font-weight:600;cursor:pointer;border:none;transition:all .15s}
.tbtn-ghost{background:rgba(255,255,255,.06);border:1px solid ${C.border2};color:${C.ink3}}
.tbtn-ghost:hover{background:rgba(255,255,255,.1);color:${C.ink}}
.tbtn-teal{background:${C.teal};color:#fff}
.tbtn-teal:hover{background:${C.tealL}}

/* Toolbar */
.toolbar{background:${C.surface};border-bottom:1px solid ${C.border};padding:0 20px;height:48px;display:flex;align-items:center;gap:10px;flex-shrink:0;overflow-x:auto}
.tbar-label{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${C.ink4};white-space:nowrap;padding-right:4px}
.fsel{background:${C.surface2};border:1.5px solid ${C.border2};border-radius:7px;padding:5px 10px;font-family:'Syne',sans-serif;font-size:12px;color:${C.ink};outline:none;cursor:pointer;appearance:none;transition:all .15s}
.fsel:focus{border-color:${C.tealL}}
.fchip{padding:5px 11px;border-radius:20px;border:1.5px solid ${C.border2};background:transparent;color:${C.ink3};font-family:'Syne',sans-serif;font-size:11.5px;font-weight:600;cursor:pointer;transition:all .15s;white-space:nowrap}
.fchip:hover{border-color:${C.tealL};color:${C.ink}}
.fchip.on{border-color:${C.tealL};background:${C.tealBg};color:#7dd8b8}
.tbar-sep{width:1px;height:24px;background:${C.border};flex-shrink:0}

/* Legend */
.legend{display:flex;align-items:center;gap:10px;margin-left:auto;flex-shrink:0}
.leg-item{display:flex;align-items:center;gap:5px;font-size:10.5px;color:${C.ink3}}
.leg-dot{width:10px;height:10px;border-radius:2px}

/* Calendar grid wrapper */
.cal-wrap{flex:1;overflow:hidden;display:flex;flex-direction:column}
.cal-scroll{flex:1;overflow:auto;position:relative}
.cal-scroll::-webkit-scrollbar{width:6px;height:6px}
.cal-scroll::-webkit-scrollbar-track{background:${C.bg}}
.cal-scroll::-webkit-scrollbar-thumb{background:${C.border2};border-radius:6px}

/* The actual grid */
.cal-table{min-width:900px;width:100%;border-collapse:collapse;table-layout:fixed}
.room-col{width:130px}
.day-col{min-width:62px}

/* Header row */
.cal-thead th{background:${C.surface};position:sticky;top:0;z-index:50;border-bottom:2px solid ${C.border2};padding:0}
.th-room{padding:10px 14px;text-align:left;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${C.ink4}}
.th-day{padding:6px 4px;text-align:center;cursor:pointer}
.th-day-inner{display:flex;flex-direction:column;align-items:center;gap:1px}
.th-dow{font-family:'JetBrains Mono',monospace;font-size:9px;color:${C.ink4};letter-spacing:.5px}
.th-num{font-family:'DM Serif Display',serif;font-size:17px;color:${C.ink2};line-height:1}
.th-mon{font-family:'JetBrains Mono',monospace;font-size:8.5px;color:${C.ink4}}
.th-day.today .th-num{color:${C.gold}}
.th-day.today .th-dow{color:${C.gold}}
.th-day.weekend .th-num{color:${C.ink3}}

/* Floor row */
.floor-row td{background:${C.bg};border-top:1px solid ${C.border2};padding:5px 14px}
.floor-label{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:${C.ink4};display:flex;align-items:center;gap:7px}
.floor-label::after{content:'';flex:1;height:1px;background:${C.border}}

/* Room row */
.room-row td{border-bottom:1px solid ${C.border};vertical-align:top;padding:0}
.room-row:hover .room-cell{background:rgba(255,255,255,.015)}
.room-cell{padding:4px 8px 4px 14px;height:46px;display:flex;align-items:center;gap:7px;background:${C.surface};border-right:1px solid ${C.border2};cursor:default;min-width:130px}
.room-num{font-family:'DM Serif Display',serif;font-size:17px;color:${C.ink2};flex-shrink:0}
.room-info{display:flex;flex-direction:column;gap:1px}
.room-type{font-size:10px;font-weight:700;color:${C.ink3};letter-spacing:.3px}
.room-bed{font-size:9px;color:${C.ink4};font-family:'JetBrains Mono',monospace}
.vip-dot{width:5px;height:5px;border-radius:50%;background:${C.gold};flex-shrink:0}

/* Day cells */
.day-cell{border-right:1px solid ${C.border};height:46px;position:relative;cursor:pointer;transition:background .1s}
.day-cell:hover{background:rgba(255,255,255,.025)}
.day-cell.today-col{background:rgba(196,154,42,.04)}
.day-cell.today-col::before{content:'';position:absolute;top:0;bottom:0;left:0;width:1.5px;background:rgba(196,154,42,.4)}
.day-cell.weekend-col{background:rgba(255,255,255,.01)}

/* Booking blocks */
.bk{position:absolute;top:5px;bottom:5px;border-radius:5px;display:flex;align-items:center;overflow:hidden;cursor:grab;transition:opacity .15s,transform .1s,box-shadow .1s;user-select:none;z-index:10}
.bk:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,.4)}
.bk.dragging{opacity:.55;z-index:200;cursor:grabbing}
.bk-inner{padding:0 9px;display:flex;align-items:center;gap:6px;height:100%;width:100%;overflow:hidden}
.bk-guest{font-size:11px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0}
.bk-nights{font-family:'JetBrains Mono',monospace;font-size:9px;opacity:.7;flex-shrink:0}
.bk-handle{width:5px;height:100%;position:absolute;right:0;top:0;cursor:ew-resize;border-radius:0 5px 5px 0;background:rgba(255,255,255,.15);opacity:0;transition:opacity .15s}
.bk:hover .bk-handle{opacity:1}

/* Tooltip */
.tooltip{position:fixed;z-index:999;background:${C.surface};border:1px solid ${C.border2};border-radius:10px;padding:13px 15px;min-width:200px;box-shadow:0 12px 40px rgba(0,0,0,.6);pointer-events:none;animation:fadeIn .15s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
.tt-hd{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:9px}
.tt-name{font-family:'DM Serif Display',serif;font-size:16px;color:${C.ink};line-height:1.2}
.tt-status{font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:12px;font-family:'JetBrains Mono',monospace;flex-shrink:0;margin-top:3px}
.tt-row{display:flex;justify-content:space-between;font-size:11.5px;margin-bottom:4px}
.tt-row:last-child{margin-bottom:0}
.tt-l{color:${C.ink3}}
.tt-v{font-weight:600;color:${C.ink};font-family:'JetBrains Mono',monospace;font-size:11px}

/* New booking popup */
.popup-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:500;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s ease}
.popup{background:${C.surface};border:1px solid ${C.border2};border-radius:14px;padding:22px;min-width:340px;box-shadow:0 20px 60px rgba(0,0,0,.7)}
.pop-title{font-family:'DM Serif Display',serif;font-size:20px;color:${C.ink};margin-bottom:16px}
.pop-fld{margin-bottom:12px}
.pop-lbl{font-size:10.5px;font-weight:700;color:${C.ink3};text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
.pop-in,.pop-sel{width:100%;background:${C.surface2};border:1.5px solid ${C.border2};border-radius:8px;padding:8px 12px;font-family:'Syne',sans-serif;font-size:13px;color:${C.ink};outline:none;transition:all .2s;appearance:none}
.pop-in:focus,.pop-sel:focus{border-color:${C.tealL};background:${C.bg}}
.pop-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.pop-btns{display:flex;gap:8px;margin-top:18px;justify-content:flex-end}
.pop-cancel{padding:8px 16px;border-radius:8px;background:transparent;border:1.5px solid ${C.border2};color:${C.ink3};font-family:'Syne',sans-serif;font-size:12.5px;font-weight:600;cursor:pointer;transition:all .15s}
.pop-cancel:hover{border-color:${C.ink3};color:${C.ink}}
.pop-create{padding:8px 18px;border-radius:8px;background:${C.teal};border:none;color:#fff;font-family:'Syne',sans-serif;font-size:12.5px;font-weight:700;cursor:pointer;transition:all .15s}
.pop-create:hover{background:${C.tealL}}

/* Conflict banner */
.conflict-banner{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:${C.red};border-radius:10px;padding:11px 20px;font-size:13px;font-weight:700;color:#fff;z-index:800;display:flex;align-items:center;gap:9px;box-shadow:0 8px 30px rgba(0,0,0,.5);animation:slideUp .3s ease}
@keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}

/* Stats strip */
.stats-strip{background:${C.surface};border-top:1px solid ${C.border};padding:7px 20px;display:flex;align-items:center;gap:22px;flex-shrink:0}
.stat-item{display:flex;align-items:center;gap:7px}
.stat-dot{width:8px;height:8px;border-radius:2px}
.stat-val{font-family:'DM Serif Display',serif;font-size:17px;color:${C.ink}}
.stat-lbl{font-size:10px;color:${C.ink3};font-weight:600;text-transform:uppercase;letter-spacing:.5px}
.stat-pct{font-size:10px;font-family:'JetBrains Mono',monospace;color:${C.ink4}}
.stats-right{margin-left:auto;display:flex;align-items:center;gap:12px;font-size:11px;color:${C.ink3}}
.occ-bar{width:100px;height:6px;background:${C.border2};border-radius:6px;overflow:hidden}
.occ-fill{height:100%;background:linear-gradient(90deg,${C.teal},${C.tealL});border-radius:6px;transition:width .3s}
`;

/* ─── Tooltip Component ─── */
function Tooltip({ booking, room, x, y }) {
  const s = STATUS[booking.status];
  const days = DAY_LABELS;
  const ci = days[booking.startDay];
  const co = days[Math.min(booking.endDay, DAYS-1)];
  return (
    <div className="tooltip" style={{ left: x, top: y }}>
      <div className="tt-hd">
        <div className="tt-name">{booking.guest || (booking.status === 'blocked' ? '🚫 Blocked' : '🧹 Cleaning')}</div>
        <span className="tt-status" style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>{s.label}</span>
      </div>
      <div className="tt-row"><span className="tt-l">Room</span><span className="tt-v">{booking.room} — {room?.type}</span></div>
      <div className="tt-row"><span className="tt-l">Check-in</span><span className="tt-v">{ci?.dow} {ci?.day} {ci?.mon}</span></div>
      <div className="tt-row"><span className="tt-l">Check-out</span><span className="tt-v">{co?.dow} {co?.day} {co?.mon}</span></div>
      <div className="tt-row"><span className="tt-l">Nights</span><span className="tt-v">{booking.nights}</span></div>
      {booking.rate > 0 && <div className="tt-row"><span className="tt-l">Rate</span><span className="tt-v">₹{booking.rate.toLocaleString('en-IN')}/n</span></div>}
      {booking.source && booking.rate > 0 && <div className="tt-row"><span className="tt-l">Source</span><span className="tt-v">{booking.source}</span></div>}
    </div>
  );
}

/* ─── New Booking Popup ─── */
function NewBookingPopup({ room, startDay, endDay, onClose, onCreate }) {
  const [guest, setGuest] = useState('');
  const [status, setStatus] = useState('confirmed');
  const [rate, setRate] = useState('3500');
  const [ed, setEd] = useState(endDay);
  const days = DAY_LABELS;
  const ci = days[startDay];
  const co = days[Math.min(ed, DAYS-1)];
  return (
    <div className="popup-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="popup">
        <div className="pop-title">New Reservation</div>
        <div className="pop-row">
          <div className="pop-fld">
            <div className="pop-lbl">Room</div>
            <input className="pop-in" value={`${room.id} — ${room.type}`} readOnly style={{opacity:.6}}/>
          </div>
          <div className="pop-fld">
            <div className="pop-lbl">Type</div>
            <select className="pop-sel" value={status} onChange={e=>setStatus(e.target.value)}>
              <option value="confirmed">Confirmed</option>
              <option value="tentative">Tentative</option>
              <option value="blocked">Block Room</option>
              <option value="cleaning">Cleaning</option>
            </select>
          </div>
        </div>
        <div className="pop-fld">
          <div className="pop-lbl">Guest Name</div>
          <input className="pop-in" placeholder="Guest name or reason…" value={guest} onChange={e=>setGuest(e.target.value)} autoFocus/>
        </div>
        <div className="pop-row">
          <div className="pop-fld">
            <div className="pop-lbl">Check-in</div>
            <input className="pop-in" value={`${ci?.day} ${ci?.mon} 2026`} readOnly style={{opacity:.6}}/>
          </div>
          <div className="pop-fld">
            <div className="pop-lbl">Nights</div>
            <input className="pop-in" type="number" value={ed - startDay} min={1} max={DAYS-startDay-1}
              onChange={e => setEd(startDay + Math.max(1, Number(e.target.value)))}/>
          </div>
        </div>
        {status !== 'blocked' && status !== 'cleaning' && (
          <div className="pop-row">
            <div className="pop-fld">
              <div className="pop-lbl">Rate (₹/night)</div>
              <input className="pop-in" type="number" value={rate} onChange={e=>setRate(e.target.value)}/>
            </div>
            <div className="pop-fld">
              <div className="pop-lbl">Source</div>
              <select className="pop-sel">
                <option>Direct</option><option>Booking.com</option><option>MakeMyTrip</option><option>Corporate</option>
              </select>
            </div>
          </div>
        )}
        <div className="pop-btns">
          <button className="pop-cancel" onClick={onClose}>Cancel</button>
          <button className="pop-create" onClick={() => onCreate({ room: room.id, startDay, endDay: ed, guest: guest || null, status, rate: Number(rate), nights: ed-startDay, source:'Direct' })}>
            {status==='blocked'?'Block Room':status==='cleaning'?'Mark Cleaning':'Create Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main App ─── */
export default function App() {
 const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState({ type:'All', floor:'All', status:'All' });
  const [tooltip, setTooltip] = useState(null);
  const [popup, setPopup] = useState(null);
  const [conflict, setConflict] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [view, setView] = useState('all'); // all | available | occupied
  const calRef = useRef();
  const cellW = useRef(62);
  const dragStartX = useRef(0);
  const dragStartDay = useRef(0);
const [rooms, setRooms] = useState([]);

useEffect(() => {
  // rooms fetch
  fetch("http://localhost:5000/api/rooms")
    .then(res => res.json())
    .then(data => setRooms(data))
    .catch(err => console.error("Rooms error:", err));

  // bookings fetch
  fetch("http://localhost:5000/api/bookings")
    .then(res => res.json())
    .then(data => {
      setBookings(
        data.map(b => ({
          ...b,
          room: b.room || b.roomId,
          startDay: b.startDay ?? 0,
          endDay: b.endDay ?? 1,
          nights: b.nights ?? (b.endDay - b.startDay)
        }))
      );
    })
    .catch(err => console.error("Bookings error:", err));

}, []);
  /* ── Filtered rooms ── */
/* ── Group rooms by floor ── */
const groupedFloors = rooms.reduce((acc, room) => {
  if (!acc[room.floor]) acc[room.floor] = [];
  acc[room.floor].push(room);
  return acc;
}, {});

/* ── Apply filters ── */
const visibleFloors = Object.entries(groupedFloors)
  .map(([floor, rms]) => ({
    floor,
    rooms: rms.filter(r => {
      if (filter.floor !== 'All' && String(floor) !== filter.floor) return false;
      if (filter.type !== 'All' && r.type !== filter.type) return false;
      return true;
    })
  }))
  .filter(f => f.rooms.length > 0);
  /* ── Check conflict ── */
  const hasConflict = useCallback((roomId, startDay, endDay, excludeId=null) => {
    return bookings.some(b =>
      b.room === roomId && b.id !== excludeId &&
      !(endDay <= b.startDay || startDay >= b.endDay)
    );
  }, [bookings]);

  /* ── Drag ── */
  const startDrag = useCallback((e, booking) => {
    e.preventDefault();
    dragStartX.current = e.clientX;
    dragStartDay.current = booking.startDay;
    setDragging(booking);
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX.current;
    const dayDelta = Math.round(dx / cellW.current);
    const newStart = Math.max(0, Math.min(DAYS - dragging.nights, dragStartDay.current + dayDelta));
    setDragOver({ ...dragging, startDay: newStart, endDay: newStart + dragging.nights });
  }, [dragging]);
const endDrag = useCallback((e, targetRoom = null) => {
  if (!dragging || !dragOver) {
    setDragging(null);
    setDragOver(null);
    return;
  }

  const roomId = targetRoom || dragging.room; // ✅ IMPORTANT

  if (hasConflict(roomId, dragOver.startDay, dragOver.endDay, dragging.id)) {
    setConflict(`⚠ Conflict — Room ${roomId} already booked for those dates`);
    setTimeout(() => setConflict(null), 3000);
  } else {

    // ✅ Frontend update
    setBookings(bs =>
      bs.map(b =>
        b.id === dragging.id
          ? {
              ...b,
              room: roomId,
              startDay: dragOver.startDay,
              endDay: dragOver.endDay
            }
          : b
      )
    );

    // ✅ Backend update
    fetch(`http://localhost:5000/api/bookings/${dragging.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        room: roomId,
        startDay: dragOver.startDay,
        endDay: dragOver.endDay
      }),
    }).catch(err => console.error("Update error:", err));
  }

  setDragging(null);
  setDragOver(null);
}, [dragging, dragOver, hasConflict]);
const createBooking = (data) => {
  if (hasConflict(data.room, data.startDay, data.endDay)) {
    setConflict(`⚠ Conflict — Room ${data.room} already has a booking`);
    setTimeout(() => setConflict(null), 3000);
    setPopup(null);
    return;
  }

  fetch("http://localhost:5000/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(newBooking => {
      setBookings(prev => [...prev, newBooking]);
    })
    .catch(err => console.error("Error:", err));

  setPopup(null);
};
  /* ── Stats ── */
  const totalRooms = rooms.length;
  const occupiedToday = bookings.filter(b => b.startDay <= 0 && b.endDay > 0 && b.status === 'checkedin').length;
  const checkedIn = bookings.filter(b => b.status === 'checkedin').length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const blocked = bookings.filter(b => b.status === 'blocked' || b.status === 'cleaning').length;
  const occ = Math.round((occupiedToday / totalRooms) * 100);

  /* ── Render booking block ── */
  const renderBooking = (b, isGhost=false) => {
    const s = STATUS[b.status] || STATUS.confirmed;
    const active = dragOver && dragging?.id === b.id ? dragOver : b;
    const left = `calc(${active.startDay} * (100% / ${DAYS}))`;
    const width = `calc(${active.nights || (active.endDay - active.startDay)} * (100% / ${DAYS}) - 4px)`;
    return (
      <div
        key={b.id}
        className={`bk${dragging?.id === b.id ? ' dragging' : ''}`}
        style={{ left, width, background: s.bg, border: `1.5px solid ${s.border}`, color: s.text, opacity: isGhost ? 0.4 : 1 }}
        onMouseDown={e => startDrag(e, b)}
        onMouseEnter={e => !dragging && setTooltip({ booking: b, room: rooms.find(r => r.id === b.room), x: e.clientX+12, y: e.clientY+12 })}
        onMouseMove={e => tooltip && setTooltip(t => t ? { ...t, x: e.clientX+12, y: e.clientY+12 } : null)}
        onMouseLeave={() => setTooltip(null)}
      >
        <div className="bk-inner">
          <span className="bk-guest">{b.guest || (b.status === 'blocked' ? 'Blocked' : 'Cleaning')}</span>
          <span className="bk-nights">{b.nights || (b.endDay - b.startDay)}n</span>
        </div>
        <div className="bk-handle" />
      </div>
    );
  };

  /* ── Get bookings for a room, accounting for drag state ── */
  const roomBookings = (roomId) => {
    let bks = bookings.filter(b => {
      if (dragging && dragOver && b.id === dragging.id) return false; // hide while dragging
      return b.room === roomId;
    });
    // If dragging into this room
    if (dragging && dragOver && dragOver.room === roomId) {
      bks = [...bks, { ...dragging, ...dragOver, room: roomId }];
    }
    return bks;
  };

  const roomBookingsAbsolute = (roomId) => {
    return bookings.filter(b => b.room === roomId);
  };
const clickCell = (room, dayIdx) => {
  if (dragging) return;

  setPopup({
    room,
    startDay: dayIdx,
    endDay: Math.min(dayIdx + 2, DAYS)
  });
};
  return (
    <>
      <style>{CSS}</style>
      <div className="inventory-page" style={{ background: "#0e0f0d" }}>

 
      <div
        className="shell"
        onMouseMove={onMouseMove}
        onMouseUp={() => endDrag()}
      >

        {/* ── TOP BAR ── */}
        <header className="topbar">
          
          <div className="tb-sep" />
          <div className="tb-crumb">
            
            <span style={{color:C.border2}}>›</span>
            <span className="cur">Inventory Calendar</span>
          </div>
          <div className="tb-right">
            <button className="tbtn tbtn-ghost">Export PDF</button>
            <button className="tbtn tbtn-ghost">Print View</button>
            <button className="tbtn tbtn-teal" onClick={() => setPopup({ room: rooms[0], startDay: 0, endDay: 2 })}>
              + New Booking
            </button>
          </div>
        </header>

        {/* ── TOOLBAR ── */}
        <div className="toolbar">
          <span className="tbar-label">Filter</span>
          <select className="fsel" value={filter.floor} onChange={e => setFilter(f => ({...f, floor: e.target.value}))}>
            <option value="All">All Floors</option>
            {[1,2,3,4].map(n => <option key={n} value={n}>Floor {n}</option>)}
          </select>
          <select className="fsel" value={filter.type} onChange={e => setFilter(f => ({...f, type: e.target.value}))}>
            <option value="All">All Types</option>
            {['Standard','Deluxe','Suite','Premier','Penthouse','Honeymoon'].map(t => <option key={t}>{t}</option>)}
          </select>
          <div className="tbar-sep"/>
          <span className="tbar-label">Show</span>
          {['All','Available','Occupied','VIP'].map(v => (
            <button key={v} className={`fchip${view===v.toLowerCase()?' on':''}`}
              onClick={() => setView(v.toLowerCase())}>{v}</button>
          ))}
          <div className="tbar-sep"/>
          <div className="legend">
            {Object.entries(STATUS).map(([k,s]) => (
              <div key={k} className="leg-item">
                <div className="leg-dot" style={{background:s.border}}/>
                {s.label}
              </div>
            ))}
            <div className="leg-item" style={{color:C.ink4,fontSize:10}}>· Drag to move · Click empty to create</div>
          </div>
        </div>

        {/* ── CALENDAR ── */}
        <div className="cal-wrap">
          <div className="cal-scroll" ref={calRef}>
            <table className="cal-table">
              <colgroup>
                <col className="room-col"/>
                {DAY_LABELS.map((_,i) => <col key={i} className="day-col"/>)}
              </colgroup>

              {/* Header */}
              <thead className="cal-thead">
                <tr>
                  <th><div className="th-room">Room</div></th>
                  {DAY_LABELS.map((d,i) => (
                    <th key={i} className={`th-day${i===0?' today':''}${d.dow==='Sa'||d.dow==='Su'?' weekend':''}`}>
                      <div className="th-day-inner">
                        <div className="th-dow">{d.dow}</div>
                        <div className="th-num">{d.day}</div>
                        <div className="th-mon">{d.mon}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visibleFloors.map(({ floor, rooms }) => (
                  <>
                    {/* Floor separator */}
                    <tr key={`f${floor}`} className="floor-row">
                      <td colSpan={DAYS + 1}>
                        <div className="floor-label">Floor {floor}</div>
                      </td>
                    </tr>

                    {rooms.map(room => {
                      const rBks = roomBookingsAbsolute(room.id);
                      const hasToday = rBks.some(b => b.startDay <= 0 && b.endDay > 0);
                      const isVip = ['Suite','Premier','Penthouse','Honeymoon'].includes(room.type);

                      // View filter
                      if (view === 'available' && hasToday) return null;
                      if (view === 'occupied' && !hasToday) return null;
                      if (view === 'vip' && !isVip) return null;

                      return (
                        <tr key={room.id} className="room-row">
                          {/* Room label */}
                          <td>
                            <div className="room-cell">
                              {isVip && <div className="vip-dot"/>}
                              <div className="room-num">{room.id}</div>
                              <div className="room-info">
                                <div className="room-type">{room.type}</div>
                                <div className="room-bed">{room.bed}</div>
                              </div>
                            </div>
                          </td>

                          {/* Day cells with relative booking blocks */}
                          <td colSpan={DAYS} style={{position:'relative', padding:0, height:46}}>
                            {/* Grid lines */}
                            <div style={{position:'absolute',inset:0,display:'flex',pointerEvents:'none'}}>
                              {DAY_LABELS.map((_,i) => (
                                <div key={i} style={{
                                  flex:1, borderRight:`1px solid ${C.border}`,
                                  background: i===0 ? `rgba(196,154,42,.04)` : i%7===5||i%7===6 ? `rgba(255,255,255,.008)` : 'transparent'
                                }}/>
                              ))}
                            </div>

                            {/* Clickable cells */}
                            <div style={{position:'absolute',inset:0,display:'flex'}}>
                              {DAY_LABELS.map((_,i) => (
                                <div key={i} className="day-cell"
                                  style={{flex:1}}
                                  onClick={() => {
                                    const occ = rBks.some(b => b.startDay <= i && b.endDay > i);
                                    if (!occ) clickCell(room, i);
                                  }}
                                />
                              ))}
                            </div>

                            {/* Booking blocks — rendered absolutely across full row */}
                            <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
                              <div style={{position:'relative',width:'100%',height:'100%',pointerEvents:'all'}}>
                                {roomBookings(room.id).map(b => renderBooking(b))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── STATS STRIP ── */}
        <div className="stats-strip">
          <div className="stat-item">
            <div className="stat-dot" style={{background: STATUS.checkedin.border}}/>
            <div>
              <div style={{display:'flex',alignItems:'baseline',gap:5}}>
                <span className="stat-val">{checkedIn}</span>
                <span className="stat-pct">/{totalRooms}</span>
              </div>
              <div className="stat-lbl">Checked In</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-dot" style={{background: STATUS.confirmed.border}}/>
            <div>
              <span className="stat-val">{confirmed}</span>
              <div className="stat-lbl">Confirmed</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-dot" style={{background: STATUS.blocked.border}}/>
            <div>
              <span className="stat-val">{blocked}</span>
              <div className="stat-lbl">Blocked / Cleaning</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-dot" style={{background: C.border2}}/>
            <div>
              <span className="stat-val">{totalRooms - occupiedToday - blocked}</span>
              <div className="stat-lbl">Available Today</div>
            </div>
          </div>

          <div className="stats-right">
            <span style={{fontWeight:700,color:C.ink2}}>Today's Occupancy</span>
            <div className="occ-bar"><div className="occ-fill" style={{width: `${occ}%`}}/></div>
            <span style={{fontFamily:'JetBrains Mono,monospace',fontWeight:700,color:C.gold}}>{occ}%</span>
            <div className="tbar-sep" style={{height:20}}/>
            <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:C.ink4}}>
              {DAY_LABELS[0].day} – {DAY_LABELS[DAYS-1].day} {DAY_LABELS[0].mon} · 14 days
            </span>
          </div>
        </div>

        {/* ── TOOLTIP ── */}
        {tooltip && !dragging && (
          <Tooltip {...tooltip} x={Math.min(tooltip.x, window.innerWidth - 230)} y={Math.min(tooltip.y, window.innerHeight - 200)}/>
        )}

        {/* ── POPUP ── */}
        {popup && (
          <NewBookingPopup
            room={popup.room}
            startDay={popup.startDay}
            endDay={popup.endDay}
            onClose={() => setPopup(null)}
            onCreate={createBooking}
          />
        )}

        {/* ── CONFLICT BANNER ── */}
        {conflict && (
          <div className="conflict-banner">⚠ {conflict}</div>
        )}
      </div>
      </div>
      
    </>
  );
}
