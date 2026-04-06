import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══════════════════════════ TOKENS ═══════════════════════════ */
const N="#1B2E42",NM="#243D56",ND="#162536",
  G="#C99820",GP="#FBF4DC",GB="rgba(201,152,32,.13)",
  BG="#F2EEE5",BGM="#EAE4D8",BGD="#D8D0C0",
  CA="#FFFFFF",CT="#FAF8F3",BD="#DDD4BF",BS="#EAE3D4",
  T2="#3A5470",T3="#7890A8",T4="#AABCCC",T5="#C8D6E2";
const FD="'Cormorant Garamond',Georgia,serif",
  FS="'Lora',Georgia,serif",FM="'DM Mono','Courier New',monospace";

const EV={
  arr:  {ac:"#1A7E4C",bg:"#E6F5EE",bd:"#88C9A4",icon:"🛬",lbl:"Arrival",    cta:"Start Check-In"},
  dep:  {ac:"#C03242",bg:"#FDF0F1",bd:"#E09AA4",icon:"🛫",lbl:"Departure",  cta:"Start Checkout"},
  hk:   {ac:"#0B7EA0",bg:"#E6F3FA",bd:"#78BED4",icon:"🧹",lbl:"Cleaning",   cta:"Assign Staff"},
  mnt:  {ac:"#B87418",bg:"#FDF3E5",bd:"#DEB878",icon:"🔧",lbl:"Maintenance",cta:"Log Ticket"},
  vip:  {ac:"#C99820",bg:"#FBF4DC",bd:"#CCAA30",icon:"⭐",lbl:"VIP",        cta:"Prepare Room"},
  shift:{ac:"#5E38A0",bg:"#F0ECF8",bd:"#AA90D4",icon:"☀", lbl:"Shift",      cta:"View Handover"},
  ai:   {ac:"#0F6B57",bg:"#E2F4EF",bd:"#6ABCA8",icon:"✦", lbl:"AI Alert",   cta:"View Analysis"},
  fnb:  {ac:"#8B3A1C",bg:"#FDF0E8",bd:"#D4946A",icon:"🍽", lbl:"F&B",        cta:"View Menu"},
};
const TAGS={
  LATE:{tx:"#C03242",tbg:"#FDF0F1",tbd:"#E09AA4"},
  EXP:{tx:"#1A7E4C",tbg:"#E6F5EE",tbd:"#88C9A4"},
  PRIO:{tx:"#C03242",tbg:"#FDF0F1",tbd:"#E09AA4"},
  DONE:{tx:"#1A7E4C",tbg:"#E6F5EE",tbd:"#88C9A4"},
  RDY:{tx:"#1A7E4C",tbg:"#E6F5EE",tbd:"#88C9A4"},
  GROUP:{tx:"#1A7E4C",tbg:"#E6F5EE",tbd:"#88C9A4"},
  OTA:{tx:"#1758A0",tbg:"#EEF3FB",tbd:"#8AB8EC"},
  CORP:{tx:"#0B7EA0",tbg:"#E6F3FA",tbd:"#78BED4"},
  VIP:{tx:"#C99820",tbg:"#FBF4DC",tbd:"#CCAA30"},
  AI:{tx:"#0F6B57",tbg:"#E2F4EF",tbd:"#6ABCA8"},
  MNT:{tx:"#B87418",tbg:"#FDF3E5",tbd:"#DEB878"},
  HK:{tx:"#0B7EA0",tbg:"#E6F3FA",tbd:"#78BED4"},
  SHIFT:{tx:"#5E38A0",tbg:"#F0ECF8",tbd:"#AA90D4"},
  SYS:{tx:T3,tbg:BGM,tbd:BD},
};
const tS=(tag,t)=>TAGS[tag]||{tx:EV[t]?.ac||T3,tbg:EV[t]?.bg||BGM,tbd:EV[t]?.bd||BD};

let _ID=100;
const mk=(h,m,t,title,sub,room,tag,extra={})=>({
  id:++_ID,h,m,t,title,sub,room,tag,
  ai:extra.ai||false,conf:extra.conf||null,
  prog:extra.prog!=null?extra.prog:null,
  status:extra.status||"pending",
  note:extra.note||"",starred:extra.starred||false,
  dur:extra.dur||30,
});



const FILTS=[
  {k:"all",l:"All"},{k:"arr",l:"Arrivals"},{k:"dep",l:"Departures"},
  {k:"hk",l:"Cleaning"},{k:"mnt",l:"Maint."},{k:"vip",l:"VIP"},
  {k:"ai",l:"AI Alerts"},{k:"starred",l:"★ Starred"},
];
const fmt=(h,m)=>`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
const fmtM=m=>m<=0?"Now":m<60?`${m}m`:`${Math.floor(m/60)}h ${m%60?m%60+"m":""}`.trim();
const srcL={arr:"Reservations",dep:"Check-out",hk:"Housekeeping",mnt:"Maintenance",vip:"VIP Module",shift:"HR/System",ai:"AI Engine",fnb:"F&B"};

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lora:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes nowPulse{0%,100%{box-shadow:0 0 0 0 rgba(201,152,32,.55)}55%{box-shadow:0 0 0 10px rgba(201,152,32,0)}}
@keyframes goldGlow{0%,100%{opacity:.6}50%{opacity:1}}
@keyframes urgBlink{0%,100%{border-color:rgba(192,50,66,.25)}50%{border-color:rgba(192,50,66,.9)}}
@keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
@keyframes toastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-thumb{background:${BD};border-radius:3px}
::-webkit-scrollbar-track{background:transparent}
.evCard{transition:box-shadow .18s,border-color .18s,transform .1s;cursor:pointer}
.evCard:hover{transform:translateX(2px)}
.actBtn{transition:all .14s;cursor:pointer}
.filtBtn{transition:all .12s;cursor:pointer}
.filtBtn:hover{border-color:${G}!important;color:${G}!important}
.navBtn{transition:all .12s;cursor:pointer}
.navBtn:hover{border-color:${G}!important;background:${BGM}!important}
.starBtn{transition:transform .15s;cursor:pointer;border:none;background:none;padding:0;line-height:1;font-size:14px}
.starBtn:hover{transform:scale(1.3)}
.mm-seg{cursor:pointer;transition:opacity .15s}
.mm-seg:hover{opacity:.65!important}
.stat-tile{transition:all .18s;cursor:pointer}
.stat-tile:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(27,46,66,.1)}
`;

/* ────────────────── MINIMAP ────────────────── */
function Minimap({events,nowMin,onJump}){
  const segs=useMemo(()=>events.map(e=>({
    id:e.id,top:(e.h*60+e.m)/1440*100,
    hPct:Math.max((e.dur||30)/1440*100,.5),
    color:(EV[e.t]||EV.shift).ac,past:e.h*60+e.m<nowMin,h_:e.h,
  })),[events,nowMin]);
  const nowPct=nowMin/1440*100;
  return(
    <div style={{position:"relative",width:"100%",height:196,background:BGM,borderRadius:8,overflow:"hidden",border:`1px solid ${BD}`}}>
      {[6,9,12,15,18,21].map(h=>(
        <div key={h} style={{position:"absolute",left:0,right:0,top:`${h*60/1440*100}%`,height:1,background:BS,zIndex:1,pointerEvents:"none"}}>
          <span style={{position:"absolute",left:3,top:-6,fontFamily:FM,fontSize:6,color:T4}}>{String(h).padStart(2,"0")}</span>
        </div>
      ))}
      {segs.map(s=>(
        <div key={s.id} className="mm-seg"
          style={{position:"absolute",left:20,right:2,top:`${s.top}%`,height:`${s.hPct}%`,
            background:s.color,opacity:s.past?.25:.8,borderRadius:2,zIndex:2}}
          onClick={()=>onJump(s.h_)}
          title={`Jump to ${String(s.h_).padStart(2,"0")}:00`}
        />
      ))}
      <div style={{position:"absolute",left:0,right:0,top:`${nowPct}%`,height:2,background:G,zIndex:10,boxShadow:`0 0 5px ${G}`}}>
        <span style={{position:"absolute",left:2,top:-6,fontFamily:FM,fontSize:6,color:G,fontWeight:700,letterSpacing:".05em"}}>NOW</span>
      </div>
    </div>
  );
}

/* ────────────────── ADD MODAL ────────────────── */
function AddModal({onAdd,onClose}){
  const [f,setF]=useState({t:"arr",h:"14",m:"00",title:"",room:"",sub:"",dur:"30"});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const s=EV[f.t]||EV.arr;
  const submit=()=>{
    if(!f.title.trim())return;
    onAdd({id:++_ID,h:+f.h,m:+f.m,t:f.t,title:f.title.trim(),sub:f.sub,
      room:f.room||null,tag:"",ai:false,conf:null,prog:null,
      status:"pending",note:"",starred:false,dur:+f.dur});
    onClose();
  };
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(27,46,66,.52)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .18s"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:CA,borderRadius:16,padding:26,width:430,boxShadow:"0 24px 64px rgba(0,0,0,.22)",animation:"fadeUp .2s ease"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div style={{fontFamily:FD,fontSize:22,color:N,fontWeight:600}}>Add Timeline Event</div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:T3,lineHeight:1}}>✕</button>
        </div>
        <div style={{marginBottom:14}}>
          <div style={{fontFamily:FM,fontSize:8,color:T3,letterSpacing:".12em",marginBottom:7}}>EVENT TYPE</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5}}>
            {Object.entries(EV).map(([k,ev])=>(
              <div key={k} onClick={()=>set("t",k)}
                style={{padding:"6px 5px",borderRadius:8,border:`1.5px solid ${f.t===k?ev.ac:BD}`,
                  background:f.t===k?ev.bg:CT,cursor:"pointer",textAlign:"center",transition:"all .12s"}}>
                <div style={{fontSize:13,marginBottom:2}}>{ev.icon}</div>
                <div style={{fontFamily:FM,fontSize:7.5,color:f.t===k?ev.ac:T3,letterSpacing:".04em"}}>{ev.lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,marginBottom:12}}>
          {[["Hour","h",[...Array(24)].map((_,i)=>String(i).padStart(2,"0"))],
            ["Minute","m",["00","15","30","45"]],
            ["Duration","dur",["15","30","45","60","90","120","180"]]].map(([lbl,key,opts])=>(
            <div key={key}>
              <div style={{fontFamily:FM,fontSize:8,color:T3,letterSpacing:".1em",marginBottom:4}}>{lbl.toUpperCase()}</div>
              <select value={f[key]} onChange={e=>set(key,e.target.value)}
                style={{width:"100%",border:`1px solid ${BD}`,borderRadius:7,padding:"7px 9px",fontFamily:FM,fontSize:11,color:N,background:CT,outline:"none",appearance:"none"}}>
                {opts.map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        {[["Title / Guest Name *","title","e.g. Arrival · Mr. John Smith"],
          ["Room Number","room","e.g. 204"],
          ["Details","sub","e.g. Suite · OTA · Pre-checked"]].map(([lbl,key,ph])=>(
          <div key={key} style={{marginBottom:9}}>
            <div style={{fontFamily:FM,fontSize:8,color:T3,letterSpacing:".1em",marginBottom:4}}>{lbl.toUpperCase()}</div>
            <input value={f[key]} onChange={e=>set(key,e.target.value)} placeholder={ph}
              onKeyDown={e=>e.key==="Enter"&&submit()}
              style={{width:"100%",border:`1px solid ${BD}`,borderRadius:8,padding:"8px 11px",fontFamily:FS,fontSize:12.5,color:N,background:CT,outline:"none",transition:"border-color .15s"}}
              onFocus={e=>e.target.style.borderColor=s.ac}
              onBlur={e=>e.target.style.borderColor=BD}/>
          </div>
        ))}
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:18}}>
          <button onClick={onClose} style={{padding:"8px 18px",background:CT,border:`1px solid ${BD}`,borderRadius:8,fontFamily:FM,fontSize:9.5,color:T2,cursor:"pointer"}}>Cancel</button>
          <button onClick={submit} style={{padding:"8px 20px",background:N,border:"none",borderRadius:8,fontFamily:FM,fontSize:9.5,color:"#fff",cursor:"pointer",letterSpacing:".06em",opacity:f.title.trim()?1:.4,transition:"opacity .15s"}}>
            Add to Timeline
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────── SHORTCUTS ────────────────── */
function ShortcutsPanel({onClose}){
  const rows=[
    ["/","Focus search"],["Esc","Dismiss / clear"],["N","New event"],
    ["J","Jump to NOW"],["1–8","Switch filter tab"],["★","Star/unstar event"],
    ["Enter","Expand / collapse card"],["?","This panel"],
  ];
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.42)",zIndex:700,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .18s"}}
      onClick={onClose}>
      <div style={{background:CA,borderRadius:14,padding:24,width:340,boxShadow:"0 20px 50px rgba(0,0,0,.22)",animation:"fadeUp .2s ease"}}
        onClick={e=>e.stopPropagation()}>
        <div style={{fontFamily:FD,fontSize:21,color:N,fontWeight:600,marginBottom:14}}>Keyboard Shortcuts</div>
        {rows.map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${BS}`}}>
            <kbd style={{fontFamily:FM,fontSize:10,background:BGM,border:`1px solid ${BD}`,borderRadius:5,padding:"2px 9px",color:N}}>{k}</kbd>
            <span style={{fontFamily:FS,fontSize:12,color:T2}}>{v}</span>
          </div>
        ))}
        <button onClick={onClose} style={{marginTop:16,width:"100%",padding:"9px",background:N,border:"none",borderRadius:8,fontFamily:FM,fontSize:9.5,color:"#fff",cursor:"pointer",letterSpacing:".06em"}}>Got it</button>
      </div>
    </div>
  );
}

/* ────────────────── SWIMLANE ────────────────── */
function SwimLane({events,nowHour,onSelect}){
  const lanes=Object.keys(EV);
  const hours=[...Array(18)].map((_,i)=>i+6);
  return(
    <div style={{flex:1,overflowY:"auto",padding:"14px 18px"}}>
      <div style={{overflowX:"auto"}}>
        <table style={{borderCollapse:"collapse",minWidth:860,width:"100%"}}>
          <thead>
            <tr style={{position:"sticky",top:0,zIndex:20,background:BG}}>
              <th style={{width:80,padding:"7px 10px",borderBottom:`2px solid ${BD}`,fontFamily:FM,fontSize:8,color:T4,letterSpacing:".12em",textAlign:"left"}}>HOUR</th>
              {lanes.map(k=>{const ev=EV[k];return(
                <th key={k} style={{padding:"7px 8px",borderBottom:`2px solid ${BD}`,borderLeft:`1px solid ${BS}`,fontFamily:FM,fontSize:7.5,color:ev.ac,letterSpacing:".09em",textAlign:"center",whiteSpace:"nowrap"}}>
                  {ev.icon} {ev.lbl.toUpperCase()}
                </th>
              );})}
            </tr>
          </thead>
          <tbody>
            {hours.map(h=>{
              const isNow=h===nowHour,isPast=h<nowHour;
              return(
                <tr key={h} style={{background:isNow?GB:h%2===0?CT:CA,borderBottom:`1px solid ${BS}`,opacity:isPast?.62:1}}>
                  <td style={{padding:"7px 10px",fontFamily:FM,fontSize:11,fontWeight:600,color:isNow?G:T3,whiteSpace:"nowrap",verticalAlign:"middle"}}>
                    {String(h).padStart(2,"0")}:00
                    {isNow&&<span style={{display:"inline-block",width:5,height:5,borderRadius:"50%",background:G,marginLeft:5,verticalAlign:"middle",animation:"nowPulse 2s infinite"}}/>}
                  </td>
                  {lanes.map(k=>{
                    const cells=events.filter(e=>e.h===h&&(k==="vip"?e.t==="vip"||e.tag==="VIP":e.t===k));
                    const s=EV[k];
                    return(
                      <td key={k} style={{padding:"4px 5px",borderLeft:`1px solid ${BS}`,verticalAlign:"top",minWidth:110}}>
                        {cells.map(ev=>(
                          <div key={ev.id} onClick={()=>onSelect(ev)}
                            style={{background:s.bg,border:`1px solid ${s.bd}`,borderLeft:`2.5px solid ${s.ac}`,borderRadius:5,
                              padding:"3px 7px",marginBottom:3,cursor:"pointer",fontSize:9.5,fontFamily:FS,color:s.ac,
                              whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:130,
                              opacity:ev.status==="done"?.45:1,textDecoration:ev.status==="done"?"line-through":"none",
                              transition:"all .14s"}}>
                            {fmt(ev.h,ev.m)} {ev.title.split("·")[0].trim()}
                            {ev.room&&<span style={{fontFamily:FM,fontSize:8,color:T3,marginLeft:4}}>Rm{ev.room}</span>}
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ════════════════════════ MAIN ════════════════════════════════ */
export default function OpsTimeline(){
  const [clock,setClock]=useState(new Date());
  const [filt,setFilt]=useState("all");
  const [search,setSearch]=useState("");
  const [exp,setExp]=useState(null);
  const [toast,setToast]=useState(null);
  const [events,setEvents]=useState([]);
 const [hkP, setHkP] = useState({});
  const [showJump,setShowJump]=useState(false);
  const [view,setView]=useState("timeline");
  const [showAdd,setShowAdd]=useState(false);
  const [showKeys,setShowKeys]=useState(false);
  const [editNote,setEditNote]=useState(null);
  const [noteVal,setNoteVal]=useState("");
  const nowRef=useRef(null),scrollRef=useRef(null),srchRef=useRef(null);

  useEffect(()=>{const id=setInterval(()=>setClock(new Date()),1000);return()=>clearInterval(id);},[]);
useEffect(() => {
  fetch("http://localhost:5000/api/timeline")
    .then(res => res.json())
    .then(data => {
      // 🔥 Add default UI fields (important)
      const formatted = data.map(e => ({
        ...e,
        tag: "",
        prog: null,
        note: "",
        starred: false
      }));

      setEvents(formatted);
    })
    .catch(err => console.error("Error fetching timeline:", err));
}, []);
  useEffect(()=>{
    const id=setInterval(()=>{
      setHkP(p=>{
        const nx={...p};
        events.forEach(e=>{
          if(e.prog!=null&&e.t==="hk"&&e.status==="inprogress"){
            const nm=new Date().getHours()*60+new Date().getMinutes();
            if(e.h*60+e.m<=nm&&(nx[e.id]||0)<100)nx[e.id]=Math.min(100,(nx[e.id]||0)+Math.random()*.8);
          }
        });
        return nx;
      });
    },3800);
    return()=>clearInterval(id);
  },[events]);

  useEffect(()=>{const t=setTimeout(()=>nowRef.current?.scrollIntoView({behavior:"smooth",block:"center"}),420);return()=>clearTimeout(t);},[]);

  useEffect(()=>{
    const el=scrollRef.current;if(!el)return;
    const h=()=>{const r=nowRef.current?.getBoundingClientRect();setShowJump(r?(r.top<-50||r.top>window.innerHeight+50):false);};
    el.addEventListener("scroll",h,{passive:true});
    return()=>el.removeEventListener("scroll",h);
  },[]);

  useEffect(()=>{
    const h=e=>{
      if(showAdd||showKeys)return;
      const tag=document.activeElement?.tagName;
      if(tag==="INPUT"||tag==="TEXTAREA"){if(e.key==="Escape"){document.activeElement.blur();setSearch("");}return;}
      if(e.key==="Escape"){setExp(null);setSearch("");return;}
      if(e.key==="/"){e.preventDefault();srchRef.current?.focus();return;}
      if(e.key==="n"||e.key==="N"){e.preventDefault();setShowAdd(true);return;}
      if(e.key==="j"||e.key==="J"){nowRef.current?.scrollIntoView({behavior:"smooth",block:"center"});return;}
      if(e.key==="?"){setShowKeys(true);return;}
      const fks=["all","arr","dep","hk","mnt","vip","ai","starred"];
      if(e.key>="1"&&e.key<="8"){const f=fks[+e.key-1];if(f)setFilt(f);}
    };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[showAdd,showKeys]);

  const fire=useCallback(msg=>{setToast(msg);setTimeout(()=>setToast(null),2600);},[]);

  const nowMin=clock.getHours()*60+clock.getMinutes();
  const timeStr=clock.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const dayPct=Math.min(100,Math.round(nowMin/1440*100));

  const allEvs=useMemo(()=>events.map(e=>({
    ...e,prog:hkP[e.id]??e.prog,min:e.h*60+e.m,past:e.h*60+e.m<nowMin,
  })).sort((a,b)=>a.min-b.min),[events,hkP,nowMin]);

  const q=search.trim().toLowerCase();
  const filtered=useMemo(()=>{
    let base=allEvs;
    if(filt==="starred") base=base.filter(e=>e.starred);
    else if(filt==="vip") base=base.filter(e=>e.t==="vip"||e.tag==="VIP");
    else if(filt!=="all") base=base.filter(e=>e.t===filt);
    if(q) base=base.filter(e=>[e.title,e.sub||"",e.room||"",e.tag||"",e.note||""].join(" ").toLowerCase().includes(q));
    return base;
  },[allEvs,filt,q]);

  const hours=useMemo(()=>{
    const h={};filtered.forEach(e=>{if(!h[e.h])h[e.h]=[];h[e.h].push(e);});return h;
  },[filtered]);

  const nextUp=allEvs.find(e=>!e.past&&e.status!=="done"&&e.status!=="deferred");
  const mToNext=nextUp?nextUp.min-nowMin:null;

  const upd=(id,patch)=>setEvents(es=>es.map(e=>e.id===id?{...e,...patch}:e));
  const toggleDone=id=>{const e=events.find(x=>x.id===id);upd(id,{status:e?.status==="done"?"pending":"done"});};
  const toggleStar=id=>upd(id,{starred:!events.find(e=>e.id===id)?.starred});
  const setStatus=(id,s)=>upd(id,{status:s});
  const defer=id=>{const e=events.find(x=>x.id===id);if(e)upd(id,{h:Math.min(23,e.h+1),status:"deferred"});fire("Event deferred +1 hour");};
  const saveNote=(id,n)=>{upd(id,{note:n});setEditNote(null);fire("Note saved");};
  const addEvent=ev=>{setEvents(es=>[...es,ev]);fire(`Added: ${ev.title}`);};

  const jumpTo=h=>{
    if(view==="swimlane"){setView("timeline");setTimeout(()=>jumpTo_(h),80);}else jumpTo_(h);
  };
  const jumpTo_=h=>{
    if(!scrollRef.current)return;
    const rows=scrollRef.current.querySelectorAll("[data-hour]");
    const row=Array.from(rows).find(r=>+r.dataset.hour===h);
    row?.scrollIntoView({behavior:"smooth",block:"center"});
  };

  const stats=useMemo(()=>["arr","dep","hk","mnt"].map(k=>{
    const s=EV[k],all=allEvs.filter(e=>e.t===k),done=all.filter(e=>e.past||e.status==="done"),pct=all.length?Math.round(done.length/all.length*100):0;
    return{k,s,all,done,pct};
  }),[allEvs]);

  /* ── single event card ── */
  const Card=({ev,idx})=>{
    const s=EV[ev.t]||EV.shift;
    const isExp=exp===ev.id;
    const {tx,tbg,tbd}=tS(ev.tag,ev.t);
    const urg=!ev.past&&ev.min-nowMin>0&&ev.min-nowMin<30;
    const prog=ev.prog!=null?Math.round(ev.prog):null;
    const isDone=ev.status==="done",isDeferred=ev.status==="deferred",isInP=ev.status==="inprogress";
    return(
      <div style={{display:"flex",gap:0,marginBottom:5,opacity:isDone?.42:isDeferred?.38:ev.past?.56:1,animation:`fadeUp .28s ease ${Math.min(idx,5)*30}ms both`}}>
        <div style={{width:62,paddingRight:6,flexShrink:0,textAlign:"right",paddingTop:11}}>
          <span style={{fontFamily:FM,fontSize:10,color:ev.past?T4:T2,letterSpacing:".03em"}}>{fmt(ev.h,ev.m)}</span>
          {isDeferred&&<div style={{fontFamily:FM,fontSize:7.5,color:G,marginTop:1,lineHeight:1}}>deferred</div>}
        </div>
        <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,marginTop:8,marginLeft:-9,zIndex:2,
          background:isDone?"#1A7E4C":isInP?s.ac:ev.past?BGD:s.bg,
          border:`2px solid ${isDone?"#1A7E4C":isInP?s.ac:ev.past?BS:s.ac}`,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:8.5,lineHeight:1,
          boxShadow:isInP?`0 0 0 3px ${s.ac}22,0 0 9px ${s.ac}44`:"none"}}>
          {isDone?"✓":s.icon}
        </div>
        <div style={{flex:1,marginLeft:12}}>
          <div className="evCard" tabIndex={0}
            onKeyDown={e=>e.key==="Enter"&&setExp(isExp?null:ev.id)}
            onClick={()=>setExp(isExp?null:ev.id)}
            style={{background:isDone?CT:ev.past?CT:CA,
              border:`1.5px solid ${urg?"transparent":isExp?s.ac:isInP?s.ac:ev.past?BS:s.bd}`,
              borderLeft:`3px solid ${isDone?"#1A7E4C":isDeferred?G:ev.past?BD:s.ac}`,
              borderRadius:10,padding:isExp?"12px 14px 15px":"9px 13px",outline:"none",
              animation:urg?"urgBlink 1.9s ease-in-out infinite":"none",
              boxShadow:isInP?`0 0 0 2.5px ${s.ac}18,0 2px 12px ${s.ac}14`:isExp?`0 5px 22px ${s.ac}18`:"0 1px 5px rgba(27,46,66,.04)"}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3,flexWrap:"wrap"}}>
                  <span style={{fontFamily:FS,fontSize:13,fontWeight:600,color:isDone?T3:ev.past?T2:N,lineHeight:1.25,textDecoration:isDone?"line-through":"none"}}>{ev.title}</span>
                  {ev.starred&&<span style={{fontSize:11,color:G}}>★</span>}
                  {ev.tag&&<span style={{fontSize:8,fontFamily:FM,fontWeight:700,padding:"1.5px 7px",borderRadius:20,background:tbg,color:tx,border:`1px solid ${tbd}`,letterSpacing:".09em",flexShrink:0}}>{ev.tag}</span>}
                  {ev.ai&&<span style={{fontSize:8,fontFamily:FM,padding:"1.5px 7px",borderRadius:20,background:EV.ai.bg,color:EV.ai.ac,border:`1px solid ${EV.ai.bd}`,letterSpacing:".07em",flexShrink:0,display:"inline-flex",alignItems:"center",gap:4}}>✦ {ev.conf}%</span>}
                  {isInP&&<span style={{fontSize:8,fontFamily:FM,padding:"1.5px 7px",borderRadius:20,background:s.bg,color:s.ac,border:`1px solid ${s.bd}`,display:"inline-flex",alignItems:"center",gap:4,flexShrink:0}}>
                    <span style={{display:"inline-block",width:5,height:5,borderRadius:"50%",background:s.ac,animation:"nowPulse 1.5s infinite"}}/>IN PROGRESS
                  </span>}
                  {urg&&<span style={{fontSize:8,fontFamily:FM,padding:"1.5px 7px",borderRadius:20,background:"#FDF0F1",color:"#C03242",border:"1px solid #E09AA4",flexShrink:0,animation:"goldGlow 1.1s ease-in-out infinite"}}>⚡ {fmtM(ev.min-nowMin)}</span>}
                </div>
                <div style={{fontSize:11,fontFamily:FS,color:T3,lineHeight:1.45}}>{ev.sub}</div>
                {ev.note&&<div style={{marginTop:4,fontSize:10,fontFamily:FM,color:T2,background:BGM,padding:"3px 8px",borderRadius:5,border:`1px solid ${BD}`,lineHeight:1.4}}>📝 {ev.note}</div>}
                {prog!=null&&!isDone&&(
                  <div style={{marginTop:7,display:"flex",alignItems:"center",gap:7}}>
                    <div style={{flex:1,height:4,background:BGM,borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${prog}%`,borderRadius:3,transition:"width 1.4s ease",
                        background:prog===100?"#1A7E4C":s.ac,
                        backgroundImage:prog<100?`linear-gradient(90deg,${s.ac},${s.bg}88,${s.ac})`:"none",
                        backgroundSize:"200% auto",animation:prog<100?"shimmer 2.2s linear infinite":"none"}}/>
                    </div>
                    <span style={{fontSize:9,fontFamily:FM,color:prog===100?"#1A7E4C":s.ac,fontWeight:600,flexShrink:0,minWidth:32}}>
                      {prog===100?"✓ Done":`${Math.round(prog)}%`}
                    </span>
                  </div>
                )}
              </div>
              <div style={{display:"flex",gap:4,alignItems:"center",flexShrink:0,paddingTop:2}}>
                {ev.room&&<span style={{fontFamily:FM,fontSize:10,color:s.ac,background:s.bg,border:`1px solid ${s.bd}`,padding:"3px 10px",borderRadius:20,whiteSpace:"nowrap"}}>Rm {ev.room}</span>}
                <button className="starBtn" onClick={e=>{e.stopPropagation();toggleStar(ev.id);}} title="Star">{ev.starred?"★":"☆"}</button>
                <span style={{fontSize:15,color:T4,transform:isExp?"rotate(90deg)":"none",transition:"transform .2s",lineHeight:1}}>›</span>
              </div>
            </div>

            {isExp&&<div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${BS}`,animation:"fadeUp .2s ease"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:11}}>
                {[["Type",s.lbl],["Time",fmt(ev.h,ev.m)],["Duration",`${ev.dur}m`],
                  ["Room",ev.room||"—"],["Status",ev.status],["Source",srcL[ev.t]||"System"]].map(([k,v])=>(
                  <div key={k} style={{background:BG,borderRadius:7,padding:"5px 8px"}}>
                    <div style={{fontSize:7.5,fontFamily:FM,color:T4,letterSpacing:".09em",marginBottom:2}}>{k.toUpperCase()}</div>
                    <div style={{fontSize:10.5,fontFamily:FM,color:T2,fontWeight:600,textTransform:"capitalize"}}>{v}</div>
                  </div>
                ))}
              </div>
              {ev.ai&&<div style={{background:EV.ai.bg,border:`1px solid ${EV.ai.bd}`,borderRadius:8,padding:"8px 12px",marginBottom:11,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:12}}>✦</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:8,fontFamily:FM,color:EV.ai.ac,letterSpacing:".1em",marginBottom:4}}>AI PREDICTION CONFIDENCE</div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{flex:1,height:5,background:`${EV.ai.ac}20`,borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${ev.conf}%`,background:EV.ai.ac,borderRadius:3,transition:"width 1s",boxShadow:`0 0 5px ${EV.ai.ac}55`}}/>
                    </div>
                    <span style={{fontSize:14,fontFamily:FD,color:EV.ai.ac,fontWeight:600,flexShrink:0}}>{ev.conf}%</span>
                  </div>
                </div>
              </div>}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5,marginBottom:10}}>
                {[["pending","Pending","#7890A8"],["inprogress","In Progress",s.ac],["done","Done ✓","#1A7E4C"],["deferred","Defer +1h",G]].map(([st,lbl,cl])=>(
                  <button key={st} onClick={e=>{e.stopPropagation();st==="deferred"?defer(ev.id):setStatus(ev.id,st);}}
                    style={{padding:"5px 4px",borderRadius:7,border:`1.5px solid ${ev.status===st?cl:BD}`,
                      background:ev.status===st?`${cl}16`:CT,fontFamily:FM,fontSize:8,color:ev.status===st?cl:T3,
                      cursor:"pointer",transition:"all .14s",letterSpacing:".04em",textAlign:"center"}}>
                    {lbl}
                  </button>
                ))}
              </div>
              {editNote===ev.id
                ?<div style={{marginBottom:10}}>
                  <textarea autoFocus value={noteVal} onChange={e=>setNoteVal(e.target.value)}
                    placeholder="Add internal note for staff…"
                    style={{width:"100%",border:`1.5px solid ${s.ac}`,borderRadius:8,padding:"8px 11px",fontFamily:FM,fontSize:11,color:N,resize:"vertical",minHeight:58,outline:"none",background:CT}}/>
                  <div style={{display:"flex",gap:6,marginTop:5}}>
                    <button onClick={e=>{e.stopPropagation();saveNote(ev.id,noteVal);}} style={{padding:"4px 13px",background:N,color:"#fff",border:"none",borderRadius:6,fontFamily:FM,fontSize:9,cursor:"pointer"}}>Save</button>
                    <button onClick={e=>{e.stopPropagation();setEditNote(null);}} style={{padding:"4px 13px",background:CT,color:T3,border:`1px solid ${BD}`,borderRadius:6,fontFamily:FM,fontSize:9,cursor:"pointer"}}>Cancel</button>
                  </div>
                </div>
                :<button onClick={e=>{e.stopPropagation();setEditNote(ev.id);setNoteVal(ev.note||"");}}
                  style={{width:"100%",marginBottom:10,padding:"5px 11px",background:BGM,border:`1px solid ${BD}`,borderRadius:7,fontFamily:FM,fontSize:9,color:T2,cursor:"pointer",textAlign:"left",transition:"border-color .14s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=s.ac}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=BD}>
                  📝 {ev.note?"Edit note":"Add internal note"}
                </button>
              }
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {[ev.past?"View record":s.cta,"View room",ev.ai?"AI analysis":null].filter(Boolean).map(btn=>(
                  <button key={btn} className="actBtn" onClick={e=>{e.stopPropagation();fire(`→ ${btn}: ${ev.title.split("·")[0].trim()}`);}}
                    style={{padding:"5px 12px",background:"none",border:`1px solid ${s.ac}55`,borderRadius:7,fontFamily:FM,fontSize:9,color:s.ac,letterSpacing:".06em"}}
                    onMouseEnter={e=>e.currentTarget.style.background=`${s.ac}10`}
                    onMouseLeave={e=>e.currentTarget.style.background="none"}>
                    {btn} →
                  </button>
                ))}
                <button className="actBtn" onClick={e=>{e.stopPropagation();toggleDone(ev.id);}}
                  style={{padding:"5px 12px",background:isDone?"#E6F5EE":"none",border:"1px solid #88C9A4",borderRadius:7,fontFamily:FM,fontSize:9,color:"#1A7E4C",letterSpacing:".06em"}}>
                  {isDone?"↩ Undo done":"✓ Mark done"}
                </button>
              </div>
            </div>}
          </div>
        </div>
      </div>
    );
  };

  return(
    <div style={{height:"100vh",background:BG,display:"flex",flexDirection:"column",fontFamily:FS,overflow:"hidden",position:"relative"}}>
      <style>{CSS}</style>

      {/* ══ TOPBAR ══ */}
      <div style={{background:N,flexShrink:0,boxShadow:"0 2px 20px rgba(0,0,0,.26)"}}>
        <div style={{height:54,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 18px",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{position:"relative",width:28,height:28,flexShrink:0}}>
              <svg width="28" height="28" style={{position:"absolute"}}>
                <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="2.5"/>
                <circle cx="14" cy="14" r="11" fill="none" stroke={G} strokeWidth="2.5"
                  strokeDasharray={`${dayPct*.692} 69.2`} strokeLinecap="round" strokeDashoffset="17.3"
                  style={{transition:"stroke-dasharray 1s ease"}}/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,fontFamily:FM,color:G,fontWeight:700}}>{dayPct}%</div>
            </div>
            <div>
              <div style={{fontFamily:FD,fontSize:18,color:"#F5EDDA",letterSpacing:".04em",lineHeight:1}}>Grand Aurum</div>
              <div style={{fontFamily:FM,fontSize:7.5,color:"rgba(255,255,255,.28)",letterSpacing:".18em",marginTop:1}}>OPERATIONS TIMELINE</div>
            </div>
          </div>

          <div style={{flex:1,maxWidth:300,position:"relative"}}>
            <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:11,color:"rgba(255,255,255,.3)",pointerEvents:"none"}}>⌕</span>
            <input ref={srchRef} value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search rooms, guests, events… ( / )"
              style={{width:"100%",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)",borderRadius:8,padding:"7px 28px",fontFamily:FM,fontSize:9.5,color:"rgba(255,255,255,.75)",outline:"none",caretColor:G}}
              onFocus={e=>{e.target.style.background="rgba(255,255,255,.13)";e.target.style.borderColor=`${G}66`;}}
              onBlur={e=>{e.target.style.background="rgba(255,255,255,.08)";e.target.style.borderColor="rgba(255,255,255,.12)";}}/>
            {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,.4)",fontSize:13,lineHeight:1}}>✕</button>}
          </div>

          {nextUp&&<div style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.07)",borderRadius:9,padding:"6px 13px",flexShrink:0,border:"1px solid rgba(255,255,255,.06)"}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:G,flexShrink:0,animation:mToNext<30?"urgBlink 1.2s ease-in-out infinite":"goldGlow 2s ease-in-out infinite"}}/>
            <span style={{fontFamily:FM,fontSize:9,color:"rgba(255,255,255,.38)",letterSpacing:".06em"}}>NEXT</span>
            <span style={{fontFamily:FM,fontSize:10.5,color:G}}>{fmt(nextUp.h,nextUp.m)} · {nextUp.title.split("·")[0].trim()}</span>
            <span style={{fontFamily:FM,fontSize:9.5,color:mToNext<30?"rgba(230,140,148,.9)":"rgba(255,255,255,.3)"}}>{fmtM(mToNext)}</span>
          </div>}

          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            <div style={{display:"flex",background:"rgba(255,255,255,.07)",borderRadius:8,padding:2,gap:1}}>
              {[["timeline","≡ Timeline"],["swimlane","⊞ Swimlane"]].map(([v,l])=>(
                <button key={v} onClick={()=>setView(v)}
                  style={{padding:"4px 10px",borderRadius:6,background:view===v?"rgba(255,255,255,.14)":"transparent",border:"none",fontFamily:FM,fontSize:8.5,color:view===v?"#fff":"rgba(255,255,255,.35)",cursor:"pointer",transition:"all .15s"}}>
                  {l}
                </button>
              ))}
            </div>
            <button onClick={()=>setShowAdd(true)}
              style={{padding:"6px 13px",background:G,border:"none",borderRadius:8,fontFamily:FM,fontSize:9.5,color:N,fontWeight:700,cursor:"pointer",letterSpacing:".04em",transition:"opacity .15s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              + Add Event
            </button>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:FM,fontSize:13,color:"rgba(255,255,255,.72)",letterSpacing:".05em",lineHeight:1}}>{timeStr}</div>
              <div style={{fontFamily:FM,fontSize:7.5,color:"rgba(255,255,255,.26)",marginTop:2}}>{clock.toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})}</div>
            </div>
            <button onClick={()=>setShowKeys(true)} title="Shortcuts (?)"
              style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.14)",color:"rgba(255,255,255,.5)",cursor:"pointer",fontFamily:FM,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.18)";e.currentTarget.style.color="#fff";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.1)";e.currentTarget.style.color="rgba(255,255,255,.5)";}}>
              ?
            </button>
          </div>
        </div>

        {/* Filter + mini progress */}
        <div style={{background:NM,height:35,display:"flex",alignItems:"center",padding:"0 16px",gap:3,flexShrink:0}}>
          {FILTS.map((f,fi)=>{
            const cnt=f.k==="all"?allEvs.length:f.k==="starred"?allEvs.filter(e=>e.starred).length:f.k==="vip"?allEvs.filter(e=>e.t==="vip"||e.tag==="VIP").length:allEvs.filter(e=>e.t===f.k).length;
            const on=filt===f.k;
            return<button key={f.k} className="filtBtn" onClick={()=>setFilt(f.k)}
              style={{padding:"3px 11px",borderRadius:20,border:`1px solid ${on?G:"rgba(255,255,255,.1)"}`,background:on?"rgba(201,152,32,.18)":"transparent",fontFamily:FM,fontSize:8.5,letterSpacing:".07em",cursor:"pointer",color:on?G:"rgba(255,255,255,.35)",position:"relative",transition:"all .12s"}}>
              {f.l} <span style={{opacity:.5,fontSize:7.8}}>({cnt})</span>
              <span style={{position:"absolute",top:0,right:0,fontFamily:FM,fontSize:5.5,color:"rgba(255,255,255,.14)"}}>{fi+1}</span>
            </button>;
          })}
          <div style={{marginLeft:"auto",display:"flex",gap:10,alignItems:"center"}}>
            {stats.map(({k,s,pct})=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:4}}>
                <span style={{fontFamily:FM,fontSize:7.5,color:"rgba(255,255,255,.28)"}}>{s.lbl.slice(0,4).toUpperCase()}</span>
                <div style={{width:30,height:3,background:"rgba(255,255,255,.1)",borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:s.ac,borderRadius:2,transition:"width 1s"}}/>
                </div>
                <span style={{fontFamily:FM,fontSize:7.5,color:s.ac}}>{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div style={{flex:1,overflow:"hidden",display:"flex"}}>

        {view==="swimlane"
          ?<SwimLane events={allEvs} nowHour={clock.getHours()} onSelect={ev=>{setView("timeline");setExp(ev.id);setTimeout(()=>jumpTo_(ev.h),80);}}/>
          :<div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:"0 0 80px"}}>
            <div style={{maxWidth:780,margin:"0 auto",padding:"18px 26px"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20,paddingBottom:14,borderBottom:`1px solid ${BD}`}}>
                <div>
                  <div style={{fontFamily:FD,fontSize:26,color:N,fontWeight:600,lineHeight:1,marginBottom:4}}>Today's Operations</div>
                  <div style={{fontFamily:FM,fontSize:9,color:T3,letterSpacing:".1em"}}>
                    {allEvs.filter(e=>e.past||e.status==="done").length} completed · {allEvs.filter(e=>!e.past&&e.status!=="done").length} upcoming
                    {q&&<span style={{color:G,marginLeft:8}}>· {filtered.length} match "{q}"</span>}
                  </div>
                </div>
                <div style={{display:"flex",gap:7,flexShrink:0}}>
                  {stats.map(({k,s,all,pct})=>(
                    <div key={k} className="stat-tile" onClick={()=>setFilt(k)}
                      style={{background:s.bg,border:`1px solid ${s.bd}`,borderRadius:10,padding:"7px 11px",textAlign:"center",minWidth:58}}>
                      <div style={{fontFamily:FD,fontSize:21,color:s.ac,lineHeight:1,marginBottom:1}}>{all.length}</div>
                      <div style={{fontSize:7.5,fontFamily:FM,color:T3,letterSpacing:".09em",marginBottom:4}}>{{arr:"Arrivals",dep:"Departs",hk:"Cleaning",mnt:"Maint."}[k]}</div>
                      <div style={{height:2.5,background:`${s.ac}22`,borderRadius:2,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${pct}%`,background:s.ac,borderRadius:2,transition:"width 1.2s"}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {filtered.length===0&&<div style={{textAlign:"center",padding:"44px 20px",animation:"fadeIn .3s ease"}}>
                <div style={{fontSize:26,marginBottom:9}}>🔍</div>
                <div style={{fontFamily:FD,fontSize:18,color:T2,marginBottom:5}}>No events match</div>
                <button onClick={()=>{setSearch("");setFilt("all");}} style={{fontFamily:FM,fontSize:9,color:G,background:"none",border:`1px solid ${G}44`,borderRadius:7,padding:"5px 13px",cursor:"pointer"}}>Clear filters</button>
              </div>}

              {filtered.length>0&&<div style={{position:"relative"}}>
                <div style={{position:"absolute",left:70,top:0,bottom:0,width:2,borderRadius:1,pointerEvents:"none",
                  background:`linear-gradient(180deg,${BS} 0%,${BD} 20%,${BD} 80%,${BS} 100%)`}}/>

                {allEvs.some(e=>!e.past)&&(
                  <div ref={nowRef} style={{display:"flex",alignItems:"center",gap:9,marginBottom:8,marginTop:4,position:"relative",zIndex:10}}>
                    <div style={{width:62,textAlign:"right",flexShrink:0}}>
                      <span style={{fontFamily:FM,fontSize:11,color:G,fontWeight:700,letterSpacing:".04em",animation:"goldGlow 2.5s ease-in-out infinite"}}>{timeStr.slice(0,5)}</span>
                    </div>
                    <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,marginLeft:-9,zIndex:6,background:G,border:`3px solid ${BG}`,animation:"nowPulse 2.8s ease-in-out infinite"}}/>
                    <div style={{background:G,color:N,borderRadius:20,padding:"4px 16px",fontFamily:FM,fontSize:9,fontWeight:700,letterSpacing:".12em",boxShadow:`0 2px 14px ${G}55`,whiteSpace:"nowrap"}}>▶ NOW</div>
                    <div style={{flex:1,height:2,background:`linear-gradient(90deg,${G}66,transparent)`,borderRadius:1}}/>
                  </div>
                )}

                {Object.keys(hours).sort((a,b)=>+a-+b).map(hStr=>{
                  const h=+hStr,isPast=h<clock.getHours(),isNow=clock.getHours()===h;
                  return(
                    <div key={h} data-hour={h} style={{position:"relative",marginBottom:2}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,marginTop:10}}>
                        <div style={{width:62,textAlign:"right",flexShrink:0}}>
                          <span style={{fontFamily:FM,fontSize:11.5,fontWeight:600,color:isPast?T4:isNow?G:N}}>{String(h).padStart(2,"0")}:00</span>
                        </div>
                        <div style={{width:14,height:14,borderRadius:"50%",flexShrink:0,marginLeft:-6,zIndex:2,
                          background:isPast?BGD:isNow?G:CT,border:`2px solid ${isPast?BS:isNow?GP:BD}`}}/>
                        <div style={{flex:1,height:1,background:BS}}/>
                        <span style={{fontSize:7.5,fontFamily:FM,color:T4,flexShrink:0}}>{hours[h].length} ev</span>
                      </div>
                      {hours[h].map((ev,ei)=><Card key={ev.id} ev={ev} idx={ei}/>)}
                    </div>
                  );
                })}
              </div>}
            </div>
          </div>
        }

        {/* ══ RIGHT PANEL ══ */}
        <div style={{width:250,background:CT,borderLeft:`1.5px solid ${BD}`,display:"flex",flexDirection:"column",overflow:"hidden",flexShrink:0}}>
          <div style={{padding:"12px 12px 10px",borderBottom:`1px solid ${BS}`,flexShrink:0}}>
            <div style={{fontFamily:FD,fontSize:15,color:N,fontWeight:600,marginBottom:8}}>Today's Summary</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {stats.map(({k,s,all,done,pct})=>(
                <div key={k} className="stat-tile" onClick={()=>setFilt(k)}
                  style={{background:CA,border:`1px solid ${BD}`,borderRadius:9,padding:"8px 10px"}}>
                  <div style={{fontFamily:FD,fontSize:21,color:s.ac,lineHeight:1,marginBottom:1}}>{all.length}</div>
                  <div style={{fontSize:7.5,fontFamily:FM,color:T3,letterSpacing:".09em",marginBottom:5}}>{{arr:"ARRIVALS",dep:"DEPARTS",hk:"CLEANING",mnt:"MAINT."}[k]}</div>
                  <div style={{height:3,background:BGM,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:s.ac,borderRadius:2,transition:"width 1.2s"}}/></div>
                  <div style={{fontSize:8,fontFamily:FM,color:T3,marginTop:3}}>{done.length}/{all.length} · {pct}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Minimap */}
          <div style={{padding:"10px 12px",borderBottom:`1px solid ${BS}`,flexShrink:0}}>
            <div style={{fontSize:7.5,fontFamily:FM,color:T4,letterSpacing:".14em",marginBottom:6}}>DAY MAP · click to jump</div>
            <Minimap events={allEvs} nowMin={nowMin} onJump={jumpTo_}/>
          </div>

          {/* Next up */}
          <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
            <div style={{padding:"9px 12px 5px",flexShrink:0}}>
              <div style={{fontSize:7.5,fontFamily:FM,color:T4,letterSpacing:".14em"}}>NEXT UP</div>
            </div>
            <div style={{overflowY:"auto",padding:"2px 12px 8px"}}>
              {allEvs.filter(e=>!e.past&&e.status!=="done"&&e.status!=="deferred").slice(0,10).map((ev,i)=>{
                const s=EV[ev.t]||EV.shift,mA=ev.min-nowMin,urg=mA<30;
                return<div key={ev.id}
                  onClick={()=>{if(view==="swimlane")setView("timeline");setExp(ev.id);setTimeout(()=>jumpTo_(ev.h),60);}}
                  style={{display:"flex",alignItems:"center",gap:7,padding:"6px 0",borderBottom:`1px solid ${BS}`,cursor:"pointer",animation:`fadeUp .28s ease ${i*35}ms both`,transition:"opacity .12s"}}
                  onMouseEnter={e=>e.currentTarget.style.opacity=".68"}
                  onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                  <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,background:s.bg,border:`1.5px solid ${s.bd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9}}>{s.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:10.5,fontFamily:FS,color:N,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",lineHeight:1.2}}>{ev.title.split("·")[0].trim()}</div>
                    <div style={{fontSize:8.5,fontFamily:FM,color:T3}}>{fmt(ev.h,ev.m)}{ev.room?` · Rm ${ev.room}`:""}</div>
                  </div>
                  <div style={{fontSize:10,fontFamily:FM,flexShrink:0,fontWeight:urg?700:400,color:urg?"#C03242":mA<90?"#B87418":T4,animation:urg?"goldGlow 1s ease-in-out infinite":"none",minWidth:30,textAlign:"right"}}>{fmtM(mA)}</div>
                </div>;
              })}
            </div>
          </div>

          {/* Nav */}
          <div style={{padding:"9px 11px 12px",borderTop:`1px solid ${BD}`,flexShrink:0}}>
            <div style={{fontSize:7.5,fontFamily:FM,color:T4,letterSpacing:".14em",marginBottom:6}}>NAVIGATE</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
              {["Command Center","Floor Map","Check-In","HK Board","AI Engine","Reservations"].map(nm=>(
                <button key={nm} className="navBtn" onClick={()=>fire(`→ ${nm}`)}
                  style={{padding:"5px 7px",background:CA,border:`1px solid ${BD}`,borderRadius:6,fontFamily:FM,fontSize:8.5,color:T2,cursor:"pointer",textAlign:"left",letterSpacing:".03em"}}>
                  {nm}
                </button>
              ))}
            </div>
            <div style={{marginTop:8,textAlign:"center",fontFamily:FM,fontSize:7.5,color:T5,letterSpacing:".04em",cursor:"pointer"}}
              onClick={()=>setShowKeys(true)}>
              Press <kbd style={{background:BGM,border:`1px solid ${BD}`,borderRadius:3,padding:"0 4px",fontFamily:FM,fontSize:7}}>?</kbd> for shortcuts
            </div>
          </div>
        </div>
      </div>

      {showJump&&<button onClick={()=>nowRef.current?.scrollIntoView({behavior:"smooth",block:"center"})}
        style={{position:"fixed",bottom:22,left:"50%",transform:"translateX(-50%)",zIndex:100,background:N,color:G,border:`1.5px solid ${G}55`,borderRadius:24,padding:"8px 20px",fontFamily:FM,fontSize:10,letterSpacing:".1em",cursor:"pointer",boxShadow:"0 4px 20px rgba(0,0,0,.3)",animation:"fadeUp .25s ease",display:"flex",alignItems:"center",gap:7}}>
        <span style={{animation:"goldGlow 1.5s ease-in-out infinite"}}>◎</span> Jump to NOW
      </button>}

      {toast&&<div style={{position:"fixed",bottom:22,right:266,zIndex:999,background:N,border:"1px solid rgba(255,255,255,.12)",color:"rgba(255,255,255,.88)",padding:"10px 18px",borderRadius:10,fontFamily:FM,fontSize:11,letterSpacing:".06em",boxShadow:"0 6px 28px rgba(0,0,0,.22)",animation:"toastIn .22s ease",display:"flex",alignItems:"center",gap:8}}>
        <span style={{color:G}}>✓</span> {toast}
      </div>}

      {showAdd&&<AddModal onAdd={addEvent} onClose={()=>setShowAdd(false)}/>}
      {showKeys&&<ShortcutsPanel onClose={()=>setShowKeys(false)}/>}
    </div>
  );
}
