import { useState, useRef, useEffect } from "react";
const API = "http://localhost:5000/api";
/* ═══════════════════════════════════════════════════════════════
   GRAND PALACE — GUEST PRE-CHECK-IN
   Mobile-first · Warm ivory + deep ink + brushed gold
   Feels like a luxury boarding pass, not a form
═══════════════════════════════════════════════════════════════ */


const C = {
  ink:        "#0E1C2A",
  inkMid:     "#1A2E42",
  inkLight:   "#24405A",
  parchment:  "#FAF6EF",
  parchmentMd:"#F2EDE2",
  parchmentDp:"#E8E0D0",
  white:      "#FFFFFF",
  gold:       "#B8860B",
  goldBright: "#D4A017",
  goldPale:   "#FDF8EC",
  goldGlow:   "rgba(184,134,11,.18)",
  goldBorder: "#D4C080",
  onInk:      "#F0E8D8",
  onInkSoft:  "rgba(240,232,216,.5)",
  onInkFaint: "rgba(240,232,216,.25)",
  green:      "#1A7A4C",
  greenPale:  "#EAF6F0",
  greenLine:  "#90D0B0",
  red:        "#B83228",
  redPale:    "#FDF0EF",
  redLine:    "#E0A8A0",
  amber:      "#B86010",
  amberPale:  "#FDF4EA",
};

const serif   = "'Cormorant Garamond', 'Georgia', serif";
const body    = "'Lora', 'Georgia', serif";
const mono    = "'DM Mono', 'Courier New', monospace";

/* ── MOCK DATA (would come from the link token) ── */
const RESERVATION = {
  id:        "R-1001",
  hotel:     "Grand Palace",
  city:      "New Delhi",
  guestName: "Rahul Sharma",
  room:      "204",
  roomType:  "Deluxe Room",
  checkin:   "12 Aug 2025",
  checkout:  "15 Aug 2025",
  nights:    3,
  deposit:   2000,
  arrTime:   "14:00",
};

const OCR_MOCK = {
  Passport: { name:"Rahul Sharma", dob:"10 Jul 1990", nat:"Indian",  docNo:"J3421890",       exp:"22 Nov 2030", vType:"N/A (Domestic)", vStatus:"ok" },
  Aadhaar:  { name:"Rahul Sharma", dob:"10 Jul 1990", nat:"Indian",  docNo:"9234-5678-0012", exp:null,          vType:"N/A (Domestic)", vStatus:"ok" },
  Iqama:    { name:"Ahmad Al-Rashid",dob:"05 Nov 1982",nat:"Saudi",  docNo:"IQ-9923441",     exp:"10 Mar 2025", vType:"Residence Visa", vStatus:"expired" },
};

const STEPS = ["Details", "Document", "Visa", "Payment", "Confirm"];

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

/* ─── STEP PROGRESS BAR ─────────────────────────────────── */
function ProgressTrack({ current }) {
  return (
    <div style={{ display:"flex", alignItems:"center", padding:"0 2px" }}>
      {STEPS.map((label, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={label} style={{ display:"flex", alignItems:"center", flex: i < STEPS.length-1 ? 1 : "none" }}>
            {/* Node */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, position:"relative" }}>
              <div style={{
                width:  active ? 30 : 24,
                height: active ? 30 : 24,
                borderRadius:"50%",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily: mono, fontSize: done ? 11 : 10, fontWeight:700,
                transition:"all .4s cubic-bezier(.34,1.56,.64,1)",
                background:  done   ? C.gold
                           : active ? C.ink
                           : "transparent",
                border: `2px solid ${done ? C.gold : active ? C.goldBright : C.onInkFaint}`,
                color:   done || active ? "#fff" : C.onInkFaint,
                boxShadow: active ? `0 0 0 5px ${C.goldGlow}, 0 2px 12px rgba(0,0,0,.3)` : "none",
                zIndex: 2,
              }}>
                {done ? "✓" : i+1}
              </div>
              <span style={{
                fontSize:8, fontFamily:mono, letterSpacing:".08em",
                color: active ? C.goldBright : done ? C.gold : C.onInkFaint,
                whiteSpace:"nowrap", transition:"color .3s",
              }}>{label.toUpperCase()}</span>
            </div>
            {/* Connector */}
            {i < STEPS.length-1 && (
              <div style={{
                flex:1, height:1.5, margin:"0 3px", marginBottom:16,
                background: done
                  ? `linear-gradient(90deg, ${C.gold}, ${C.goldBright})`
                  : C.onInkFaint,
                transition:"background .5s",
                borderRadius:2,
              }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── FLOATING LABEL INPUT ──────────────────────────────── */
function Field({ label, type="text", value, onChange, placeholder, req, note }) {
  const [focused, setFocus] = useState(false);
  const active = focused || value;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ position:"relative" }}>
        <label style={{
          position:"absolute", left:14, zIndex:1, pointerEvents:"none",
          transition:"all .2s", fontFamily: active ? mono : body,
          top:    active ? 7  : "50%",
          fontSize: active ? 9 : 14,
          transform: active ? "none" : "translateY(-50%)",
          color:  focused ? C.gold : active ? C.gold+"99" : C.inkLight+"80",
          letterSpacing: active ? ".1em" : 0,
          textTransform: active ? "uppercase" : "none",
        }}>
          {label}{req && <span style={{ color:C.goldBright }}> *</span>}
        </label>
        <input
          type={type} value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={()=>setFocus(true)}
          onBlur={()=>setFocus(false)}
          placeholder={focused ? (placeholder||"") : ""}
          style={{
            width:"100%", paddingTop:22, paddingBottom:10, paddingLeft:14, paddingRight:14,
            boxSizing:"border-box", borderRadius:12, background:C.white,
            border:`1.5px solid ${focused ? C.goldBright : C.parchmentDp}`,
            fontSize:14, fontFamily:body, color:C.ink, outline:"none",
            boxShadow: focused ? `0 0 0 3px ${C.goldGlow}` : "none",
            transition:"all .2s",
          }}
        />
      </div>
      {note && <div style={{ fontSize:10, fontFamily:mono, color:C.gold, letterSpacing:".07em", marginTop:5, paddingLeft:2 }}>{note}</div>}
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  const [focused, setFocus] = useState(false);
  return (
    <div style={{ marginBottom:18 }}>
      <label style={{ display:"block", fontSize:9, fontFamily:mono, color:C.gold, letterSpacing:".1em", textTransform:"uppercase", marginBottom:7 }}>{label}</label>
      <select value={value} onChange={e=>onChange(e.target.value)}
        onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
        style={{ width:"100%", padding:"13px 14px", borderRadius:12, background:C.white, border:`1.5px solid ${focused?C.goldBright:C.parchmentDp}`, fontSize:14, fontFamily:body, color:C.ink, outline:"none", appearance:"none", boxShadow:focused?`0 0 0 3px ${C.goldGlow}`:"none", transition:"all .2s" }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ─── CARD SHELL ─────────────────────────────────────────── */
function Card({ children, style={} }) {
  return (
    <div style={{ background:C.white, borderRadius:20, padding:"22px 18px", boxShadow:"0 4px 24px rgba(14,28,42,.07)", ...style }}>
      {children}
    </div>
  );
}

/* ─── SECTION HEADING ────────────────────────────────────── */
function SHead({ icon, title, sub }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
      <div style={{ width:40, height:40, borderRadius:12, background:C.goldPale, border:`1.5px solid ${C.goldBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize:16, fontFamily:body, fontWeight:600, color:C.ink }}>{title}</div>
        {sub && <div style={{ fontSize:10, fontFamily:mono, color:C.gold, letterSpacing:".07em", marginTop:2 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ─── DOCUMENT SCAN ANIMATION ────────────────────────────── */
function ScanAnimation() {
  return (
    <div style={{ borderRadius:16, overflow:"hidden", background:C.parchmentMd, border:`1.5px solid ${C.parchmentDp}` }}>
      <div style={{ height:156, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
        {/* Scan line */}
        <div style={{ position:"absolute", left:0, right:0, height:2.5, background:`linear-gradient(90deg, transparent 0%, ${C.goldBright} 30%, ${C.gold} 50%, ${C.goldBright} 70%, transparent 100%)`, animation:"scanLine 1.4s ease-in-out infinite", boxShadow:`0 0 10px ${C.goldBright}` }}/>
        {/* Corner marks */}
        {[{t:12,l:12,br:"none"},{t:12,r:12,bl:"none"},{b:12,l:12,tr:"none"},{b:12,r:12,tl:"none"}].map((pos,i)=>{
          const border = { borderTop:`2px solid ${C.goldBright}`, borderLeft:`2px solid ${C.goldBright}` };
          const corners = [
            {borderTop:`2px solid ${C.goldBright}`,borderLeft:`2px solid ${C.goldBright}`},
            {borderTop:`2px solid ${C.goldBright}`,borderRight:`2px solid ${C.goldBright}`},
            {borderBottom:`2px solid ${C.goldBright}`,borderLeft:`2px solid ${C.goldBright}`},
            {borderBottom:`2px solid ${C.goldBright}`,borderRight:`2px solid ${C.goldBright}`},
          ];
          const positions = [{top:12,left:12},{top:12,right:12},{bottom:12,left:12},{bottom:12,right:12}];
          return <div key={i} style={{ position:"absolute", width:18, height:18, ...corners[i], ...positions[i] }}/>;
        })}
        <div style={{ textAlign:"center", zIndex:1 }}>
          <div style={{ fontSize:10, fontFamily:mono, color:C.gold, letterSpacing:".14em", animation:"scanPulse 1.4s ease-in-out infinite" }}>READING DOCUMENT</div>
          <div style={{ display:"flex", justifyContent:"center", gap:5, marginTop:8 }}>
            {[0,1,2].map(i=>(
              <div key={i} style={{ width:5, height:5, borderRadius:"50%", background:C.goldBright, animation:`dotBounce 1.2s ${i*.18}s ease-in-out infinite` }}/>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding:"14px 16px", borderTop:`1px solid ${C.parchmentDp}` }}>
        {["Full Name","Date of Birth","Document No.","Nationality"].map((f,i)=>(
          <div key={f} style={{ height:9, borderRadius:4, background:C.parchmentDp, marginBottom:i<3?8:0, width:["75%","45%","60%","40%"][i], animation:`scanPulse 1.4s ${i*.15}s ease-in-out infinite` }}/>
        ))}
      </div>
    </div>
  );
}

/* ─── OCR RESULT GRID ────────────────────────────────────── */
function OcrGrid({ data }) {
  const rows = [
    ["Full Name",      data.name],
    ["Date of Birth",  data.dob],
    ["Nationality",    data.nat],
    ["Document No.",   data.docNo],
    data.exp ? ["Expiry Date", data.exp] : null,
    ["Visa Category",  data.vType],
  ].filter(Boolean);
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14, background:C.greenPale, border:`1px solid ${C.greenLine}`, borderRadius:10, padding:"9px 14px" }}>
        <span style={{ color:C.green, fontSize:15 }}>✓</span>
        <span style={{ fontSize:12, fontFamily:body, color:C.green }}>OCR extraction complete — please verify</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {rows.map(([k,v])=>(
          <div key={k} style={{ background:C.parchmentMd, borderRadius:10, padding:"11px 12px" }}>
            <div style={{ fontSize:8.5, fontFamily:mono, color:C.gold, letterSpacing:".1em", marginBottom:4, textTransform:"uppercase" }}>{k}</div>
            <div style={{ fontSize:13, fontFamily:body, color:C.ink, fontWeight:600, lineHeight:1.3 }}>{v||"—"}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:12, fontSize:10, fontFamily:mono, color:C.amber, letterSpacing:".07em", textAlign:"center" }}>
        ✎ Tap any field to correct
      </div>
    </div>
  );
}

/* ─── VISA CHECK ─────────────────────────────────────────── */
function VisaCheck({ status, docType }) {
  const ok = status === "ok";
  const checks = [
    { label:"Document authenticity",  pass:true },
    { label:"Expiry date",            pass:ok   },
    { label:"Visa category",          pass:ok   },
    { label:"Stay duration allowed",  pass:ok   },
    { label:"Immigration compliance", pass:ok   },
  ];
  return (
    <div>
      {/* Banner */}
      <div style={{ borderRadius:16, padding:"18px 18px", marginBottom:18, display:"flex", gap:14, alignItems:"center",
        background:ok ? C.greenPale : C.redPale, border:`1.5px solid ${ok ? C.greenLine : C.redLine}` }}>
        <div style={{ width:44, height:44, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
          background:ok?"rgba(26,122,76,.12)":"rgba(184,50,40,.12)", fontSize:22 }}>
          {ok ? "✓" : "✕"}
        </div>
        <div>
          <div style={{ fontSize:15, fontFamily:body, fontWeight:600, color:ok?C.green:C.red, marginBottom:3 }}>
            {ok ? "Verification Passed" : "Visa Issue Detected"}
          </div>
          <div style={{ fontSize:11, fontFamily:mono, color:(ok?C.green:C.red)+"99", letterSpacing:".05em" }}>
            {ok ? "All checks passed — you're cleared to stay" : "Please call the hotel front desk before arrival"}
          </div>
        </div>
      </div>
      {/* Checklist */}
      {checks.map(c=>(
        <div key={c.label} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 0", borderBottom:`1px solid ${C.parchmentDp}` }}>
          <div style={{ width:22, height:22, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10,
            background: c.pass ? C.greenPale : C.redPale, border:`1px solid ${c.pass ? C.greenLine : C.redLine}`, color:c.pass?C.green:C.red }}>
            {c.pass?"✓":"✕"}
          </div>
          <span style={{ flex:1, fontSize:13, fontFamily:body, color:C.ink }}>{c.label}</span>
          <span style={{ fontSize:9, fontFamily:mono, letterSpacing:".08em", color:c.pass?C.green:C.red }}>{c.pass?"PASSED":"FAILED"}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function GuestPreCheckin() {
  const [step,     setStep]    = useState(0);
  const [form,     setForm]    = useState({ firstName:"Rahul", lastName:"Sharma", phone:"", email:"", arrTime:RESERVATION.arrTime, requests:"" });
  const [docType,  setDocType] = useState("Aadhaar");
  const [scanning, setScanning]= useState(false);
  const [ocrDone,  setOcrDone] = useState(false);
  const [ocrData,  setOcrData] = useState(null);
  const [visaDone, setVisaDone]= useState(false);
  const [payMethod,setPayMeth] = useState(null);
  const [payDone,  setPayDone] = useState(false);
  const [submitted,setSubmit]  = useState(false);
  const fileRef = useRef();

  const upd = k => v => setForm(p=>({...p,[k]:v}));
// SAVE GUEST
async function saveGuest() {
  await fetch(`${API}/guest/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      docType: docType,
      docNumber: ocrData?.docNo || "",
      reservation_id: Number(RESERVATION.id)   // 🔥 IMPORTANT
    })
  });
}
// PAYMENT
async function makePayment() {
  await fetch(`${API}/pay/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      payment_method: payMethod
    })
  });

  setPayDone(true);
}

// FINAL SUBMIT
async function completeBooking() {
  await fetch(`${API}/booking/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reservation_id: 1001
    })
  });
}
  /* ── validators ── */
  const step0ok = form.phone.length > 5 && form.email.includes("@");
  const step1ok = ocrDone;
  const step2ok = true;
  const step3ok = true; // deposit optional
  const canNext = [step0ok, step1ok, step2ok, step3ok, true][step];

async function runScan(file) {
  setScanning(true);

  const fd = new FormData();
  fd.append("file", file);
  fd.append("docType", docType);

  try {
    const res = await fetch(`${API}/doc/upload`, {
      method: "POST",
      body: fd
    });

    const data = await res.json();

    setOcrData(data);
    setOcrDone(true);
  } catch (err) {
    alert("Scan failed");
  }

  setScanning(false);
}
async function runVisaCheck() {
  try {
    const res = await fetch(`${API}/doc/visa-check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ docType })
    });

    const data = await res.json();

    setVisaDone(true);
    setStep(3);   // 🔥 THIS LINE FIXES YOUR ISSUE

  } catch {
    alert("Visa check failed");
  }
}
  async function handleCTA() {

  if (step === 0) {
    await saveGuest();
    setStep(1);
    return;
  }

  if (step === 1) {
    if (!ocrDone) return;
    setStep(2);
    return;
  }

  if (step === 2) {
    if (!visaDone) {
      await runVisaCheck();
      return;
    }
    setStep(3);
    return;
  }

  if (step === 3) {
    if (!payDone && payMethod !== "arrival") {
      await makePayment();
      return;
    }
    setStep(4);
    return;
  }

  if (step === 4) {
    await completeBooking();
    setSubmit(true);
  }
}

  /* ── CTA label ── */
  const ctaLabel =
    step===0 ? "Continue →"
  : step===1 ? (ocrDone ? "Continue to Visa Check →" : scanning ? "Scanning…" : "Scan Document")
  : step===2 ? (visaDone ? "Continue to Payment →" : "Check Visa")
  : step===3 ? "Review & Confirm →"
  : submitted ? "Submitting…"
  : "Complete Pre-Check-In ✓";

  return (
    <div style={{ minHeight:"100dvh", background:C.ink, display:"flex", flexDirection:"column", fontFamily:body }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Lora:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scanLine { 0%{top:-2px} 100%{top:calc(100% + 2px)} }
        @keyframes scanPulse{ 0%,100%{opacity:.35} 50%{opacity:1} }
        @keyframes dotBounce{ 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(-5px);opacity:1} }
        @keyframes popIn    { 0%{transform:scale(.85);opacity:0} 80%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }
        @keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        input::placeholder,textarea::placeholder { color:${C.parchmentDp}; font-family:'Lora',serif; font-size:13px }
        select { appearance:none; -webkit-appearance:none; }
        ::-webkit-scrollbar { width:0; }
        textarea { resize:none; }
      `}</style>

      {/* ══ HEADER ══════════════════════════════════════════ */}
      <div style={{ background:`linear-gradient(175deg, ${C.ink} 0%, ${C.inkMid} 55%, ${C.inkLight} 100%)`, padding:"52px 22px 30px", position:"relative", overflow:"hidden", flexShrink:0 }}>
        {/* gold orb */}
        <div style={{ position:"absolute", top:-30, right:-30, width:160, height:160, borderRadius:"50%", background:`radial-gradient(circle, ${C.goldGlow} 0%, transparent 68%)`, pointerEvents:"none" }}/>
        {/* bottom rule */}
        <div style={{ position:"absolute", bottom:0, left:22, right:22, height:"1px", background:`linear-gradient(90deg,transparent,${C.goldBorder},transparent)` }}/>

        {/* Hotel badge */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:26 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:C.goldBright, boxShadow:`0 0 8px ${C.goldBright}` }}/>
          <span style={{ fontFamily:mono, fontSize:9.5, color:C.onInkSoft, letterSpacing:".18em" }}>
            GRAND PALACE · NEW DELHI
          </span>
        </div>

        {/* Headline */}
        <div style={{ marginBottom:28 }}>
          <div style={{ fontFamily:mono, fontSize:10, color:C.goldBright, letterSpacing:".16em", marginBottom:10 }}>
            PRE CHECK-IN
          </div>
          <h1 style={{ fontFamily:serif, fontSize:34, color:C.onInk, lineHeight:1.1, fontWeight:600 }}>
            Hello, {RESERVATION.guestName.split(" ")[0]}.<br/>
            <span style={{ fontStyle:"italic", color:C.goldBright, fontSize:30 }}>Let's get you<br/>ready to arrive.</span>
          </h1>
        </div>

        {/* Reservation ribbon */}
        <div style={{ display:"flex", gap:14, background:"rgba(255,255,255,.05)", border:`1px solid ${C.onInkFaint}`, borderRadius:12, padding:"12px 14px", marginBottom:28 }}>
          {[["Room", RESERVATION.roomType+" "+RESERVATION.room],["Check-in",RESERVATION.checkin.split(" ").slice(0,2).join(" ")],["Nights",RESERVATION.nights+"n"]].map(([k,v])=>(
            <div key={k} style={{ flex:1, borderRight:k!=="Nights"?`1px solid ${C.onInkFaint}`:"none", paddingRight:k!=="Nights"?14:0 }}>
              <div style={{ fontSize:8.5, fontFamily:mono, color:C.onInkFaint, letterSpacing:".1em", marginBottom:4 }}>{k.toUpperCase()}</div>
              <div style={{ fontSize:12, fontFamily:body, color:C.onInk, fontWeight:500 }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Step track */}
        <ProgressTrack current={step}/>
      </div>

      {/* ══ SCROLLABLE CONTENT ══════════════════════════════ */}
      <div style={{ flex:1, background:C.parchment, borderTopLeftRadius:26, borderTopRightRadius:26, marginTop:-4, padding:"26px 16px 110px", overflowY:"auto" }}>

        {/* ── STEP 0: Guest Details ── */}
        {step===0 && (
          <div style={{ animation:"fadeUp .35s ease" }}>
            <Card style={{ marginBottom:14 }}>
              <SHead icon="👤" title="Your Details" sub="CONFIRM OR UPDATE YOUR INFORMATION"/>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 10px" }}>
                <Field label="First Name" value={form.firstName} onChange={upd("firstName")} req/>
                <Field label="Last Name"  value={form.lastName}  onChange={upd("lastName")}  req/>
              </div>
              <Field label="Mobile Number" type="tel"   value={form.phone} onChange={upd("phone")} placeholder="+91 98765 43210" req/>
              <Field label="Email Address" type="email" value={form.email} onChange={upd("email")} placeholder="yourname@email.com" req/>
            </Card>

            <Card style={{ marginBottom:14 }}>
              <SHead icon="🕐" title="Arrival Details" sub="HELP US PREPARE YOUR ROOM"/>
              <Field label="Expected Arrival Time" type="time" value={form.arrTime} onChange={upd("arrTime")} req note="Front desk will prepare your room for this time"/>
              <div>
                <div style={{ fontSize:9, fontFamily:mono, color:C.gold, letterSpacing:".1em", textTransform:"uppercase", marginBottom:8 }}>Special Requests</div>
                <textarea value={form.requests} onChange={e=>upd("requests")(e.target.value)}
                  placeholder="High floor, extra pillows, dietary preferences, early check-in…"
                  rows={3}
                  style={{ width:"100%", padding:"13px 14px", borderRadius:12, background:C.white, border:`1.5px solid ${C.parchmentDp}`, fontSize:13, fontFamily:body, color:C.ink, outline:"none" }}/>
              </div>
            </Card>

            {/* Consent note */}
            <div style={{ fontSize:11, fontFamily:mono, color:C.gold+"99", letterSpacing:".05em", textAlign:"center", lineHeight:1.6 }}>
              Your data is encrypted and used only<br/>for this reservation.
            </div>
          </div>
        )}

        {/* ── STEP 1: Document Upload ── */}
        {step===1 && (
          <div style={{ animation:"fadeUp .35s ease" }}>
            <Card style={{ marginBottom:14 }}>
              <SHead icon="🪪" title="Identity Document" sub="UPLOAD FOR INSTANT OCR VERIFICATION"/>

              {/* Doc type selector */}
              <div style={{ display:"flex", gap:8, marginBottom:22 }}>
                {["Passport","Aadhaar","Iqama"].map(d=>(
                  <button key={d} onClick={()=>{setDocType(d); setOcrDone(false); setOcrData(null); setScanning(false);}}
                    style={{ flex:1, padding:"11px 0", borderRadius:10, border:`1.5px solid ${docType===d?C.goldBright:C.parchmentDp}`, background:docType===d?C.goldPale:C.white, color:docType===d?C.gold:C.inkLight+"80", fontSize:11, fontFamily:mono, cursor:"pointer", transition:"all .2s", letterSpacing:".06em" }}>
                    {d.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* State: idle */}
              {!ocrDone && !scanning && (
                <div>
                  <div onClick={()=>fileRef.current.click()}
                    style={{ border:`2px dashed ${C.goldBorder}`, borderRadius:18, padding:"36px 24px", textAlign:"center", cursor:"pointer", background:C.goldPale, transition:"all .25s" }}
                    onMouseEnter={e=>{e.currentTarget.style.background=C.parchmentMd;}}
                    onMouseLeave={e=>{e.currentTarget.style.background=C.goldPale;}}>
                    <input ref={fileRef} type="file" accept="image/*,.pdf" style={{display:"none"}} onChange={e => runScan(e.target.files[0])}/>
                    <div style={{ width:60, height:60, borderRadius:16, background:C.white, boxShadow:"0 6px 20px rgba(14,28,42,.08)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:26 }}>📄</div>
                    <div style={{ fontSize:15, fontFamily:body, fontWeight:600, color:C.ink, marginBottom:6 }}>Upload your {docType}</div>
                    <div style={{ fontSize:10, fontFamily:mono, color:C.gold, letterSpacing:".08em", marginBottom:20 }}>JPEG · PNG · PDF · MAX 10MB</div>
                    <div style={{ display:"inline-block", padding:"10px 28px", background:C.ink, color:"#fff", borderRadius:10, fontSize:11, fontFamily:mono, letterSpacing:".1em", boxShadow:"0 4px 16px rgba(14,28,42,.2)" }}>
                      TAP TO UPLOAD
                    </div>
                  </div>
                  {/* Or simulate button */}
                  <button onClick={runScan} style={{ display:"block", width:"100%", marginTop:14, padding:"13px 0", background:"transparent", border:`1.5px solid ${C.parchmentDp}`, borderRadius:12, fontFamily:mono, fontSize:11, color:C.gold, cursor:"pointer", letterSpacing:".08em" }}>
                    ↻ SIMULATE OCR SCAN
                  </button>
                </div>
              )}

              {/* State: scanning */}
              {scanning && <ScanAnimation/>}

              {/* State: done */}
              {ocrDone && ocrData && <OcrGrid data={ocrData}/>}
            </Card>

            <div style={{ background:C.inkMid, borderRadius:14, padding:"14px 16px", display:"flex", gap:10, alignItems:"flex-start" }}>
              <span style={{ fontSize:14 }}>🔒</span>
              <div style={{ fontSize:11, fontFamily:mono, color:C.onInkSoft, letterSpacing:".05em", lineHeight:1.6 }}>
                Document data is processed via encrypted OCR and never stored after verification.
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Visa Verification ── */}
        {step===2 && (
          <div style={{ animation:"fadeUp .35s ease" }}>
            <Card style={{ marginBottom:14 }}>
              <SHead icon="🛂" title="Visa Verification" sub="AUTOMATED COMPLIANCE CHECK"/>

              {!visaDone && (
                <div style={{ textAlign:"center", padding:"28px 0 20px" }}>
                  <div style={{ width:68, height:68, borderRadius:"50%", background:C.goldPale, border:`2px solid ${C.goldBorder}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", fontSize:28, animation:"floatBob 2.4s ease-in-out infinite" }}>🔍</div>
                  <div style={{ fontSize:15, fontFamily:body, color:C.ink, marginBottom:8 }}>Ready to check your documents</div>
                  <div style={{ fontSize:10, fontFamily:mono, color:C.gold, letterSpacing:".08em", marginBottom:24 }}>CHECKS PASSPORT · VISA · IMMIGRATION STATUS</div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
                    {["Document validity","Visa category","Stay limits","Compliance"].map(t=>(
                      <span key={t} style={{ fontSize:9, fontFamily:mono, padding:"4px 12px", borderRadius:20, background:C.parchmentMd, color:C.gold, border:`1px solid ${C.goldBorder}`, letterSpacing:".07em" }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {visaDone && <VisaCheck status={ocrData?.vStatus || "ok"} docType={docType}/>}
            </Card>

            {visaDone && ocrData?.vStatus==="expired" && (
              <div style={{ background:C.redPale, border:`1.5px solid ${C.redLine}`, borderRadius:14, padding:"14px 16px", display:"flex", gap:12, alignItems:"center" }}>
                <span style={{ fontSize:18 }}>📞</span>
                <div style={{ fontSize:12, fontFamily:body, color:C.red, lineHeight:1.5 }}>
                  Please call us at <strong>+91 11 2345 6789</strong> before your arrival. Our team will assist you.
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 3: Deposit Payment ── */}
        {step===3 && (
          <div style={{ animation:"fadeUp .35s ease" }}>
            <Card style={{ marginBottom:14 }}>
              <SHead icon="💳" title="Deposit Payment" sub="SECURE PRE-AUTHORIZATION"/>

              {/* Amount display */}
              <div style={{ background:`linear-gradient(135deg,${C.ink},${C.inkLight})`, borderRadius:16, padding:"22px 20px", textAlign:"center", marginBottom:22, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:`radial-gradient(circle,${C.goldGlow},transparent 70%)` }}/>
                <div style={{ fontSize:10, fontFamily:mono, color:C.onInkSoft, letterSpacing:".14em", marginBottom:8 }}>REFUNDABLE DEPOSIT</div>
                <div style={{ fontFamily:serif, fontSize:46, color:C.goldBright, lineHeight:1, fontWeight:700 }}>₹2,000</div>
                <div style={{ fontSize:10, fontFamily:mono, color:C.onInkSoft, marginTop:10, letterSpacing:".07em" }}>Applied to your final bill at check-out</div>
              </div>

              {/* Payment methods */}
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:18 }}>
                {[
                  { id:"card",    icon:"💳", label:"Credit / Debit Card",  sub:"Visa · Mastercard · Rupay" },
                  { id:"upi",     icon:"📱", label:"UPI",                   sub:"PhonePe · GPay · Paytm · BHIM" },
                  { id:"net",     icon:"🏦", label:"Net Banking",           sub:"All major Indian banks" },
                  { id:"arrival", icon:"🏨", label:"Pay at Hotel",          sub:"Settle the deposit at front desk" },
                ].map(m => (
                  <button key={m.id} onClick={()=>setPayMeth(m.id)}
                    style={{ padding:"14px 16px", borderRadius:14, border:`1.5px solid ${payMethod===m.id?C.goldBright:C.parchmentDp}`, background:payMethod===m.id?C.goldPale:C.white, cursor:"pointer", display:"flex", alignItems:"center", gap:14, transition:"all .2s", textAlign:"left", boxShadow:payMethod===m.id?`0 0 0 3px ${C.goldGlow}`:"none" }}>
                    <div style={{ width:42, height:42, borderRadius:12, background:payMethod===m.id?C.white:C.parchmentMd, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, flexShrink:0, transition:"background .2s" }}>{m.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontFamily:body, fontWeight:600, color:C.ink, marginBottom:2 }}>{m.label}</div>
                      <div style={{ fontSize:10, fontFamily:mono, color:C.gold, letterSpacing:".04em" }}>{m.sub}</div>
                    </div>
                    <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${payMethod===m.id?C.goldBright:C.parchmentDp}`, background:payMethod===m.id?C.goldBright:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .2s" }}>
                      {payMethod===m.id&&<div style={{ width:7, height:7, borderRadius:"50%", background:"#fff" }}/>}
                    </div>
                  </button>
                ))}
              </div>

              {payMethod && payMethod!=="arrival" && (
                <button onClick={()=>setPayDone(true)}
                  style={{ width:"100%", padding:"15px 0", borderRadius:14, fontFamily:mono, fontSize:12, cursor:"pointer", letterSpacing:".1em", fontWeight:600, transition:"all .35s",
                    background:payDone?C.greenPale:"linear-gradient(135deg,"+C.ink+","+C.inkLight+")",
                    color:payDone?C.green:"#fff",
                    border:`2px solid ${payDone?C.greenLine:"transparent"}`,
                    boxShadow:payDone?"none":"0 6px 20px rgba(14,28,42,.22)" }}>
                  {payDone ? "✓ PAYMENT AUTHORIZED" : `AUTHORIZE ₹2,000`}
                </button>
              )}
              {payMethod==="arrival" && (
                <div style={{ background:C.amberPale, border:`1px solid ${C.goldBorder}`, borderRadius:10, padding:"12px 16px", fontSize:12, fontFamily:body, color:C.amber, lineHeight:1.5 }}>
                  ℹ You'll be asked to pay the deposit when you arrive at the front desk.
                </div>
              )}
            </Card>

            <div style={{ fontSize:10, fontFamily:mono, color:C.gold+"80", letterSpacing:".05em", textAlign:"center", lineHeight:1.6 }}>
              Payment is encrypted via SSL · PCI-DSS compliant<br/>Deposit is fully refundable at check-out
            </div>
          </div>
        )}

        {/* ── STEP 4: Confirm ── */}
        {step===4 && (
          <div style={{ animation:"fadeUp .35s ease" }}>
            <Card style={{ marginBottom:14 }}>
              <SHead icon="✅" title="Review & Confirm" sub="FINAL SUMMARY"/>

              {[
                ["Guest",     `${form.firstName} ${form.lastName}`],
                ["Mobile",    form.phone || "—"],
                ["Email",     form.email || "—"],
                ["Arrival",   `${RESERVATION.checkin} · ${form.arrTime}`],
                ["Room",      `${RESERVATION.roomType} ${RESERVATION.room}`],
                ["Checkout",  RESERVATION.checkout],
                ["Document",  docType],
                ["Visa",      ocrData?.vStatus==="ok" ? "✓ Verified" : "⚠ See hotel"],
                ["Deposit",   payDone ? "✓ Authorized ₹2,000" : payMethod==="arrival" ? "Pay at hotel" : "Skipped"],
                ["Requests",  form.requests || "None"],
              ].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", gap:12, padding:"10px 0", borderBottom:`1px solid ${C.parchmentDp}` }}>
                  <span style={{ fontSize:10, fontFamily:mono, color:C.gold, letterSpacing:".08em", textTransform:"uppercase", flexShrink:0, minWidth:72 }}>{k}</span>
                  <span style={{ fontSize:13, fontFamily:body, color:C.ink, textAlign:"right", lineHeight:1.4 }}>{v}</span>
                </div>
              ))}
            </Card>

            {submitted && (
              <div style={{ animation:"popIn .5s cubic-bezier(.34,1.56,.64,1)", textAlign:"center", padding:"28px 16px" }}>
                <div style={{ width:72, height:72, borderRadius:"50%", background:C.goldPale, border:`2px solid ${C.goldBorder}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:32, boxShadow:`0 0 30px ${C.goldGlow}` }}>✓</div>
                <h2 style={{ fontFamily:serif, fontSize:26, color:C.ink, marginBottom:8 }}>All done!</h2>
                <p style={{ fontSize:13, fontFamily:body, color:C.inkLight, lineHeight:1.6 }}>
                  Your pre-check-in is complete.<br/>We'll send you your digital room key<br/>when you're near the hotel.
                </p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ══ STICKY FOOTER CTA ═══════════════════════════════ */}
      {!submitted && (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:100, padding:"12px 16px 30px", background:`linear-gradient(transparent, ${C.parchment} 30%)`, maxWidth:480, margin:"0 auto" }}>
          <button onClick={handleCTA} disabled={!canNext || scanning}
            style={{
              width:"100%", padding:"17px 0", borderRadius:16, fontFamily:mono, fontSize:13,
              fontWeight:700, letterSpacing:".1em", cursor:(canNext && !scanning)?"pointer":"default",
              transition:"all .3s",
              background: !canNext || scanning
                ? C.parchmentDp
                : step===4
                  ? `linear-gradient(135deg, ${C.green}, #22A060)`
                  : `linear-gradient(135deg, ${C.ink}, ${C.inkLight})`,
              color:!canNext||scanning?C.gold+"55":"#fff",
              border:"none",
              boxShadow:canNext&&!scanning?"0 8px 28px rgba(14,28,42,.24)":"none",
            }}>
            {ctaLabel}
          </button>
          {step > 0 && (
            <button onClick={()=>{setStep(s=>s-1); setVisaDone(false);}}
              style={{ display:"block", margin:"10px auto 0", background:"none", border:"none", fontFamily:mono, fontSize:10, color:C.gold+"80", cursor:"pointer", letterSpacing:".1em" }}>
              ← BACK
            </button>
          )}
        </div>
      )}
    </div>
  );
}

