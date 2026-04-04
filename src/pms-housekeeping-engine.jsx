import { useState, useEffect } from "react";

/* ══════════════════════════════════════════════════════════════════
   SMART HOUSEKEEPING PRIORITY ENGINE
   Design: Operational command-centre · Dark slate + neon priority
   The priority score rings and live countdown timers are the hero.
   Three modes: Supervisor Board · Staff Mobile · Command Alert
══════════════════════════════════════════════════════════════════ */

/* ── DESIGN TOKENS ─────────────────────────────────────────── */
const T = {
  /* Backgrounds */
  void:      "#090E15",
  base:      "#0C1220",
  panel:     "#101828",
  card:      "#141E2E",
  cardHover: "#18243A",
  line:      "#1E2D44",
  lineSoft:  "#162034",

  /* Text */
  hi:        "#E8EEF8",
  mid:       "#8BA0BA",
  soft:      "#4E6580",
  faint:     "#283A52",

  /* Brand */
  gold:      "#C89018",
  goldPale:  "#1E1A0A",
  goldLine:  "#8A6010",

  /* Priority colours */
  red:       "#E83040",
  redGlow:   "rgba(232,48,64,.18)",
  redPale:   "#1A0810",
  redLine:   "#6A1820",

  amber:     "#E87820",
  amberGlow: "rgba(232,120,32,.15)",
  amberPale: "#1A1008",
  amberLine: "#8A4010",

  green:     "#28C878",
  greenGlow: "rgba(40,200,120,.13)",
  greenPale: "#081A10",
  greenLine: "#186840",

  blue:      "#3888E8",
  bluePale:  "#080E1A",
  blueLine:  "#184878",

  purple:    "#9858E8",
  purpPale:  "#100818",
  purpLine:  "#501880",
};

const FD = "'Share Tech Mono', 'Courier New', monospace";   /* display / numbers */
const FS = "'DM Sans', system-ui, sans-serif";              /* body labels */
const FM = "'DM Mono', 'Courier New', monospace";           /* mono labels */

/* ── STAFF DATA ─────────────────────────────────────────── */


/* ── ROOM DATA ─────────────────────────────────────────── */


/* ── PRIORITY ENGINE ─────────────────────────────────────── */
function calcScore(room) {
  if (room.status === "Ready") return 0;
  if (room.status === "Occupied") return 0;

  let score = 0;

  // Arrival priority
  if (room.arrivalMin !== null && room.arrivalMin !== undefined) {
    if (room.arrivalMin < 60) score += 55;
    else if (room.arrivalMin < 180) score += 35;
    else score += 15;
  }

  // VIP
  if (room.vip) score += 25;

  // Checkout delay (REAL TIME)
  if (room.checkout) {
    const [h, m] = room.checkout.split(":").map(Number);

    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const checkoutMin = h * 60 + m;

    const minAgo = nowMin - checkoutMin;

    if (minAgo > 60) score += 15;
    else if (minAgo > 0) score += 10;
  }

  // Progress reduction
  if (room.progress > 0) {
    score = Math.round(score * (1 - room.progress / 100));
  }

  return Math.min(100, Math.max(0, score));
}

function urgency(room) {
  const s = calcScore(room);
  if (s >= 70) return "high";
  if (s >= 40) return "medium";
  if (s > 0)   return "low";
  return "none";
}

function urgencyColor(u) {
  return { high:T.red, medium:T.amber, low:T.green, none:T.soft }[u] || T.soft;
}
function urgencyGlow(u) {
  return { high:T.redGlow, medium:T.amberGlow, low:T.greenGlow, none:"transparent" }[u];
}
function urgencyLabel(u) {
  return { high:"CRITICAL", medium:"MODERATE", low:"STANDARD", none:"—" }[u] || "—";
}

function fmtETA(min) {
  if (min === null) return "No arrival";
  if (min < 60)     return `${min}m`;
  return `${Math.floor(min/60)}h ${min%60}m`;
}

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

/* ── PRIORITY RING ───────────────────────────────────────── */
function ScoreRing({ score, size=64, u }) {
  const r = (size/2) - 5;
  const circ = 2 * Math.PI * r;
  const dash  = circ - (score/100)*circ;
  const col   = urgencyColor(u);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.faint} strokeWidth="3.5"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={col} strokeWidth="3.5"
        strokeDasharray={circ} strokeDashoffset={dash}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{filter:`drop-shadow(0 0 4px ${col})`, transition:"stroke-dashoffset .6s cubic-bezier(.4,0,.2,1)"}}
      />
      <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle"
        fontSize={size===64?16:12} fontFamily={FD} fontWeight="700"
        fill={score>0?col:T.soft}>{score>0?score:"—"}</text>
    </svg>
  );
}

/* ── COUNTDOWN TIMER ─────────────────────────────────────── */
function Countdown({ minutes, urgent }) {
  const [min, setMin] = useState(minutes ?? 0);
  useEffect(()=>{
    if (minutes === null) return;
    const id = setInterval(()=>setMin(m=>m>0?m-1:0),60000);
    return ()=>clearInterval(id);
  },[]);
  if (minutes === null) return <span style={{fontSize:10,fontFamily:FM,color:T.soft}}>No arrival</span>;
  const col = min<60?T.red:min<180?T.amber:T.green;
  return (
    <div style={{display:"flex",alignItems:"center",gap:5}}>
      {min < 60 && <div style={{width:5,height:5,borderRadius:"50%",background:T.red,animation:"blink 1s ease-in-out infinite",flexShrink:0}}/>}
      <span style={{fontSize:12,fontFamily:FD,color:col,fontWeight:700}}>
        {fmtETA(min)}
      </span>
    </div>
  );
}

/* ── PROGRESS BAR ────────────────────────────────────────── */
function CleanBar({ pct, color }) {
  return (
    <div style={{height:3,background:T.faint,borderRadius:3,overflow:"hidden",width:"100%"}}>
      <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:3,transition:"width .5s",boxShadow:`0 0 6px ${color}`}}/>
    </div>
  );
}

/* ── STATUS CHIP ─────────────────────────────────────────── */
function StatusChip({ status }) {
  if (!status) status = "Unknown";   // ✅ FIX

  const cfg = {
    Dirty: [T.red, T.redPale, T.redLine],
    Cleaning: [T.amber, T.amberPale, T.amberLine],
    Inspecting: [T.blue, T.bluePale, T.blueLine],
    Ready: [T.green, T.greenPale, T.greenLine],
    Occupied: [T.soft, T.lineSoft, T.faint],
    Unknown: [T.soft, T.lineSoft, T.faint]
  };

  const [c, bg, b] = cfg[status] || cfg["Unknown"];

  return (
    <span style={{
      fontSize:9,fontFamily:FM,fontWeight:600,padding:"3px 9px",
      borderRadius:20,background:bg,color:c,border:`1px solid ${b}`
    }}>
      {status.toUpperCase()}
    </span>
  );
}
/* ── TAG CHIP ────────────────────────────────────────────── */
function TagChip({ label }) {
  if (!label) return null;
  const cfg={VIP:[T.gold,T.goldPale,T.goldLine],OTA:[T.blue,T.bluePale,T.blueLine],CORP:[T.purple,T.purpPale,T.purpLine],GROUP:[T.green,T.greenPale,T.greenLine]};
  const [c,bg,b]=cfg[label]||[T.mid,T.card,T.line];
  return <span style={{fontSize:8,fontFamily:FM,fontWeight:700,padding:"2px 8px",borderRadius:20,background:bg,color:c,border:`1px solid ${b}`,letterSpacing:".1em"}}>{label}</span>;
}

/* ── ALERT BANNER ────────────────────────────────────────── */
function AlertBanner({ rooms }) {
  const crits = rooms.filter(r=>r.status==="Dirty"&&r.arrivalMin!==null&&r.arrivalMin<60);
  if (!crits.length) return null;
  return (
    <div style={{background:T.redPale,border:`1px solid ${T.redLine}`,borderLeft:`3px solid ${T.red}`,
      borderRadius:8,padding:"10px 16px",display:"flex",alignItems:"center",gap:12,animation:"alertPulse 2s ease-in-out infinite"}}>
      <div style={{width:8,height:8,borderRadius:"50%",background:T.red,flexShrink:0,animation:"blink 1s ease-in-out infinite"}}/>
      <div style={{flex:1}}>
        <span style={{fontSize:11,fontFamily:FM,color:T.red,letterSpacing:".08em",fontWeight:700}}>
          ⚠ URGENT — {crits.length} room{crits.length>1?"s":""} critical:{" "}
        </span>
        <span style={{fontSize:11,fontFamily:FM,color:T.red,opacity:.8}}>
          {crits.map(r=>`Rm ${r.id} (guest in ${fmtETA(r.arrivalMin)})`).join(" · ")}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUPERVISOR BOARD — main panel
═══════════════════════════════════════════════════════════ */
function SupervisorBoard({ rooms, setRooms, onToast, fetchRooms, unassign , staff}) {
  const [filter, setFilter] = useState("all");
  const [assigning, setAssigning] = useState(null); // room id being assigned
  const [view, setView] = useState("board"); // board | algorithm

  const sorted = [...rooms]
    .map(r=>({...r,score:calcScore(r),u:urgency(r)}))
    .sort((a,b)=>b.score-a.score);

  const filtered = filter==="all" ? sorted
    : filter==="critical" ? sorted.filter(r=>r.u==="high")
    : filter==="active"   ? sorted.filter(r=>r.assignee)
    : sorted.filter(r=>r.status===filter);

  async function updateProgress(id, delta) {
    setRooms(rs=>rs.map(r=>{
      if(r.id!==id) return r;
      const np=Math.min(100,Math.max(0,(r.progress||0)+delta));
      const ns=np>=100?"Ready":np>0?"Cleaning":r.status;
      return {...r,progress:np,status:ns};
    }));
  }

 async function assign(roomId, staffId) {
  try {
    const res = await fetch("http://localhost:5000/assign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        room_id: roomId,
        staff_id: staffId
      })
    });

    const data = await res.json();
    console.log("Assign response:", data);

    fetchRooms();
  } catch (err) {
    console.error("Assign error:", err);
  }


  // Refresh rooms
  fetchRooms();
}
  const critCount=sorted.filter(r=>r.u==="high").length;
  const medCount =sorted.filter(r=>r.u==="medium").length;
  const readyCount=sorted.filter(r=>r.status==="Ready").length;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:0,height:"100%",overflow:"hidden"}}>

      {/* Sub-header */}
      <div style={{padding:"14px 24px",borderBottom:`1px solid ${T.line}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",gap:24}}>
          {[
            {label:"Critical", n:critCount,  c:T.red   },
            {label:"Moderate", n:medCount,   c:T.amber },
            {label:"Ready",    n:readyCount, c:T.green },
            {label:"staff",    n:staff.filter(s=>s.status==="Active").length, c:T.blue},
          ].map(s=>(
            <div key={s.label} style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontFamily:FD,fontSize:22,color:s.c,lineHeight:1,textShadow:`0 0 12px ${s.c}44`}}>{s.n}</span>
              <span style={{fontSize:9.5,fontFamily:FM,color:T.soft,letterSpacing:".1em"}}>{s.label.toUpperCase()}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:6}}>
          {[["board","Board"],["algorithm","Engine"]].map(([k,v])=>(
            <button key={k} onClick={()=>setView(k)} style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${view===k?T.gold:T.line}`,background:view===k?T.goldPale:"transparent",color:view===k?T.gold:T.soft,fontFamily:FM,fontSize:10,cursor:"pointer",letterSpacing:".07em",transition:"all .2s"}}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div style={{padding:"10px 24px",borderBottom:`1px solid ${T.lineSoft}`,display:"flex",gap:6,flexShrink:0}}>
        {[["all","All Rooms"],["critical","Critical"],["Dirty","Dirty"],["Cleaning","Cleaning"],["Ready","Ready"],["active","Assigned"]].map(([k,v])=>(
          <button key={k} onClick={()=>setFilter(k)} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${filter===k?T.gold:T.line}`,background:filter===k?T.goldPale:"transparent",color:filter===k?T.gold:T.soft,fontFamily:FM,fontSize:9.5,cursor:"pointer",letterSpacing:".07em",transition:"all .15s",flexShrink:0}}>
            {v}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>

        {/* ALGORITHM VIEW */}
        {view==="algorithm" && (
          <div style={{animation:"fadeIn .3s ease",display:"flex",flexDirection:"column",gap:16}}>
            <div style={{background:T.card,border:`1px solid ${T.line}`,borderRadius:12,padding:20}}>
              <div style={{fontSize:10,fontFamily:FM,color:T.gold,letterSpacing:".14em",marginBottom:14}}>PRIORITY FORMULA</div>
              <pre style={{fontSize:12,fontFamily:FM,color:T.mid,lineHeight:2.2,background:T.panel,padding:16,borderRadius:8,border:`1px solid ${T.lineSoft}`,overflowX:"auto"}}>
{`Priority Score =
  Arrival ETA Score   ( 0 – 55 pts )
    if ETA < 60 min   → 55 pts  (CRITICAL)
    if ETA < 3 hrs    → 35 pts  (MODERATE)
    if ETA < 8 hrs    → 15 pts  (STANDARD)
    if no arrival     →  0 pts

+ VIP Bonus           ( 0 – 25 pts )
    if VIP guest      → +25 pts

+ Checkout Delay      ( 0 – 15 pts )
    if checkout > 1hr ago → +15 pts
    if checkout recent    → +10 pts

÷ Cleaning Progress   ( reduces score )
    Score × (1 – progress%)

= Final Score         ( 0 – 100 )
    ≥ 70  → CRITICAL  🔴
    ≥ 40  → MODERATE  🟠
    > 0   → STANDARD  🟢`}</pre>
            </div>

            {/* Live score table */}
            <div style={{background:T.card,border:`1px solid ${T.line}`,borderRadius:12,padding:20}}>
              <div style={{fontSize:10,fontFamily:FM,color:T.gold,letterSpacing:".14em",marginBottom:14}}>LIVE SCORE BREAKDOWN</div>
              <div style={{display:"grid",gridTemplateColumns:"60px 1fr 60px 60px 60px 70px",gap:0}}>
                {["Room","Guest","ETA","VIP","Delay","SCORE"].map(h=>(
                  <div key={h} style={{fontSize:9,fontFamily:FM,color:T.soft,letterSpacing:".1em",padding:"6px 8px",borderBottom:`1px solid ${T.line}`}}>{h}</div>
                ))}
                {sorted.filter(r=>r.status!=="Occupied").map(r=>{
                  const u2=urgency(r);
                  const etaPts=r.arrivalMin===null?0:r.arrivalMin<60?55:r.arrivalMin<180?35:15;
                  const vipPts=r.vip?25:0;
                  const delayPts=r.checkout?10:0;
                  return[
                    <div key={r.id+"r"} style={{fontSize:13,fontFamily:FD,color:urgencyColor(u2),padding:"9px 8px",borderBottom:`1px solid ${T.lineSoft}`}}>
                      {r.id}
                    </div>,
                    <div key={r.id+"g"} style={{fontSize:11,fontFamily:FS,color:T.mid,padding:"9px 8px",borderBottom:`1px solid ${T.lineSoft}`,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {r.guest}
                    </div>,
                    <div key={r.id+"e"} style={{fontSize:11,fontFamily:FD,color:T.blue,padding:"9px 8px",borderBottom:`1px solid ${T.lineSoft}`}}>{etaPts}</div>,
                    <div key={r.id+"v"} style={{fontSize:11,fontFamily:FD,color:r.vip?T.gold:T.faint,padding:"9px 8px",borderBottom:`1px solid ${T.lineSoft}`}}>{vipPts}</div>,
                    <div key={r.id+"d"} style={{fontSize:11,fontFamily:FD,color:T.mid,padding:"9px 8px",borderBottom:`1px solid ${T.lineSoft}`}}>{delayPts}</div>,
                    <div key={r.id+"s"} style={{padding:"9px 8px",borderBottom:`1px solid ${T.lineSoft}`}}>
                      <span style={{fontSize:13,fontFamily:FD,fontWeight:700,color:urgencyColor(u2),textShadow:`0 0 8px ${urgencyColor(u2)}44`}}>{r.score}</span>
                    </div>
                  ];
                })}
              </div>
            </div>
          </div>
        )}

        {/* BOARD VIEW */}
        {view==="board" && (
          <div style={{display:"flex",flexDirection:"column",gap:12,animation:"fadeIn .25s ease"}}>
            {filtered.map((room,idx)=>{
              const u=room.u;
              const col=urgencyColor(u);
              const glow=urgencyGlow(u);
              const assignedStaff=staff.find(s=>s.id===room.assignee);
              const etaUrgent=room.arrivalMin!==null&&room.arrivalMin<60;

              return(
                <div key={room.id} style={{
                  background:T.card,border:`1px solid ${u==="high"?T.redLine:u==="medium"?T.amberLine:T.line}`,
                  borderLeft:`3px solid ${col}`,
                  borderRadius:12,overflow:"hidden",
                  boxShadow:u!=="none"?`0 2px 20px ${glow}`:"none",
                  transition:"all .2s",
                  animation:`fadeIn .3s ease ${idx*40}ms both`,
                }}>

                  {/* Card header */}
                  <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderBottom:room.progress>0?`1px solid ${T.lineSoft}`:"none"}}>

                    {/* Score ring */}
                    <ScoreRing score={room.score} u={u}/>

                    {/* Room info */}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                        <span style={{fontFamily:FD,fontSize:22,color:col,letterSpacing:".02em",textShadow:u!=="none"?`0 0 16px ${col}44`:"none"}}>
                          {room.id}
                        </span>
                        <span style={{fontSize:11,fontFamily:FS,color:T.mid}}>{room.type}</span>
                        <TagChip label={room.tag}/>
                        {room.vip&&<span style={{fontSize:9,fontFamily:FM,color:T.gold,background:T.goldPale,border:`1px solid ${T.goldLine}`,padding:"2px 7px",borderRadius:20,letterSpacing:".09em"}}>VIP</span>}
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                        <StatusChip status={room.status}/>
                        {room.arrivalMin!==null&&(
                          <div style={{display:"flex",alignItems:"center",gap:5}}>
                            <span style={{fontSize:9,fontFamily:FM,color:T.soft,letterSpacing:".08em"}}>ETA</span>
                            <Countdown minutes={room.arrivalMin} urgent={etaUrgent}/>
                          </div>
                        )}
                        {room.checkout&&<span style={{fontSize:10,fontFamily:FM,color:T.soft,letterSpacing:".06em"}}>CO {room.checkout}</span>}
                        {room.cleanEst>0&&room.status!=="Ready"&&<span style={{fontSize:10,fontFamily:FM,color:T.soft}}>~{room.cleanEst}m clean</span>}
                      </div>
                    </div>

                    {/* Right side actions */}
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8,flexShrink:0}}>
                      <div style={{fontSize:10,fontFamily:FM,color:col,letterSpacing:".12em",fontWeight:700}}>
                        {urgencyLabel(u)}
                      </div>

                      {room.status!=="Occupied"&&room.status!=="Ready"&&(
                        assigning===room.id ? (
                          <div style={{display:"flex",flexDirection:"column",gap:4,background:T.panel,border:`1px solid ${T.line}`,borderRadius:8,padding:"8px 10px",minWidth:160}}>
                            <div style={{fontSize:9,fontFamily:FM,color:T.gold,letterSpacing:".1em",marginBottom:4}}>ASSIGN TO</div>
                            {staff.map(s=>(
                              <button key={s.id} onClick={()=>assign(room.id,s.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 8px",borderRadius:6,border:"none",background:T.card,cursor:"pointer",transition:"background .15s",textAlign:"left"}}
                                onMouseEnter={e=>e.currentTarget.style.background=T.cardHover}
                                onMouseLeave={e=>e.currentTarget.style.background=T.card}>
                                <div style={{width:6,height:6,borderRadius:"50%",background:s.status==="Free"?T.green:s.status==="Break"?T.amber:T.blue,flexShrink:0}}/>
                                <span style={{fontSize:11,fontFamily:FS,color:T.hi}}>{s.name}</span>
                                <span style={{fontSize:9,fontFamily:FM,color:T.soft,marginLeft:"auto"}}>{s.tasks}t</span>
                              </button>
                            ))}
                            <button onClick={()=>setAssigning(null)} style={{fontSize:9,fontFamily:FM,color:T.soft,background:"none",border:"none",cursor:"pointer",textAlign:"center",padding:"4px",letterSpacing:".07em"}}>CANCEL</button>
                          </div>
                        ) : (
                          <div style={{display:"flex",gap:6}}>
                            {assignedStaff&&(
                              <div style={{display:"flex",alignItems:"center",gap:6,background:T.bluePale,border:`1px solid ${T.blueLine}`,borderRadius:20,padding:"4px 10px"}}>
                                <div style={{width:5,height:5,borderRadius:"50%",background:T.blue}}/>
                                <span style={{fontSize:10,fontFamily:FM,color:T.blue,letterSpacing:".06em"}}>{assignedStaff.name.split(" ")[0]}</span>
                                <button onClick={()=>unassign(room.id)} style={{background:"none",border:"none",cursor:"pointer",color:T.soft,fontSize:10,padding:0,lineHeight:1}}>✕</button>
                              </div>
                            )}
                            <button onClick={()=>setAssigning(room.id)} style={{padding:"5px 14px",background:T.panel,border:`1px solid ${T.line}`,borderRadius:20,fontFamily:FM,fontSize:10,color:assignedStaff?T.mid:T.gold,cursor:"pointer",letterSpacing:".08em",transition:"all .15s"}}
                              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.gold;e.currentTarget.style.color=T.gold;}}
                              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.line;e.currentTarget.style.color=assignedStaff?T.mid:T.gold;}}>
                              {assignedStaff?"REASSIGN":"ASSIGN"}
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Progress bar (if in progress) */}
                  {room.progress>0&&room.status!=="Ready"&&(
                    <div style={{padding:"10px 18px 12px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                        <span style={{fontSize:9,fontFamily:FM,color:T.soft,letterSpacing:".1em"}}>CLEANING PROGRESS</span>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:11,fontFamily:FD,color:T.amber}}>{room.progress}%</span>
                          <button onClick={()=>updateProgress(room.id,15)} style={{fontSize:9,fontFamily:FM,color:T.green,background:T.greenPale,border:`1px solid ${T.greenLine}`,borderRadius:4,padding:"2px 8px",cursor:"pointer"}}>+15%</button>
                        </div>
                      </div>
                      <CleanBar pct={room.progress} color={T.amber}/>
                      {room.arrivalMin!==null&&(
                        <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                          <span style={{fontSize:9,fontFamily:FM,color:T.soft}}>Est. clean: {Math.round(room.cleanEst*(1-room.progress/100))}m left</span>
                          {room.arrivalMin<room.cleanEst*(1-room.progress/100)&&(
                            <span style={{fontSize:9,fontFamily:FM,color:T.red,animation:"blink 1.5s infinite"}}>⚠ WILL NOT FINISH IN TIME</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ready state */}
                  {room.status==="Ready"&&(
                    <div style={{padding:"8px 18px",background:T.greenPale,borderTop:`1px solid ${T.greenLine}`}}>
                      <span style={{fontSize:10,fontFamily:FM,color:T.green,letterSpacing:".08em"}}>✓ ROOM READY · Guest may check in</span>
                    </div>
                  )}

                  {/* Critical urgent banner */}
                  {u==="high"&&room.status!=="Ready"&&(
                    <div style={{padding:"8px 18px",background:T.redPale,borderTop:`1px solid ${T.redLine}`,display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:T.red,animation:"blink 1s infinite",flexShrink:0}}/>
                      <span style={{fontSize:10,fontFamily:FM,color:T.red,letterSpacing:".07em"}}>
                        GUEST IN {fmtETA(room.arrivalMin)} — CLEAN IMMEDIATELY
                        {!room.assignee&&" — UNASSIGNED"}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STAFF MOBILE VIEW
═══════════════════════════════════════════════════════════ */
function StaffMobileView({ rooms, setRooms, onToast }) {
  const [staffId, setStaffId] = useState("S1");
  const [completing, setCompleting] = useState(null);
  const [viewMode, setViewMode] = useState("tasks"); // tasks | completed

  const staff = staff.find(s=>s.id===staffId);
  const myTasks = rooms
    .filter(r=>r.assignee===staffId&&r.status!=="Ready"&&r.status!=="Occupied")
    .map(r=>({...r,score:calcScore(r),u:urgency(r)}))
    .sort((a,b)=>b.score-a.score);
  const myDone = rooms.filter(r=>r.assignee===staffId&&r.status==="Ready");

  async function markComplete(roomId) {
    setCompleting(roomId);
    await new Promise(r=>setTimeout(r,1200));
    setRooms(rs=>rs.map(r=>r.id===roomId?{...r,status:"Inspecting",progress:90}:r));
    setCompleting(null);
    onToast(`Room ${roomId} → Inspecting`,"ok");
  }

  async function markReady(roomId) {
    setRooms(rs=>rs.map(r=>r.id===roomId?{...r,status:"Ready",progress:100}:r));
    onToast(`Room ${roomId} → READY ✓`,"ok");
  }

  async function startCleaning(roomId) {
    setRooms(rs=>rs.map(r=>r.id===roomId?{...r,status:"Cleaning",progress:5}:r));
    onToast(`Started cleaning Rm ${roomId}`,"info");
  }

  return (
    <div style={{height:"100%",overflow:"hidden",display:"flex",flexDirection:"column"}}>
      {/* Phone chrome */}
      <div style={{flex:1,overflowY:"auto",background:T.void,display:"flex",justifyContent:"center",padding:"24px 16px"}}>
        <div style={{width:"100%",maxWidth:360,display:"flex",flexDirection:"column",gap:0}}>

          {/* Phone status bar */}
          <div style={{height:44,background:T.base,borderRadius:"24px 24px 0 0",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",border:`1px solid ${T.line}`,borderBottom:"none"}}>
            <span style={{fontSize:11,fontFamily:FM,color:T.mid}}>9:41</span>
            <div style={{width:80,height:5,background:T.card,borderRadius:4}}/>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              <div style={{width:14,height:8,borderRadius:2,border:`1px solid ${T.mid}`,position:"relative"}}><div style={{position:"absolute",inset:1,right:3,background:T.green,borderRadius:1}}/></div>
            </div>
          </div>

          {/* Phone screen */}
          <div style={{background:T.base,border:`1px solid ${T.line}`,borderTop:"none",borderRadius:"0 0 24px 24px",overflow:"hidden",paddingBottom:20}}>

            {/* App header */}
            <div style={{background:`linear-gradient(160deg,${T.panel},${T.base})`,padding:"18px 18px 14px",borderBottom:`1px solid ${T.line}`}}>
              <div style={{fontSize:9,fontFamily:FM,color:T.gold,letterSpacing:".16em",marginBottom:8}}>GRAND PALACE · HOUSEKEEPING</div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <div style={{width:36,height:36,borderRadius:10,background:T.card,border:`1px solid ${T.line}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>🧹</div>
                <div>
                  <div style={{fontSize:14,fontFamily:FS,fontWeight:600,color:T.hi}}>{staff?.name}</div>
                  <div style={{fontSize:9,fontFamily:FM,color:T.mid,letterSpacing:".07em"}}>{staff?.zone} · Floor {staff?.floor}</div>
                </div>
                <div style={{marginLeft:"auto"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:staff?.status==="Free"?T.green:staff?.status==="Break"?T.amber:T.blue,boxShadow:`0 0 8px ${staff?.status==="Free"?T.green:T.blue}`}}/>
                </div>
              </div>

              {/* Staff switcher */}
              <div style={{display:"flex",gap:5,overflowX:"auto"}}>
                {staff.map(s=>(
                  <button key={s.id} onClick={()=>setStaffId(s.id)} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${staffId===s.id?T.gold:T.line}`,background:staffId===s.id?T.goldPale:"transparent",color:staffId===s.id?T.gold:T.soft,fontSize:9,fontFamily:FM,cursor:"pointer",flexShrink:0,letterSpacing:".07em"}}>
                    {s.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Task/Done toggle */}
            <div style={{display:"flex",margin:"12px 14px 0",background:T.panel,borderRadius:8,padding:3,border:`1px solid ${T.line}`}}>
              {[["tasks",`My Tasks (${myTasks.length})`],["completed",`Done (${myDone.length})`]].map(([k,v])=>(
                <button key={k} onClick={()=>setViewMode(k)} style={{flex:1,padding:"7px 0",borderRadius:6,border:"none",fontFamily:FM,fontSize:10,letterSpacing:".07em",cursor:"pointer",transition:"all .2s",background:viewMode===k?T.card:"transparent",color:viewMode===k?T.gold:T.soft}}>
                  {v}
                </button>
              ))}
            </div>

            {/* Task list */}
            <div style={{padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}}>
              {viewMode==="tasks"&&myTasks.length===0&&(
                <div style={{textAlign:"center",padding:"32px 16px"}}>
                  <div style={{fontSize:24,marginBottom:10}}>✓</div>
                  <div style={{fontSize:12,fontFamily:FS,color:T.soft}}>No tasks assigned</div>
                </div>
              )}

              {viewMode==="tasks"&&myTasks.map((room,i)=>{
                const col=urgencyColor(room.u);
                const isCompleting=completing===room.id;
                return (
                  <div key={room.id} style={{background:T.card,border:`1px solid ${room.u==="high"?T.redLine:T.line}`,borderLeft:`3px solid ${col}`,borderRadius:12,overflow:"hidden",animation:`fadeIn .25s ease ${i*60}ms both`}}>
                    <div style={{padding:"12px 14px"}}>
                      {/* Priority badge */}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                        <div style={{display:"flex",alignItems:"center",gap:7}}>
                          <span style={{fontSize:18,fontFamily:FD,color:col,fontWeight:700,lineHeight:1}}>{room.id}</span>
                          <TagChip label={room.tag}/>
                          {room.vip&&<span style={{fontSize:8,fontFamily:FM,color:T.gold,background:T.goldPale,border:`1px solid ${T.goldLine}`,padding:"1px 6px",borderRadius:20}}>VIP</span>}
                        </div>
                        <span style={{fontSize:8.5,fontFamily:FM,color:col,letterSpacing:".1em",fontWeight:700}}>{urgencyLabel(room.u)}</span>
                      </div>

                      <div style={{fontSize:11,fontFamily:FS,color:T.mid,marginBottom:4}}>{room.type} · Floor {room.floor}</div>

                      {room.arrivalMin!==null&&(
                        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}>
                          <span style={{fontSize:9,fontFamily:FM,color:T.soft}}>GUEST ETA</span>
                          <Countdown minutes={room.arrivalMin}/>
                        </div>
                      )}

                      {room.cleanEst>0&&<div style={{fontSize:10,fontFamily:FM,color:T.soft,marginBottom:10}}>Est. {room.cleanEst} min to clean</div>}

                      {/* Progress */}
                      {room.progress>0&&(
                        <div style={{marginBottom:10}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                            <span style={{fontSize:9,fontFamily:FM,color:T.soft}}>PROGRESS</span>
                            <span style={{fontSize:10,fontFamily:FD,color:T.amber}}>{room.progress}%</span>
                          </div>
                          <CleanBar pct={room.progress} color={T.amber}/>
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{display:"flex",gap:8}}>
                        {room.status==="Dirty"&&(
                          <button onClick={()=>startCleaning(room.id)} style={{flex:1,padding:"9px 0",background:`linear-gradient(135deg,${T.navy},${T.navyMid})`,color:T.hi,border:"none",borderRadius:8,fontFamily:FM,fontSize:10,cursor:"pointer",letterSpacing:".08em"}}>START CLEANING</button>
                        )}
                        {room.status==="Cleaning"&&(
                          <button onClick={()=>markComplete(room.id)} disabled={isCompleting} style={{flex:1,padding:"9px 0",background:isCompleting?"transparent":`linear-gradient(135deg,${T.amber}22,${T.amberPale})`,color:isCompleting?T.soft:T.amber,border:`1px solid ${isCompleting?T.line:T.amberLine}`,borderRadius:8,fontFamily:FM,fontSize:10,cursor:isCompleting?"default":"pointer",letterSpacing:".08em",transition:"all .2s"}}>
                            {isCompleting?"UPDATING…":"MARK DONE →"}
                          </button>
                        )}
                        {room.status==="Inspecting"&&(
                          <button onClick={()=>markReady(room.id)} style={{flex:1,padding:"9px 0",background:`linear-gradient(135deg,${T.green}22,${T.greenPale})`,color:T.green,border:`1px solid ${T.greenLine}`,borderRadius:8,fontFamily:FM,fontSize:10,cursor:"pointer",letterSpacing:".08em"}}>
                            MARK READY ✓
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Urgent flash banner */}
                    {room.u==="high"&&(
                      <div style={{padding:"6px 14px",background:T.redPale,borderTop:`1px solid ${T.redLine}`,animation:"alertPulse 2s ease-in-out infinite"}}>
                        <span style={{fontSize:9,fontFamily:FM,color:T.red,letterSpacing:".08em"}}>⚠ CLEAN NOW — guest in {fmtETA(room.arrivalMin)}</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {viewMode==="completed"&&myDone.map(room=>(
                <div key={room.id} style={{background:T.greenPale,border:`1px solid ${T.greenLine}`,borderLeft:`3px solid ${T.green}`,borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:T.greenPale,border:`1.5px solid ${T.greenLine}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,color:T.green}}>✓</div>
                  <div>
                    <div style={{fontSize:14,fontFamily:FD,color:T.green,marginBottom:2}}>Room {room.id}</div>
                    <div style={{fontSize:10,fontFamily:FM,color:T.green,opacity:.7,letterSpacing:".06em"}}>READY · {room.type}</div>
                  </div>
                </div>
              ))}
              {viewMode==="completed"&&myDone.length===0&&(
                <div style={{textAlign:"center",padding:"32px 16px"}}>
                  <div style={{fontSize:12,fontFamily:FS,color:T.soft}}>No completed rooms yet</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMMAND CENTER INTEGRATION PANEL
═══════════════════════════════════════════════════════════ */
function CommandPanel({ rooms ,staff }) {
  const scored = rooms.map(r=>({...r,score:calcScore(r),u:urgency(r)}));
  const crits  = scored.filter(r=>r.u==="high"&&r.status!=="Ready");
  const ready  = scored.filter(r=>r.status==="Ready");
  const cleaning=scored.filter(r=>r.status==="Cleaning"||r.status==="Inspecting");
  const dirty  = scored.filter(r=>r.status==="Dirty");

  return (
    <div style={{height:"100%",overflowY:"auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:18}}>

      {/* Status grid */}
      <div>
        <div style={{fontSize:10,fontFamily:FM,color:T.gold,letterSpacing:".14em",marginBottom:12}}>ROOM STATUS OVERVIEW</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {[
            {label:"Critical",    n:crits.length,   c:T.red,   glow:T.redGlow,   icon:"🔴"},
            {label:"Cleaning",    n:cleaning.length, c:T.amber, glow:T.amberGlow, icon:"🟠"},
            {label:"Ready",       n:ready.length,    c:T.green, glow:T.greenGlow, icon:"🟢"},
            {label:"Dirty / Idle",n:dirty.length,    c:T.soft,  glow:"none",      icon:"⚫"},
          ].map(s=>(
            <div key={s.label} style={{background:T.card,border:`1px solid ${T.line}`,borderRadius:12,padding:"14px 12px",textAlign:"center",boxShadow:`0 2px 12px ${s.glow}`}}>
              <div style={{fontSize:22,marginBottom:6}}>{s.icon}</div>
              <div style={{fontFamily:FD,fontSize:26,color:s.c,lineHeight:1,textShadow:`0 0 16px ${s.c}44`,marginBottom:4}}>{s.n}</div>
              <div style={{fontSize:9,fontFamily:FM,color:T.soft,letterSpacing:".1em"}}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cleaning readiness table */}
      <div style={{background:T.card,border:`1px solid ${T.line}`,borderRadius:12,overflow:"hidden"}}>
        <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.line}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:10,fontFamily:FM,color:T.gold,letterSpacing:".14em"}}>CLEANING READINESS</span>
          <span style={{fontSize:10,fontFamily:FM,color:T.soft}}>Live · Updates every minute</span>
        </div>
        <div style={{maxHeight:280,overflowY:"auto"}}>
          {scored.filter(r=>r.status!=="Occupied").map((r,i)=>{
            const col=urgencyColor(r.u);
            return (
              <div key={r.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",borderBottom:`1px solid ${T.lineSoft}`,transition:"background .15s",animation:`fadeIn .25s ease ${i*30}ms both`}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:r.status==="Ready"?T.green:r.status==="Cleaning"?T.amber:r.status==="Inspecting"?T.blue:T.red,flexShrink:0}}/>
                <span style={{fontFamily:FD,fontSize:14,color:col,width:40,flexShrink:0}}>{r.id}</span>
                <div style={{flex:1,minWidth:0}}>
                  <StatusChip status={r.status}/>
                </div>
                {r.progress>0&&r.status!=="Ready"&&(
                  <div style={{width:60}}>
                    <CleanBar pct={r.progress} color={T.amber}/>
                    <div style={{fontSize:9,fontFamily:FD,color:T.amber,marginTop:2}}>{r.progress}%</div>
                  </div>
                )}
                {r.arrivalMin!==null&&(
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:9,fontFamily:FM,color:T.soft,letterSpacing:".07em"}}>ETA</div>
                    <Countdown minutes={r.arrivalMin}/>
                  </div>
                )}
                <div style={{flexShrink:0}}>
                  <ScoreRing score={r.score} size={36} u={r.u}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Staff roster */}
      <div style={{background:T.card,border:`1px solid ${T.line}`,borderRadius:12,overflow:"hidden"}}>
        <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.line}`}}>
          <span style={{fontSize:10,fontFamily:FM,color:T.gold,letterSpacing:".14em"}}>STAFF STATUS</span>
        </div>
        {staff.map(s=>{
          const srooms=rooms.filter(r=>r.assignee===s.id&&r.status!=="Ready");
          const statusC=s.status==="Free"?T.green:s.status==="Break"?T.amber:T.blue;
          return(
            <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 16px",borderBottom:`1px solid ${T.lineSoft}`}}>
              <div style={{width:32,height:32,borderRadius:8,background:T.panel,border:`1px solid ${T.line}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>🧹</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontFamily:FS,color:T.hi}}>{s.name}</div>
                <div style={{fontSize:9.5,fontFamily:FM,color:T.soft,letterSpacing:".06em"}}>{s.zone} · Floor {s.floor}</div>
              </div>
              <div style={{textAlign:"center",minWidth:40}}>
                <div style={{fontFamily:FD,fontSize:16,color:T.mid}}>{s.tasks}</div>
                <div style={{fontSize:8,fontFamily:FM,color:T.soft}}>TASKS</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <span style={{fontSize:9,fontFamily:FM,color:statusC,background:statusC+"15",border:`1px solid ${statusC}44`,padding:"3px 8px",borderRadius:20,letterSpacing:".08em"}}>{s.status.toUpperCase()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Workflow waterfall */}
      <div style={{background:T.card,border:`1px solid ${T.line}`,borderRadius:12,padding:20}}>
        <div style={{fontSize:10,fontFamily:FM,color:T.gold,letterSpacing:".14em",marginBottom:16}}>PMS WORKFLOW</div>
        {["Reservation","Arrival Prediction","Smart Priority Engine","Housekeeping Task List","Room Cleaned","Room Ready → Guest Check-In"].map((s,i,arr)=>(
          <div key={s} style={{display:"flex",alignItems:"flex-start",gap:12}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:i===3?T.goldPale:T.panel,border:`1.5px solid ${i===3?T.gold:T.line}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9.5,fontFamily:FM,color:i===3?T.gold:T.soft,fontWeight:700}}>{i+1}</div>
              {i<arr.length-1&&<div style={{width:1.5,height:20,background:i===3?T.gold:T.faint,marginTop:3}}/>}
            </div>
            <div style={{paddingTop:3,paddingBottom:i<arr.length-1?14:0}}>
              <span style={{fontSize:11,fontFamily:i===3?FM:FS,color:i===3?T.gold:T.mid,letterSpacing:i===3?".06em":0,fontWeight:i===3?700:400}}>{s}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT SHELL
═══════════════════════════════════════════════════════════ */
export default function SmartHousekeeping() {
  const [rooms, setRooms] = useState([]);
  const [staff, setStaff] = useState([]);
  const [view, setView] = useState("board");
  const [toast, setToast] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/staff")
      .then(res => res.json())
      .then(data => setStaff(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setRooms(rs =>
        rs.map(r =>
          r.arrivalMin !== null && r.arrivalMin > 0
            ? { ...r, arrivalMin: r.arrivalMin - 1 }
            : r
        )
      );
      setTick(t => t + 1);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  function onToast(msg, type = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }

  const alerts = rooms.filter(
    r => r.status === "Dirty" && r.arrivalMin !== null && r.arrivalMin < 60
  );

  const VIEWS = [
    { k: "board", label: "Priority Board", icon: "◈" },
    { k: "mobile", label: "Staff Mobile", icon: "📱" },
    { k: "command", label: "Command Center", icon: "⌖" }
  ];

  function fetchRooms() {
    fetch("http://localhost:5000/rooms")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(r => ({
          id: r.room_number?.toString(),
          floor: r.floor,
          type: r.type,
          guest: r.guest || "—",
          vip: false,
          checkout: r.check_out || null,
          arrivalMin: 120,
          status: r.cleaning_status || r.status,
          assignee: r.assignee,
          progress: r.progress || 0,
          cleanEst: 20,
          tag: ""
        }));
        setRooms(formatted);
      })
      .catch(err => console.error(err));
  }

  async function unassign(roomId) {
    await fetch(`http://localhost:5000/unassign/${roomId}`, {
      method: "DELETE"
    });
    fetchRooms();
  }

  return (
    <div style={{height:"100vh",background:T.void,display:"flex",flexDirection:"column",fontFamily:FS,overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeIn   {from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)}}
        @keyframes blink    {0%,100%{opacity:.3} 50%{opacity:1}}
        @keyframes alertPulse{0%,100%{opacity:.85} 50%{opacity:1}}
        @keyframes scanRight{from{left:-20%} to{left:110%}}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-thumb{background:${T.line};border-radius:4px}
        ::-webkit-scrollbar-track{background:transparent}
      `}</style>

      {/* ── TOPBAR ─────────────────────────────────────────── */}
      <div style={{background:T.base,borderBottom:`1px solid ${T.line}`,padding:"0 24px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:T.gold,boxShadow:`0 0 10px ${T.gold}`}}/>
            <span style={{fontFamily:FD,fontSize:15,color:T.hi,letterSpacing:".04em"}}>Grand Palace</span>
          </div>
          <div style={{width:1,height:16,background:T.line}}/>
          <span style={{fontFamily:FM,fontSize:10,color:T.soft,letterSpacing:".14em"}}>SMART HOUSEKEEPING ENGINE</span>
        </div>

        {/* Nav */}
        <div style={{display:"flex",background:T.panel,borderRadius:8,padding:3,gap:2,border:`1px solid ${T.line}`}}>
          {VIEWS.map(v=>(
            <button key={v.k} onClick={()=>setView(v.k)} style={{padding:"6px 16px",borderRadius:6,border:"none",cursor:"pointer",fontFamily:FM,fontSize:10,letterSpacing:".07em",transition:"all .2s",background:view===v.k?T.card:"transparent",color:view===v.k?T.gold:T.soft}}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>

        {/* Live indicator */}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:5,background:alerts.length>0?T.redPale:T.greenPale,border:`1px solid ${alerts.length>0?T.redLine:T.greenLine}`,borderRadius:20,padding:"4px 12px"}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:alerts.length>0?T.red:T.green,animation:"blink 1s infinite"}}/>
            <span style={{fontSize:9,fontFamily:FM,color:alerts.length>0?T.red:T.green,letterSpacing:".09em"}}>
              {alerts.length>0?`${alerts.length} CRITICAL`:"ALL CLEAR"}
            </span>
          </div>
          <div style={{fontSize:9,fontFamily:FM,color:T.faint}}>TICK #{tick}</div>
        </div>
      </div>

      {/* ── ALERT STRIP ────────────────────────────────────── */}
      {alerts.length>0&&(
        <div style={{padding:"8px 24px",background:T.redPale,borderBottom:`1px solid ${T.redLine}`,flexShrink:0}}>
          <AlertBanner rooms={rooms}/>
        </div>
      )}

      {/* ── MAIN ────────────────────────────────────────────── */}
      <div style={{flex:1,overflow:"hidden"}}>
        {view==="board"   && <SupervisorBoard  rooms={rooms} setRooms={setRooms} onToast={onToast} staff={staff} /> }
        {view==="mobile"  && <StaffMobileView  rooms={rooms} setRooms={setRooms} onToast={onToast} staff={staff}/>}
        {view==="command" && <CommandPanel     rooms={rooms} staff={staff}/>}
      </div>

      {/* ── TOAST ───────────────────────────────────────────── */}
      {toast&&(
        <div style={{position:"fixed",bottom:20,right:20,zIndex:9999,
          background: toast.type==="ok"?T.greenPale:toast.type==="assign"?T.goldPale:toast.type==="warn"?T.amberPale:T.bluePale,
          border:`1px solid ${toast.type==="ok"?T.greenLine:toast.type==="assign"?T.goldLine:toast.type==="warn"?T.amberLine:T.blueLine}`,
          color:toast.type==="ok"?T.green:toast.type==="assign"?T.gold:toast.type==="warn"?T.amber:T.blue,
          padding:"11px 18px",borderRadius:10,fontFamily:FM,fontSize:12,letterSpacing:".06em",
          boxShadow:"0 8px 32px rgba(0,0,0,.4)",animation:"fadeIn .25s ease"}}>
          {toast.type==="ok"?"✓ ":toast.type==="assign"?"→ ":toast.type==="warn"?"⚠ ":"ℹ "}{toast.msg}
        </div>
      )}
    </div>
  );
}
