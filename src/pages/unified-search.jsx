import { useState, useEffect, useMemo, useRef, useCallback } from "react";

/* ═══════════════════════ DESIGN TOKENS ═══════════════════════ */
const C = {
  bg:     "#0A0D14", bgL:   "#111520", bgM:   "#161C2C", bgCard: "#1A2035",
  bgHov:  "#1F2840", bgGlass:"rgba(17,21,32,0.96)",
  navy:   "#1B2E42", navyM: "#243D56",
  gold:   "#C99820", goldL: "#FBF4DC", goldD: "#8B6914",
  border: "#252E45", borderL:"#2E3A55", borderGlow:"#C9982040",
  t1:     "#E8EDF8", t2:    "#A8B8D0", t3:    "#6070A0", t4:    "#404C70",
  green:  "#22C55E", greenL:"#0D2015", greenD:"#15803D",
  red:    "#EF4444", redL:  "#1E0A0A", redD:  "#991B1B",
  amber:  "#F59E0B", amberL:"#1E1500", amberD:"#B45309",
  blue:   "#3B82F6", blueL: "#0A1020", blueD: "#1D4ED8",
  purple: "#A855F7", purpleL:"#150A20",
  teal:   "#14B8A6", tealL: "#081818",
};
const F = {
  serif: "'Cormorant Garamond',Georgia,serif",
  sans:  "'Outfit',sans-serif",
  mono:  "'JetBrains Mono','Courier New',monospace",
};

/* ═══════════════════════ TIER / STATUS / RADAR ══════════════ */
const TIERS = {
  Platinum: { color:"#A855F7", bg:"#1A0A28", border:"#6B3FA0" },
  Elite:    { color:"#F59E0B", bg:"#1E1200", border:"#92600A" },
  Gold:     { color:"#C99820", bg:"#1A1400", border:"#806010" },
  Silver:   { color:"#6070A0", bg:"#0E1220", border:"#303C60" },
  Bronze:   { color:"#C08060", bg:"#1A1008", border:"#804030" },
  Member:   { color:"#50806A", bg:"#0A1410", border:"#305040" },
};
const RADAR = {
  safe:      { icon:"🟢", color: C.green },
  attention: { icon:"🟡", color: C.amber },
  risk:      { icon:"🔴", color: C.red   },
};
const STATUS_COLORS = {
  "In-House":    { color: C.green,  bg: C.greenL },
  "Arriving":    { color: C.blue,   bg: C.blueL  },
  "Departing":   { color: C.amber,  bg: C.amberL },
  "Checked Out": { color: C.t3,     bg: C.bgM    },
  "Reserved":    { color: C.purple, bg: C.purpleL},
};

/* ═══════════════════════ DATA ════════════════════════════════ */

/* ═══════════════════════ FUZZY MATCH ════════════════════════ */
function fuzzyScore(str, query) {
  if (!query) return 0;
  str = str.toLowerCase();
  query = query.toLowerCase();
  if (str.includes(query)) return 100 - (str.indexOf(query) / str.length) * 20;
  // character-level fuzzy
  let si = 0, qi = 0, score = 0;
  while (si < str.length && qi < query.length) {
    if (str[si] === query[qi]) { score += 10; qi++; }
    si++;
  }
  return qi === query.length ? score : 0;
}
async function searchFromBackend(query) {
  if (!query.trim()) {
    return { guests: [], reservations: [], rooms: [] };
  }

  try {
    const res = await fetch(`http://localhost:5000/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();

    return data; // { guests, reservations, rooms }
  } catch (err) {
    console.error("Search API error:", err);
    return { guests: [], reservations: [], rooms: [] };
  }
}
function normalizePhone(s) { return s.replace(/[\s\-\(\)\+]/g, ""); }


/* ═══════════════════════ SCORE COLOR ════════════════════════ */
function scoreColor(s) {
  if (s >= 85) return C.green;
  if (s >= 70) return C.teal;
  if (s >= 55) return C.amber;
  return C.red;
}

/* ═══════════════════════ CSS ════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden}
body{font-family:'Outfit',sans-serif;background:${C.bgL};color:${C.t1};font-size:13px}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-thumb{background:${C.borderL};border-radius:3px}

/* ── Shell ── */
.shell{display:grid;grid-template-rows:52px 1fr;height:100vh;overflow:hidden}

/* ── Topbar ── */
.topbar{background:${C.bg};border-bottom:1px solid ${C.border};display:flex;align-items:center;padding:0 20px;gap:14px;flex-shrink:0}
.tb-logo{width:28px;height:28px;border-radius:6px;background:${C.goldD};display:flex;align-items:center;justify-content:center;font-family:${F.serif};font-size:15px;font-weight:600;color:#fff;flex-shrink:0}
.tb-hotel{font-family:${F.serif};font-size:17px;font-weight:600;color:#E8DABC;letter-spacing:.3px;white-space:nowrap}
.tb-sep{width:1px;height:18px;background:${C.border};flex-shrink:0}
.tb-crumb{font-size:11.5px;color:${C.t4};display:flex;align-items:center;gap:5px}
.tb-crumb .cur{color:${C.gold};font-weight:600}
.tb-right{margin-left:auto;display:flex;align-items:center;gap:8px}
.tbtn{padding:5px 14px;border-radius:6px;font-family:${F.sans};font-size:12px;font-weight:600;cursor:pointer;border:1px solid transparent;transition:all .15s;white-space:nowrap}
.tbtn-ghost{background:rgba(255,255,255,.05);border-color:${C.border}!important;color:${C.t3}}
.tbtn-ghost:hover{background:rgba(255,255,255,.09);color:${C.t1}}
.tbtn-gold{background:${C.goldD};border-color:${C.gold}!important;color:${C.goldL}}

/* ── Demo background (simulated PMS) ── */
.demo-bg{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;background:${C.bgL};height:100%}
.demo-hint{display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center}
.demo-shortcut{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:12px;background:${C.bgCard};border:1px solid ${C.borderL};font-family:${F.mono};font-size:13px;color:${C.t2}}
.kbd{display:inline-flex;align-items:center;justify-content:center;padding:3px 9px;border-radius:6px;background:${C.bgM};border:1px solid ${C.borderL};font-family:${F.mono};font-size:11px;color:${C.t1};font-weight:600;letter-spacing:.04em}
.demo-grid{display:grid;grid-template-columns:repeat(4,180px);gap:12px}
.demo-card{background:${C.bgCard};border:1px solid ${C.border};border-radius:10px;padding:14px 16px;cursor:pointer;transition:all .15s}
.demo-card:hover{border-color:${C.borderL};background:${C.bgHov};transform:translateY(-2px)}
.demo-card-icon{font-size:20px;margin-bottom:6px}
.demo-card-title{font-size:13px;font-weight:600;color:${C.t2}}
.demo-card-sub{font-size:10.5px;color:${C.t4};margin-top:2px;font-family:${F.mono}}

/* ── Search overlay ── */
.overlay{position:fixed;inset:0;z-index:1000;background:rgba(5,8,15,.75);display:flex;flex-direction:column;align-items:center;padding-top:80px;animation:fadeIn .15s ease;backdrop-filter:blur(6px)}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}

/* ── Search modal ── */
.modal{width:660px;max-width:96vw;background:${C.bgGlass};border:1px solid ${C.borderL};border-radius:16px;box-shadow:0 32px 80px rgba(0,0,0,.6),0 0 0 1px ${C.borderGlow};display:flex;flex-direction:column;overflow:hidden;max-height:calc(100vh - 120px);animation:modalIn .18s ease}
@keyframes modalIn{from{opacity:0;transform:translateY(-10px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}

/* ── Search input ── */
.search-row{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid ${C.border}}
.search-icon-wrap{width:32px;height:32px;border-radius:8px;background:${C.bgM};display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.search-input{flex:1;background:none;border:none;outline:none;font-family:${F.sans};font-size:17px;color:${C.t1};caret-color:${C.gold}}
.search-input::placeholder{color:${C.t4}}
.search-kbd{font-family:${F.mono};font-size:10px;color:${C.t4};flex-shrink:0;display:flex;align-items:center;gap:5px}
.search-kbd .kbd{padding:2px 6px;font-size:9px}
.clear-btn{background:none;border:none;color:${C.t4};cursor:pointer;font-size:15px;padding:2px;line-height:1;transition:color .12s;flex-shrink:0}
.clear-btn:hover{color:${C.t2}}

/* ── Search body ── */
.search-body{overflow-y:auto;flex:1;min-height:0}

/* ── Section ── */
.section{padding:8px 0 4px}
.section-hd{padding:4px 18px 6px;display:flex;align-items:center;gap:6px}
.section-label{font-family:${F.mono};font-size:8.5px;letter-spacing:.16em;text-transform:uppercase;color:${C.t4};font-weight:700}
.section-count{font-family:${F.mono};font-size:8px;color:${C.t4};background:${C.bgM};padding:1px 7px;border-radius:8px;border:1px solid ${C.border}}
.section-line{flex:1;height:1px;background:${C.border};margin-left:6px}

/* ── Guest result card ── */
.g-card{display:flex;align-items:center;gap:12px;padding:10px 18px;cursor:pointer;transition:background .1s;border-left:3px solid transparent;position:relative}
.g-card:hover,.g-card.active{background:${C.bgHov};border-left-color:${C.gold}}
.g-card.active{background:${C.bgHov}}
.g-photo{width:38px;height:38px;border-radius:9px;overflow:hidden;flex-shrink:0;background:${C.bgM}}
.g-photo img{width:100%;height:100%;object-fit:cover;display:block}
.g-photo-init{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:${F.serif};font-weight:700;color:#fff;font-size:15px}
.g-name{font-size:13.5px;font-weight:700;color:${C.t1};line-height:1.2;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.g-sub{font-size:11px;color:${C.t3};margin-top:2px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.g-right{margin-left:auto;display:flex;flex-direction:column;align-items:flex-end;gap:4px}
.tier-badge{font-family:${F.mono};font-size:8px;font-weight:700;padding:2px 8px;border-radius:8px;letter-spacing:.08em}
.room-badge{font-family:${F.mono};font-size:9.5px;color:${C.gold};font-weight:600;padding:1.5px 7px;border-radius:7px;background:${C.goldD}22;border:1px solid ${C.goldD}50}
.status-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.score-mini{display:flex;align-items:center;gap:5px}
.score-bar{width:32px;height:3px;border-radius:2px;background:${C.border}}
.score-fill{height:100%;border-radius:2px}

/* ── Reservation result ── */
.r-card{display:flex;align-items:center;gap:12px;padding:10px 18px;cursor:pointer;transition:background .1s;border-left:3px solid transparent}
.r-card:hover,.r-card.active{background:${C.bgHov};border-left-color:${C.blue}}
.r-icon{width:34px;height:34px;border-radius:8px;background:${C.blueL};border:1px solid ${C.blueD}40;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.r-id{font-family:${F.mono};font-size:12px;font-weight:700;color:${C.blue}}
.r-meta{font-size:11px;color:${C.t3};margin-top:2px;display:flex;gap:8px;flex-wrap:wrap}

/* ── Room result ── */
.rm-card{display:flex;align-items:center;gap:12px;padding:10px 18px;cursor:pointer;transition:background .1s;border-left:3px solid transparent}
.rm-card:hover,.rm-card.active{background:${C.bgHov};border-left-color:${C.teal}}
.rm-icon{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.rm-num{font-family:${F.mono};font-size:14px;font-weight:700;color:${C.teal}}

/* ── Empty / loading ── */
.empty-state{padding:40px 18px;text-align:center}
.empty-icon{font-size:32px;opacity:.25;margin-bottom:10px}

/* ── Suggestions (before search) ── */
.suggestions{padding:8px 0 6px}
.sug-hd{padding:4px 18px 6px;font-family:${F.mono};font-size:8.5px;letter-spacing:.16em;color:${C.t4};text-transform:uppercase}
.sug-chip{display:inline-flex;align-items:center;gap:6px;margin:3px 6px 3px 0;padding:5px 12px;border-radius:20px;border:1px solid ${C.border};background:${C.bgM};font-family:${F.mono};font-size:9.5px;color:${C.t3};cursor:pointer;transition:all .14s;letter-spacing:.04em}
.sug-chip:hover{border-color:${C.gold}60;color:${C.gold};background:${C.goldD}18}
.sug-row{padding:0 18px;display:flex;flex-wrap:wrap}

/* ── Footer ── */
.modal-footer{padding:10px 18px;border-top:1px solid ${C.border};display:flex;align-items:center;gap:14px;flex-shrink:0;background:${C.bg}}
.footer-key{display:flex;align-items:center;gap:5px;font-size:10.5px;color:${C.t4};font-family:${F.mono}}
.footer-sep{width:1px;height:12px;background:${C.border}}
.result-count{margin-left:auto;font-family:${F.mono};font-size:9px;color:${C.t4}}

/* ── Highlight match ── */
.hl{color:${C.gold};font-weight:700}

/* ── Toast ── */
.toast{position:fixed;bottom:24px;right:24px;z-index:2000;background:${C.bgCard};border:1px solid ${C.border};color:${C.t1};padding:10px 16px;border-radius:10px;font-family:${F.mono};font-size:11px;box-shadow:0 6px 28px rgba(0,0,0,.5);animation:slideUp .2s ease;display:flex;align-items:center;gap:8px}
@keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

/* ── Radar blink ── */
@keyframes radarBlink{0%,100%{opacity:1}50%{opacity:.4}}
.radar-risk{animation:radarBlink 1.2s ease infinite}
`;

/* ═══════════════════════ HIGHLIGHT HELPER ═══════════════════ */
function Highlight({ text, query }) {
  if (!query || !text) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return <>
    {text.slice(0, idx)}
    <span className="hl">{text.slice(idx, idx + query.length)}</span>
    {text.slice(idx + query.length)}
  </>;
}

/* ═══════════════════════ GUEST PHOTO ════════════════════════ */
function GPhoto({ src, name, size = 38 }) {
  const [err, setErr] = useState(false);
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["#1B3A5C","#2A4A2A","#4A2A2A","#2A2A4A","#3A3A1A","#1A3A3A"];
  const bg = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className="g-photo" style={{ width: size, height: size, borderRadius: size * 0.24 }}>
      {!err
        ? <img src={src} alt={name} onError={() => setErr(true)} />
        : <div className="g-photo-init" style={{ background: bg, fontSize: size * 0.38 }}>{initials}</div>
      }
    </div>
  );
}

/* ═══════════════════════ RESULT ITEMS ════════════════════════ */
function GuestResult({ guest, active, query, onClick }) {
  const tier = TIERS[guest.tier] || TIERS.Member;
  const status = STATUS_COLORS[guest.status] || STATUS_COLORS["Checked Out"];
  const radar = RADAR[guest.radar] || RADAR.safe;
  const sc = scoreColor(guest.score);
  const isVIP = ["Platinum","Elite"].includes(guest.tier);

  return (
    <div className={`g-card${active ? " active" : ""}`} onClick={onClick}>
      <GPhoto src={guest.photo || ""} name={guest.name} size={38} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="g-name">
          {isVIP && <span style={{ color: C.gold, fontSize: 11 }}>⭐</span>}
          <Highlight text={guest.name} query={query} />
          <span style={{ fontFamily: F.mono, fontSize: 8, color: radar.color, letterSpacing: ".04em" }}
            className={guest.radar === "risk" ? "radar-risk" : ""}>
            {radar.icon}
          </span>
        </div>
        <div className="g-sub">
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span className="status-dot" style={{ background: status.color }} />
            {guest.status}
          </span>
          <span style={{ color: C.t4 }}>{guest.nationality}</span>
          <span style={{ color: C.t4 }}><Highlight text={guest.company} query={query} /></span>
        </div>
      </div>
      <div className="g-right">
        <span className="tier-badge" style={{ background: tier.bg, color: tier.color, border: `1px solid ${tier.border}` }}>
          {guest.tier.toUpperCase()}
        </span>
        {guest.room !== "—" && (
          <span className="room-badge">Rm {guest.room}</span>
        )}
        <div className="score-mini">
          <div className="score-bar">
            <div className="score-fill" style={{ width: `${guest.score}%`, background: sc }} />
          </div>
          <span style={{ fontFamily: F.mono, fontSize: 9, color: sc, fontWeight: 700 }}>{guest.score}</span>
        </div>
      </div>
    </div>
  );
}

function ReservationResult({ res, active, query, onClick }) {
  const statusColors = { "Confirmed": C.green, "In-House": C.teal, "Arriving": C.blue, "Checked Out": C.t4, "Reserved": C.purple };
  const col = statusColors[res.status] || C.t3;
  return (
    <div className={`r-card${active ? " active" : ""}`} onClick={onClick}>
      <div className="r-icon">📋</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="r-id"><Highlight text={res.id} query={query} /></div>
        <div className="r-meta">
          <span><Highlight text={res.guest} query={query} /></span>
          <span style={{ color: C.t4 }}>Rm <Highlight text={res.room} query={query} /></span>
          <span style={{ color: C.t4 }}>{res.checkIn} → {res.checkOut}</span>
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontFamily: F.mono, fontSize: 8.5, fontWeight: 700, color: col, letterSpacing: ".07em" }}>{res.status.toUpperCase()}</div>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.gold, marginTop: 3, fontWeight: 600 }}>{res.amount}</div>
      </div>
    </div>
  );
}

function RoomResult({ room, active, query, onClick }) {
  const statusColors = {
    "Available": C.green, "Occupied": C.amber, "Dirty": C.red,
    "Cleaning": C.blue, "Reserved": C.purple, "Maintenance": C.red,
  };
  const col = statusColors[room.status] || C.t3;
  const icons = { "Available":"✅","Occupied":"🔴","Dirty":"🟡","Cleaning":"🧹","Reserved":"📅","Maintenance":"🔧" };
  return (
    <div className={`rm-card${active ? " active" : ""}`} onClick={onClick}>
      <div className="rm-icon" style={{ background: `${col}18`, border: `1px solid ${col}40` }}>
        {icons[room.status] || "🏨"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="rm-num"><Highlight text={room.number} query={query} /></span>
          <span style={{ fontFamily: F.mono, fontSize: 8.5, fontWeight: 700, color: col, letterSpacing: ".07em" }}>{room.status.toUpperCase()}</span>
        </div>
        <div style={{ fontSize: 11, color: C.t3, marginTop: 2, display: "flex", gap: 8 }}>
          <span>{room.type}</span>
          <span style={{ color: C.t4 }}>Floor {room.floor}</span>
          {room.lastGuest && <span style={{ color: C.t4 }}>Last: <Highlight text={room.lastGuest} query={query} /></span>}
        </div>
      </div>
      <div style={{ fontFamily: F.mono, fontSize: 10.5, color: C.gold, fontWeight: 600, flexShrink: 0 }}>{room.rate}</div>
    </div>
  );
}

/* ═══════════════════════ MAIN APP ═══════════════════════════ */
export default function UniversalSearch() {
  const [open, setOpen]         = useState(false);
  const [query, setQuery]       = useState("");
  const [cursor, setCursor]     = useState(-1);
  const [toast, setToast]       = useState(null);
  const inputRef = useRef(null);
const [results, setResults] = useState({guests: [],reservations: [],rooms: []});
const [loading, setLoading] = useState(false);
  // Ctrl+K to open
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") { setOpen(false); setQuery(""); setCursor(-1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  

  useEffect(() => {
  if (!query.trim()) {
    setResults({ guests: [], reservations: [], rooms: [] });
    return;
  }

  const timeout = setTimeout(async () => {
    try {
      setLoading(true);

      const data = await searchFromBackend(query); // ✅ use function

      setResults(data);
    } catch (err) {
      console.error("API Error:", err);
      setResults({ guests: [], reservations: [], rooms: [] });
    } finally {
      setLoading(false);
    }
  }, 300);

  return () => clearTimeout(timeout);
}, [query]);
  const totalResults = results.guests.length + results.reservations.length + results.rooms.length;

  // Flat nav list for keyboard
  const flatItems = useMemo(() => [
    ...results.guests.map((g, i) => ({ type: "guest", data: g, idx: i })),
    ...results.reservations.map((r, i) => ({ type: "res", data: r, idx: i })),
    ...results.rooms.map((r, i) => ({ type: "room", data: r, idx: i })),
  ], [results]);

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setCursor(c => Math.min(c + 1, flatItems.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setCursor(c => Math.max(c - 1, -1)); }
      if (e.key === "Enter" && cursor >= 0 && flatItems[cursor]) {
        handleSelect(flatItems[cursor]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, cursor, flatItems]);

  const fireToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const handleSelect = (item) => {
    setOpen(false);
    setQuery("");
    setCursor(-1);
    if (item.type === "guest") fireToast(`Opening Guest 360° — ${item.data.name}`);
    if (item.type === "res")   fireToast(`Opening Reservation ${item.data.id}`);
    if (item.type === "room")  fireToast(`Opening Room ${item.data.number} detail`);
  };

  const SUGGESTIONS = [
    { label: "Rahul Sharma",    icon: "👤" },
    { label: "Room 204",        icon: "🏨" },
    { label: "RES-48321",       icon: "📋" },
    { label: "+91 97001 22456", icon: "📞" },
    { label: "Platinum guests", icon: "⭐" },
    { label: "Arriving today",  icon: "🛬" },
  ];

  const hasResults = totalResults > 0;
  const isEmpty = query.trim() !== "" && !hasResults;

  return (
    <>
      <style>{CSS}</style>
      <div className="shell">

        {/* ── Topbar ── */}
        <header className="topbar">
          <div className="tb-logo">A</div>
          <div className="tb-hotel">The Grand Aurum</div>
          <div className="tb-sep" />
          <nav className="tb-crumb">
            <span style={{ color: C.t4 }}>Dashboard</span>
            <span style={{ color: C.border }}>›</span>
            <span className="cur">Unified Search</span>
          </nav>

          {/* Inline search trigger in topbar */}
          <div style={{ flex: 1, maxWidth: 360, margin: "0 16px" }}>
            <div
              onClick={() => setOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 13px", background: C.bgM, border: `1px solid ${C.border}`, borderRadius: 9, cursor: "pointer", transition: "all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderL; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}>
              <span style={{ fontSize: 13, opacity: .5 }}>🔍</span>
              <span style={{ fontFamily: F.mono, fontSize: 11, color: C.t4, flex: 1 }}>Search guest, room, reservation…</span>
              <div style={{ display: "flex", gap: 3 }}>
                <span className="kbd">Ctrl</span>
                <span className="kbd">K</span>
              </div>
            </div>
          </div>

          <div className="tb-right">
            <button className="tbtn tbtn-ghost" onClick={() => setOpen(true)}>🔍 Search</button>
            <button className="tbtn tbtn-gold" onClick={() => fireToast("Opening guest list…")}>Guest List</button>
          </div>
        </header>

        {/* ── Demo Background ── */}
        <div className="demo-bg">
          <div className="demo-hint">
            <div style={{ fontFamily: F.serif, fontSize: 32, fontWeight: 700, color: C.t2, letterSpacing: ".02em" }}>
              Unified Guest Search Engine
            </div>
            <div style={{ fontFamily: F.mono, fontSize: 11, color: C.t4, letterSpacing: ".08em", marginTop: 4 }}>
              SEARCH ACROSS GUESTS · RESERVATIONS · ROOMS FROM ANYWHERE
            </div>
          </div>

          <button
            className="demo-shortcut"
            onClick={() => setOpen(true)}
            style={{ cursor: "pointer", background: C.bgCard, border: `1px solid ${C.borderL}`, borderRadius: 12, padding: "14px 24px" }}>
            <span style={{ fontSize: 18, opacity: .5 }}>🔍</span>
            <span style={{ flex: 1, textAlign: "left", color: C.t4 }}>Search guest, phone, reservation, room…</span>
            <div style={{ display: "flex", gap: 4 }}>
              <span className="kbd">Ctrl</span>
              <span className="kbd">K</span>
            </div>
          </button>

          <div className="demo-grid">
            {[
              { icon: "👤", title: "Guest List",   sub: "20 in-house",  color: C.gold   },
              { icon: "📋", title: "Reservations", sub: "8 today",      color: C.blue   },
              { icon: "🏨", title: "Room Status",  sub: "13 rooms",     color: C.teal   },
              { icon: "⚡", title: "Task Queue",   sub: "6 critical",   color: C.red    },
            ].map(card => (
              <div key={card.title} className="demo-card" onClick={() => setOpen(true)}>
                <div className="demo-card-icon">{card.icon}</div>
                <div className="demo-card-title" style={{ color: card.color }}>{card.title}</div>
                <div className="demo-card-sub">{card.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 14, font: `11px ${F.mono}`, color: C.t4 }}>
            <span>↑↓ Navigate</span>
            <span>↵ Open</span>
            <span>Esc Close</span>
            <span>Ctrl+K Open search</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════ SEARCH OVERLAY ══════════════════════ */}
      {open && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && (setOpen(false), setQuery(""), setCursor(-1))}>
          <div className="modal">

            {/* Input row */}
            <div className="search-row">
              <div className="search-icon-wrap">
                <span style={{ opacity: query ? 1 : .45 }}>🔍</span>
              </div>
              <input
                ref={inputRef}
                className="search-input"
                placeholder="Search guest, phone, email, passport, room, reservation…"
                value={query}
                onChange={e => { setQuery(e.target.value); setCursor(-1); }}
                autoComplete="off"
              />
              {query
                ? <button className="clear-btn" onClick={() => { setQuery(""); setCursor(-1); inputRef.current?.focus(); }}>✕</button>
                : <div className="search-kbd"><span className="kbd">Esc</span> to close</div>
              }
            </div>

            {/* Body */}
            <div className="search-body">

              {/* ── No query: show suggestions ── */}
              {!query.trim() && (
                <div className="suggestions">
                  <div className="sug-hd">Quick Search</div>
                  <div className="sug-row">
                    {SUGGESTIONS.map(s => (
                      <div key={s.label} className="sug-chip"
                        onClick={() => { setQuery(s.label); inputRef.current?.focus(); }}>
                        <span>{s.icon}</span>{s.label}
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "16px 18px 4px", borderTop: `1px solid ${C.border}`, marginTop: 10 }}>
                    <div style={{ fontFamily: F.mono, fontSize: 8.5, color: C.t4, letterSpacing: ".14em", marginBottom: 10 }}>SEARCH ACCEPTS</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {[
                        { icon: "👤", label: "Guest name", ex: "Rahul Sharma" },
                        { icon: "📞", label: "Phone number", ex: "+91 98200 44321" },
                        { icon: "✉",  label: "Email address", ex: "rahul@tcs.com" },
                        { icon: "🛂", label: "Passport number", ex: "Z1234567" },
                        { icon: "📋", label: "Reservation ID", ex: "RES-48321" },
                        { icon: "🏨", label: "Room number", ex: "204" },
                      ].map(item => (
                        <div key={item.label} style={{ display: "flex", gap: 8, padding: "7px 10px", background: C.bgM, borderRadius: 9, border: `1px solid ${C.border}` }}>
                          <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                          <div>
                            <div style={{ fontSize: 11.5, fontWeight: 600, color: C.t2 }}>{item.label}</div>
                            <div style={{ fontFamily: F.mono, fontSize: 9.5, color: C.t4, marginTop: 1 }}>{item.ex}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Results ── */}
              {query.trim() && !hasResults && (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <div style={{ fontFamily: F.serif, fontSize: 20, color: C.t2, marginBottom: 6 }}>No results for "{query}"</div>
                  <div style={{ fontSize: 11.5, color: C.t4 }}>Try a different name, phone number, email, or room number</div>
                </div>
              )}

              {/* Guest results */}
              {results.guests.length > 0 && (
                <div className="section">
                  <div className="section-hd">
                    <span className="section-label">👤 Guests</span>
                    <span className="section-count">{results.guests.length}</span>
                    <div className="section-line" />
                  </div>
                  {results.guests.map((g, i) => {
                    const flatIdx = i;
                    return (
                      <GuestResult key={g.id} guest={g} query={query}
                        active={cursor === flatIdx}
                        onClick={() => handleSelect({ type: "guest", data: g })} />
                    );
                  })}
                </div>
              )}

              {/* Reservation results */}
              {results.reservations.length > 0 && (
                <div className="section" style={{ borderTop: results.guests.length ? `1px solid ${C.border}` : "none" }}>
                  <div className="section-hd">
                    <span className="section-label">📋 Reservations</span>
                    <span className="section-count">{results.reservations.length}</span>
                    <div className="section-line" />
                  </div>
                  {results.reservations.map((r, i) => {
                    const flatIdx = results.guests.length + i;
                    return (
                      <ReservationResult key={r.id} res={r} query={query}
                        active={cursor === flatIdx}
                        onClick={() => handleSelect({ type: "res", data: r })} />
                    );
                  })}
                </div>
              )}

              {/* Room results */}
              {results.rooms.length > 0 && (
                <div className="section" style={{ borderTop: (results.guests.length || results.reservations.length) ? `1px solid ${C.border}` : "none" }}>
                  <div className="section-hd">
                    <span className="section-label">🏨 Rooms</span>
                    <span className="section-count">{results.rooms.length}</span>
                    <div className="section-line" />
                  </div>
                  {results.rooms.map((r, i) => {
                    const flatIdx = results.guests.length + results.reservations.length + i;
                    return (
                      <RoomResult key={r.number} room={r} query={query}
                        active={cursor === flatIdx}
                        onClick={() => handleSelect({ type: "room", data: r })} />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <span className="footer-key"><span className="kbd">↑↓</span> navigate</span>
              <div className="footer-sep" />
              <span className="footer-key"><span className="kbd">↵</span> open</span>
              <div className="footer-sep" />
              <span className="footer-key"><span className="kbd">Esc</span> close</span>
              {query && hasResults && (
                <>
                  <div className="footer-sep" />
                  <span className="result-count">{totalResults} result{totalResults !== 1 ? "s" : ""} · fuzzy match enabled</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      
      {toast && (
        <div className="toast">
          <span style={{ color: C.gold }}>✦</span> {toast}
        </div>
      )}
    </>
  );
}
