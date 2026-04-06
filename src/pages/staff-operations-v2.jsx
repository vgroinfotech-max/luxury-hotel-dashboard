import { useState, useMemo, useCallback, useRef, useEffect } from "react";

/* ═══════════════════ DESIGN TOKENS ══════════════════════════ */
const C = {
  bg:"#F2EDE4",bgL:"#FAF7F2",bgM:"#EAE3D8",bgD:"#E0D8CC",
  navy:"#1C2B3A",navyM:"#243648",navyL:"#2E4258",
  gold:"#C8920C",goldL:"#FBF0D8",goldD:"#8A6408",
  amber:"#D97706",amberL:"#FEF3C7",amberD:"#92400E",
  teal:"#0D7490",tealL:"#E0F4F8",tealD:"#0A5568",
  green:"#166534",greenL:"#DCFCE7",greenD:"#14532D",
  red:"#B91C1C",redL:"#FEE2E2",redD:"#7F1D1D",
  blue:"#1E40AF",blueL:"#DBEAFE",blueD:"#1E3A8A",
  purple:"#6D28D9",purpleL:"#EDE9FE",purpleD:"#4C1D95",
  rose:"#BE185D",roseL:"#FCE7F3",
  border:"#D8D0C0",borderL:"#E4DDD0",
  t1:"#1C2B3A",t2:"#3A4E62",t3:"#6B7E94",t4:"#9AAABB",
  white:"#FFFFFF",
};
const F={serif:"'Cormorant Garamond',Georgia,serif",sans:"'Outfit',sans-serif",mono:"'JetBrains Mono','Courier New',monospace"};

/* ═══════════════════ CONFIG ════════════════════════════════ */
const DEPTS={
  Management:{color:C.gold,bg:C.goldL,border:C.gold,icon:"👑"},
  "Front Desk":{color:C.teal,bg:C.tealL,border:C.teal,icon:"🛎"},
  Housekeeping:{color:C.purple,bg:C.purpleL,border:C.purple,icon:"🧹"},
  Maintenance:{color:C.amber,bg:C.amberL,border:C.amber,icon:"🔧"},
  Concierge:{color:C.blue,bg:C.blueL,border:C.blue,icon:"✦"},
  "F&B":{color:C.rose,bg:C.roseL,border:C.rose,icon:"🍽"},
};
const SHIFTS={
  Morning:{color:C.gold,label:"Morning",time:"06:00–14:00",icon:"🌅"},
  Afternoon:{color:C.teal,label:"Afternoon",time:"14:00–22:00",icon:"☀"},
  Night:{color:C.blue,label:"Night",time:"22:00–06:00",icon:"🌙"},
  "Off":{color:C.t4,label:"Day Off",time:"—",icon:"💤"},
};
const STATUSES={
  "On Shift":{color:C.green,bg:C.greenL,dot:C.green},
  "On Call":{color:C.amber,bg:C.amberL,dot:C.amber},
  "Off Duty":{color:C.t3,bg:C.bgD,dot:C.t4},
  "Break":{color:C.blue,bg:C.blueL,dot:C.blue},
};

/* ═══════════════════ EXTENDED STAFF DATA ══════════════════ */
const STAFF=[
  {id:1,name:"Priya Kapoor",role:"General Manager",dept:"Management",shift:"Morning",status:"On Shift",photo:"https://randomuser.me/api/portraits/women/65.jpg",phone:"+91 98100 10001",email:"priya.kapoor@grandaurum.com",joined:"Jan 2019",rating:4.9,tasksToday:14,tasksTotal:3280,roomsCleaned:0,avgResponse:"3 min",permissions:["all"],reportTo:"—",hierarchy:"GM",
    docs:{
      aadhar:{number:"2234 5678 9012",verified:true,uploaded:"10 Jan 2019"},
      passport:{number:"Z1122334",expiry:"15 Aug 2029",issueDate:"16 Aug 2019",country:"India",verified:true,uploaded:"10 Jan 2019"},
      dl:{number:"MH02-20140012345",type:"LMV",expiry:"14 Mar 2028",issueState:"Maharashtra",verified:true,uploaded:"12 Jan 2019"},
      iqama:null,
    },
    address:{permanent:"12, Shyam Nagar, Sector 4, Jaipur, Rajasthan – 302004",local:"Flat 204, Green Heights, Andheri West, Mumbai – 400058"},
    visa:{type:"N/A – Indian National",period:"—",expiry:"—",daysLeft:null},
    salary:{basic:180000,hra:72000,allowances:28000,total:280000,currency:"INR",cycle:"Monthly"},
    benefits:{insurance:"Group Medical ₹10L + Family",flightTickets:"2 business class/year",accommodation:"Hotel subsidised 40%",other:["Performance bonus 20%","Mobile allowance ₹3,000/mo","Meal allowance"]},
    leaves:{total:30,taken:8,balance:22,types:{casual:7,sick:14,earned:9},history:[{date:"12 Jan 2025",type:"Casual",days:2,reason:"Personal"},{date:"18 Mar 2025",type:"Sick",days:1,reason:"Fever"},{date:"5 May 2025",type:"Earned",days:5,reason:"Annual vacation"}]},
    reference:{name:"Kapil Mehta",relation:"Former GM, Taj Hotels",phone:"+91 98000 11122",email:"kapil.m@taj.com"},
    emergency:{name:"Rahul Kapoor",relation:"Spouse",phone:"+91 98111 22233"},
  },
  {id:2,name:"Arun Sharma",role:"Front Desk Lead",dept:"Front Desk",shift:"Morning",status:"On Shift",photo:"https://randomuser.me/api/portraits/men/41.jpg",phone:"+91 98200 10002",email:"arun.s@grandaurum.com",joined:"Mar 2021",rating:4.7,tasksToday:9,tasksTotal:1840,roomsCleaned:0,avgResponse:"4 min",permissions:["checkin","checkout","billing","guests"],reportTo:"Priya Kapoor",hierarchy:"Lead",
    docs:{
      aadhar:{number:"5566 7788 9900",verified:true,uploaded:"02 Mar 2021"},
      passport:{number:"A9988776",expiry:"20 Jan 2027",issueDate:"21 Jan 2017",country:"India",verified:true,uploaded:"02 Mar 2021"},
      dl:{number:"DL05-20190054321",type:"LMV/MCWG",expiry:"08 Nov 2029",issueState:"Delhi",verified:false,uploaded:"05 Mar 2021"},
      iqama:null,
    },
    address:{permanent:"45, Lajpat Nagar II, New Delhi – 110024",local:"Room 3B, Staff Quarters, Grand Aurum, Mumbai"},
    visa:{type:"N/A – Indian National",period:"—",expiry:"—",daysLeft:null},
    salary:{basic:65000,hra:26000,allowances:9000,total:100000,currency:"INR",cycle:"Monthly"},
    benefits:{insurance:"Group Medical ₹5L",flightTickets:"1 economy/year",accommodation:"Staff quarters",other:["Festival bonus","Meal allowance"]},
    leaves:{total:24,taken:5,balance:19,types:{casual:5,sick:10,earned:9},history:[{date:"14 Feb 2025",type:"Casual",days:1,reason:"Personal"},{date:"22 Apr 2025",type:"Sick",days:2,reason:"Illness"},{date:"10 Jun 2025",type:"Casual",days:2,reason:"Family"}]},
    reference:{name:"Meera Joshi",relation:"Previous Manager, ITC Hotels",phone:"+91 97000 44455",email:"m.joshi@itc.com"},
    emergency:{name:"Sunita Sharma",relation:"Mother",phone:"+91 98700 33344"},
  },
  {id:3,name:"Sunita Mehta",role:"Front Desk Agent",dept:"Front Desk",shift:"Afternoon",status:"On Call",photo:"https://randomuser.me/api/portraits/women/47.jpg",phone:"+91 97300 10003",email:"sunita.m@grandaurum.com",joined:"Jun 2022",rating:4.5,tasksToday:6,tasksTotal:920,roomsCleaned:0,avgResponse:"6 min",permissions:["checkin","checkout","guests"],reportTo:"Arun Sharma",hierarchy:"Agent",
    docs:{
      aadhar:{number:"3344 5566 7788",verified:true,uploaded:"01 Jun 2022"},
      passport:null,
      dl:{number:"MH01-20220067890",type:"LMV",expiry:"30 May 2032",issueState:"Maharashtra",verified:true,uploaded:"01 Jun 2022"},
      iqama:null,
    },
    address:{permanent:"23, Gandhi Nagar, Pune – 411044",local:"Flat 5A, Orchid CHS, Kurla, Mumbai – 400070"},
    visa:{type:"N/A – Indian National",period:"—",expiry:"—",daysLeft:null},
    salary:{basic:38000,hra:15200,allowances:4800,total:58000,currency:"INR",cycle:"Monthly"},
    benefits:{insurance:"Group Medical ₹3L",flightTickets:"None",accommodation:"HRA",other:["Meal allowance","Festival bonus"]},
    leaves:{total:21,taken:3,balance:18,types:{casual:3,sick:10,earned:8},history:[{date:"05 Aug 2025",type:"Casual",days:1,reason:"Personal"},{date:"18 Sep 2025",type:"Sick",days:2,reason:"Cold"}]},
    reference:{name:"Rajiv Shah",relation:"Previous Employer",phone:"+91 96000 77788",email:"r.shah@oberoi.com"},
    emergency:{name:"Pavan Mehta",relation:"Father",phone:"+91 94000 55566"},
  },
  {id:4,name:"Deepa Rao",role:"Head Housekeeper",dept:"Housekeeping",shift:"Morning",status:"On Shift",photo:"https://randomuser.me/api/portraits/women/55.jpg",phone:"+91 96400 10004",email:"deepa.r@grandaurum.com",joined:"Feb 2020",rating:4.8,tasksToday:11,tasksTotal:2140,roomsCleaned:8,avgResponse:"5 min",permissions:["housekeeping","rooms","tasks"],reportTo:"Priya Kapoor",hierarchy:"Lead",
    docs:{
      aadhar:{number:"6677 8899 0011",verified:true,uploaded:"05 Feb 2020"},
      passport:{number:"B7766554",expiry:"10 Dec 2026",issueDate:"11 Dec 2016",country:"India",verified:true,uploaded:"05 Feb 2020"},
      dl:null,
      iqama:null,
    },
    address:{permanent:"78, 3rd Cross, Basavangudi, Bengaluru – 560004",local:"Staff Quarters Block B, Grand Aurum, Mumbai"},
    visa:{type:"N/A – Indian National",period:"—",expiry:"—",daysLeft:null},
    salary:{basic:55000,hra:22000,allowances:8000,total:85000,currency:"INR",cycle:"Monthly"},
    benefits:{insurance:"Group Medical ₹5L",flightTickets:"1 economy/year",accommodation:"Staff quarters",other:["Performance bonus","Meal allowance"]},
    leaves:{total:24,taken:9,balance:15,types:{casual:4,sick:14,earned:6},history:[{date:"20 Mar 2025",type:"Earned",days:5,reason:"Annual vacation"},{date:"10 Jul 2025",type:"Sick",days:3,reason:"Surgery"},{date:"01 Oct 2025",type:"Casual",days:1,reason:"Family"}]},
    reference:{name:"Anita Krishnan",relation:"Former Head HK, Leela Hotels",phone:"+91 95000 66677",email:"a.krishnan@leela.com"},
    emergency:{name:"Ramesh Rao",relation:"Husband",phone:"+91 96500 44455"},
  },
  {id:5,name:"Kavya Pillai",role:"Housekeeper",dept:"Housekeeping",shift:"Morning",status:"On Shift",photo:"https://randomuser.me/api/portraits/women/33.jpg",phone:"+91 95500 10005",email:"kavya.p@grandaurum.com",joined:"Sep 2022",rating:4.6,tasksToday:8,tasksTotal:680,roomsCleaned:5,avgResponse:"7 min",permissions:["housekeeping","tasks"],reportTo:"Deepa Rao",hierarchy:"Staff",
    docs:{
      aadhar:{number:"1122 3344 5566",verified:true,uploaded:"10 Sep 2022"},
      passport:null,dl:null,iqama:null,
    },
    address:{permanent:"12, Ambedkar Road, Thrissur, Kerala – 680001",local:"Staff Quarters Block A, Grand Aurum, Mumbai"},
    visa:{type:"N/A – Indian National",period:"—",expiry:"—",daysLeft:null},
    salary:{basic:22000,hra:8800,allowances:3200,total:34000,currency:"INR",cycle:"Monthly"},
    benefits:{insurance:"Group Medical ₹2L",flightTickets:"None",accommodation:"Staff quarters",other:["Meal allowance"]},
    leaves:{total:18,taken:2,balance:16,types:{casual:2,sick:10,earned:6},history:[{date:"14 Jan 2025",type:"Casual",days:1,reason:"Personal"},{date:"20 Aug 2025",type:"Sick",days:1,reason:"Fever"}]},
    reference:{name:"Shyam Pillai",relation:"Uncle – prev employer referral",phone:"+91 94500 33344",email:"shyam.p@gmail.com"},
    emergency:{name:"Latha Pillai",relation:"Mother",phone:"+91 94700 11122"},
  },
  {id:6,name:"Mohammed Al-Rashid",role:"Concierge Agent",dept:"Concierge",shift:"Morning",status:"On Shift",photo:"https://randomuser.me/api/portraits/men/29.jpg",phone:"+971 55 223 4455",email:"m.alrashid@grandaurum.com",joined:"Apr 2023",rating:4.4,tasksToday:6,tasksTotal:420,roomsCleaned:0,avgResponse:"8 min",permissions:["concierge","guests"],reportTo:"Rohan Desai",hierarchy:"Agent",
    docs:{
      aadhar:null,
      passport:{number:"AE55443322",expiry:"08 Mar 2027",issueDate:"09 Mar 2017",country:"UAE",verified:true,uploaded:"01 Apr 2023"},
      dl:{number:"UAE-DL-2019-334455",type:"LMV",expiry:"20 Jun 2029",issueState:"Dubai RTA",verified:true,uploaded:"01 Apr 2023"},
      iqama:{number:"IQ-2340012",expiry:"31 Mar 2025",issueDate:"01 Apr 2023",sponsor:"Grand Aurum Hotel",verified:true,uploaded:"01 Apr 2023"},
    },
    address:{permanent:"Villa 4, Al Barsha, Dubai, UAE",local:"Staff Quarters Block C, Grand Aurum, Mumbai"},
    visa:{type:"Employment Visa – Category III",period:"2 Years",expiry:"31 Mar 2025",daysLeft:18},
    salary:{basic:55000,hra:0,allowances:15000,total:70000,currency:"INR",cycle:"Monthly"},
    benefits:{insurance:"Group Medical ₹5L (incl. dependents)",flightTickets:"2 economy Dubai/year",accommodation:"Provided by hotel",other:["Iqama renewal covered","Repatriation benefit","Annual leave ticket"]},
    leaves:{total:30,taken:10,balance:20,types:{casual:5,sick:14,earned:11},history:[{date:"10 Jan 2025",type:"Earned",days:7,reason:"Annual home visit"},{date:"02 Mar 2025",type:"Casual",days:2,reason:"Eid Al-Fitr"},{date:"15 Mar 2025",type:"Sick",days:1,reason:"Illness"}]},
    reference:{name:"Omar Al-Fardan",relation:"Former Manager, Burj Al Arab",phone:"+971 50 889 9900",email:"omar.f@jumeirah.com"},
    emergency:{name:"Fatima Al-Rashid",relation:"Wife",phone:"+971 55 112 3344"},
  },
  {id:7,name:"Rakesh Tiwari",role:"Chief Engineer",dept:"Maintenance",shift:"Morning",status:"On Shift",photo:"https://randomuser.me/api/portraits/men/60.jpg",phone:"+91 93700 10007",email:"rakesh.t@grandaurum.com",joined:"Aug 2018",rating:4.7,tasksToday:7,tasksTotal:1960,roomsCleaned:0,avgResponse:"9 min",permissions:["maintenance","rooms","engineering"],reportTo:"Priya Kapoor",hierarchy:"Lead",
    docs:{
      aadhar:{number:"9900 1122 3344",verified:true,uploaded:"20 Aug 2018"},
      passport:{number:"H3344556",expiry:"05 Nov 2025",issueDate:"06 Nov 2015",country:"India",verified:true,uploaded:"20 Aug 2018"},
      dl:{number:"UP80-20120098765",type:"LMV/HMV",expiry:"01 Jan 2027",issueState:"Uttar Pradesh",verified:true,uploaded:"20 Aug 2018"},
      iqama:null,
    },
    address:{permanent:"56, Civil Lines, Allahabad, UP – 211001",local:"Staff Quarters Block D, Grand Aurum, Mumbai"},
    visa:{type:"N/A – Indian National",period:"—",expiry:"—",daysLeft:null},
    salary:{basic:70000,hra:28000,allowances:12000,total:110000,currency:"INR",cycle:"Monthly"},
    benefits:{insurance:"Group Medical ₹7L",flightTickets:"1 economy/year",accommodation:"Staff quarters",other:["Technical allowance ₹5,000/mo","Performance bonus","Meal allowance"]},
    leaves:{total:24,taken:6,balance:18,types:{casual:3,sick:10,earned:11},history:[{date:"28 Dec 2024",type:"Earned",days:4,reason:"Year-end vacation"},{date:"15 Feb 2025",type:"Sick",days:1,reason:"Back pain"},{date:"18 Apr 2025",type:"Casual",days:1,reason:"Family"}]},
    reference:{name:"Suresh Gupta",relation:"Former Chief Eng., Marriott Pune",phone:"+91 92000 88899",email:"s.gupta@marriott.com"},
    emergency:{name:"Anita Tiwari",relation:"Wife",phone:"+91 93800 66677"},
  },
  {id:8,name:"Rohan Desai",role:"Head Concierge",dept:"Concierge",shift:"Morning",status:"On Shift",photo:"https://randomuser.me/api/portraits/men/35.jpg",phone:"+91 91900 10009",email:"rohan.d@grandaurum.com",joined:"Jul 2020",rating:4.8,tasksToday:10,tasksTotal:1520,roomsCleaned:0,avgResponse:"3 min",permissions:["concierge","guests","transport"],reportTo:"Priya Kapoor",hierarchy:"Lead",
    docs:{
      aadhar:{number:"4455 6677 8899",verified:true,uploaded:"10 Jul 2020"},
      passport:{number:"G5544332",expiry:"22 Sep 2028",issueDate:"23 Sep 2018",country:"India",verified:true,uploaded:"10 Jul 2020"},
      dl:{number:"MH04-20150034567",type:"LMV/MCWG",expiry:"05 Jul 2025",issueState:"Maharashtra",verified:false,uploaded:"10 Jul 2020"},
      iqama:null,
    },
    address:{permanent:"34, Kothrud, Pune – 411038",local:"Flat 8C, Palm Springs, Powai, Mumbai – 400076"},
    visa:{type:"N/A – Indian National",period:"—",expiry:"—",daysLeft:null},
    salary:{basic:62000,hra:24800,allowances:9200,total:96000,currency:"INR",cycle:"Monthly"},
    benefits:{insurance:"Group Medical ₹5L",flightTickets:"1 economy/year",accommodation:"HRA",other:["Concierge tips policy","Meal allowance","Festival bonus"]},
    leaves:{total:24,taken:7,balance:17,types:{casual:4,sick:10,earned:10},history:[{date:"08 Nov 2024",type:"Earned",days:5,reason:"Vacation"},{date:"02 Jan 2025",type:"Casual",days:1,reason:"New Year"},{date:"20 Mar 2025",type:"Sick",days:1,reason:"Migraine"}]},
    reference:{name:"Nilesh Kothari",relation:"GM, Four Seasons Mumbai",phone:"+91 90000 99900",email:"n.kothari@fourseasons.com"},
    emergency:{name:"Seema Desai",relation:"Sister",phone:"+91 91700 55566"},
  },
];
const ROLES_CONFIG=[
  {role:"General Manager",dept:"Management",permissions:["all modules","staff management","reports","settings","billing override"],level:1},
  {role:"Front Desk Lead",dept:"Front Desk",permissions:["check-in/out","reservations","guest 360°","billing","room assign"],level:2},
  {role:"Front Desk Agent",dept:"Front Desk",permissions:["check-in/out","reservations","guest view","billing view"],level:3},
  {role:"Head Housekeeper",dept:"Housekeeping",permissions:["room status","cleaning tasks","VIP prep","staff assign","reports view"],level:2},
  {role:"Housekeeper",dept:"Housekeeping",permissions:["my tasks","room status update","housekeeping log"],level:3},
  {role:"Chief Engineer",dept:"Maintenance",permissions:["all tickets","equipment logs","staff assign","reports view"],level:2},
  {role:"Technician",dept:"Maintenance",permissions:["my tickets","repair log","status update"],level:3},
  {role:"Head Concierge",dept:"Concierge",permissions:["guest requests","transport","reservations view","task assign"],level:2},
  {role:"Concierge Agent",dept:"Concierge",permissions:["guest requests","transport","task log"],level:3},
  {role:"F&B Manager",dept:"F&B",permissions:["orders","kitchen","billing","inventory","staff assign"],level:2},
  {role:"F&B Staff",dept:"F&B",permissions:["orders","table status","kitchen view"],level:3},
];
const SHIFT_SCHEDULE={
  "Front Desk":[{name:"Arun Sharma",shift:"Morning",id:2},{name:"Sunita Mehta",shift:"Afternoon",id:3},{name:"Night Agent",shift:"Night",id:null}],
  "Housekeeping":[{name:"Deepa Rao",shift:"Morning",id:4},{name:"Kavya Pillai",shift:"Morning",id:5},{name:"Evening HK",shift:"Afternoon",id:null}],
  "Maintenance":[{name:"Rakesh Tiwari",shift:"Morning",id:7},{name:"Night Eng.",shift:"Night",id:null}],
  "Concierge":[{name:"Rohan Desai",shift:"Morning",id:8},{name:"Mohammed Al-R.",shift:"Morning",id:6}],
};

/* ═══════════════════ CSS ══════════════════════════════════════ */
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden}
body{font-family:'Outfit',sans-serif;background:${C.bg};color:${C.t1};font-size:13px;line-height:1.5}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
.shell{display:grid;grid-template-rows:52px 1fr;height:100vh;overflow:hidden}
/* topbar */
.topbar{background:${C.navy};display:flex;align-items:center;padding:0 20px;gap:14px;flex-shrink:0}
.tb-logo{width:28px;height:28px;border-radius:6px;background:${C.goldD};display:flex;align-items:center;justify-content:center;font-family:${F.serif};font-size:15px;font-weight:600;color:#fff;flex-shrink:0}
.tb-hotel{font-family:${F.serif};font-size:17px;font-weight:600;color:#F5EDDA;letter-spacing:.3px;white-space:nowrap}
.tb-sep{width:1px;height:18px;background:${C.navyM};flex-shrink:0}
.tb-crumb{font-size:11.5px;color:#5A7090;display:flex;align-items:center;gap:5px}
.tb-crumb .cur{color:${C.gold};font-weight:600}
.tb-right{margin-left:auto;display:flex;align-items:center;gap:8px}
.tbtn{padding:5px 14px;border-radius:6px;font-family:${F.sans};font-size:12px;font-weight:600;cursor:pointer;border:1px solid transparent;transition:all .15s;white-space:nowrap}
.tbtn-ghost{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.12)!important;color:#7890A8}
.tbtn-ghost:hover{background:rgba(255,255,255,.13);color:#F5EDDA}
.tbtn-gold{background:${C.goldD};border-color:${C.gold}!important;color:${C.goldL}}
.tbtn-gold:hover{background:#a07810}
/* body */
.body{display:grid;grid-template-columns:220px 1fr;height:100%;overflow:hidden;min-height:0}
/* sidebar */
.sidebar{background:${C.navy};border-right:1px solid ${C.navyM};display:flex;flex-direction:column;overflow:hidden}
.sb-hd{padding:16px 14px 10px;border-bottom:1px solid rgba(255,255,255,.06);flex-shrink:0}
.sb-title{font-family:${F.serif};font-size:16px;font-weight:600;color:#F5EDDA;letter-spacing:.3px}
.sb-sub{font-family:${F.mono};font-size:7.5px;color:#3A5070;letter-spacing:.12em;margin-top:2px}
.on-shift-count{display:inline-flex;align-items:center;gap:5px;margin-top:8px;padding:3px 9px;border-radius:20px;background:rgba(22,101,52,.25);border:1px solid rgba(22,101,52,.4);font-family:${F.mono};font-size:8.5px;color:#4ADE80;font-weight:700;letter-spacing:.06em}
.on-dot{width:5px;height:5px;border-radius:50%;background:#4ADE80;animation:blink 1.5s ease infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.nav-tabs{padding:10px 10px;flex-shrink:0;display:flex;flex-direction:column;gap:3px}
.nav-tab{display:flex;align-items:center;gap:9px;padding:9px 11px;border-radius:9px;cursor:pointer;transition:all .14s;border:1px solid transparent;position:relative}
.nav-tab:hover{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.06)}
.nav-tab.active{background:rgba(200,146,12,.1);border-color:rgba(200,146,12,.2)}
.nav-tab-icon{font-size:15px;flex-shrink:0;width:20px;text-align:center}
.nav-tab-label{font-size:12.5px;font-weight:600;color:#8090AA;flex:1}
.nav-tab.active .nav-tab-label{color:#F5EDDA}
.nav-tab-count{font-family:${F.mono};font-size:9px;padding:1.5px 7px;border-radius:8px;background:rgba(255,255,255,.06);color:#5A7090;border:1px solid rgba(255,255,255,.06)}
.nav-tab.active .nav-tab-count{background:rgba(200,146,12,.15);color:${C.gold};border-color:rgba(200,146,12,.3)}
.dept-legend{padding:10px 14px;border-top:1px solid rgba(255,255,255,.05);margin-top:auto;flex-shrink:0}
.legend-title{font-family:${F.mono};font-size:7.5px;color:#3A5070;letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px}
.legend-item{display:flex;align-items:center;gap:7px;padding:4px 0;font-size:11px;color:#6A8090;cursor:pointer}
.legend-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
/* main */
.main{display:flex;flex-direction:column;overflow:hidden;min-height:0}
.summary-strip{display:grid;grid-template-columns:repeat(5,1fr);gap:1px;background:${C.border};border-bottom:1px solid ${C.border};flex-shrink:0}
.sum-cell{background:${C.bgL};padding:10px 16px}
.sum-val{font-family:${F.serif};font-size:22px;font-weight:700;color:${C.t1};line-height:1}
.sum-lbl{font-family:${F.mono};font-size:7.5px;color:${C.t4};letter-spacing:.1em;text-transform:uppercase;margin-top:2px}
.sum-bar{height:2px;border-radius:1px;background:${C.border};margin-top:6px;overflow:hidden}
.sum-fill{height:100%;border-radius:1px}
.toolbar{padding:12px 22px;border-bottom:1px solid ${C.border};display:flex;align-items:center;gap:10px;flex-shrink:0;background:${C.bgL}}
.search-box{flex:1;max-width:300px;position:relative}
.search-box input{width:100%;padding:7px 10px 7px 34px;border:1.5px solid ${C.border};border-radius:9px;background:${C.white};font-family:${F.sans};font-size:12.5px;color:${C.t1};outline:none;transition:all .15s}
.search-box input:focus{border-color:${C.gold}80;box-shadow:0 0 0 3px ${C.gold}12}
.search-box input::placeholder{color:${C.t4}}
.search-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:13px;pointer-events:none;opacity:.4}
.fchip{display:inline-flex;align-items:center;gap:4px;padding:5px 11px;border-radius:20px;border:1.5px solid ${C.border};background:${C.bgL};font-family:${F.mono};font-size:8.5px;font-weight:700;color:${C.t3};cursor:pointer;transition:all .14s;letter-spacing:.05em;white-space:nowrap}
.fchip:hover{border-color:${C.gold}60;color:${C.t2}}
.fchip.on{background:${C.navy};border-color:${C.navy};color:#F5EDDA}
.content{flex:1;overflow-y:auto;min-height:0;padding:20px 22px}
/* staff cards */
.staff-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
.staff-card{background:${C.white};border:1px solid ${C.border};border-radius:13px;padding:16px;cursor:pointer;transition:all .15s;position:relative;overflow:hidden}
.staff-card:hover{box-shadow:0 4px 20px rgba(0,0,0,.09);transform:translateY(-2px);border-color:${C.borderL}}
.staff-card.selected{border-color:${C.gold};box-shadow:0 0 0 2px ${C.gold}30}
.staff-card-top{display:flex;align-items:center;gap:11px;margin-bottom:12px}
.staff-metrics{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:10px}
.metric-box{background:${C.bgL};border:1px solid ${C.borderL};border-radius:8px;padding:7px 9px}
.metric-val{font-family:${F.mono};font-size:14px;font-weight:700;color:${C.t1};line-height:1}
.metric-lbl{font-family:${F.mono};font-size:7.5px;color:${C.t4};letter-spacing:.09em;text-transform:uppercase;margin-top:2px}
.shift-tag{position:absolute;top:12px;right:12px;display:flex;align-items:center;gap:4px;padding:2px 8px;border-radius:8px;font-family:${F.mono};font-size:7.5px;font-weight:700;letter-spacing:.06em}
/* perf table */
.perf-table{width:100%;border-collapse:collapse;background:${C.white};border-radius:12px;overflow:hidden;border:1px solid ${C.border}}
.perf-th{padding:9px 14px;text-align:left;font-family:${F.mono};font-size:7.5px;color:${C.t4};letter-spacing:.12em;text-transform:uppercase;background:${C.bgL};border-bottom:1.5px solid ${C.border}}
.perf-td{padding:10px 14px;vertical-align:middle;border-bottom:1px solid ${C.borderL};font-size:12.5px}
.perf-tr{transition:background .1s;cursor:pointer}
.perf-tr:hover{background:${C.goldL}30}
.perf-tr:last-child td{border-bottom:none}
.perf-bar-bg{width:60px;height:5px;border-radius:3px;background:${C.border};display:inline-block}
.perf-bar-fill{height:100%;border-radius:3px}
/* roles */
.roles-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}
.role-card{background:${C.white};border:1px solid ${C.border};border-radius:13px;padding:16px}
.role-card-hd{display:flex;align-items:center;gap:9px;margin-bottom:12px}
.role-badge{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.level-pip{width:8px;height:8px;border-radius:2px}
.perm-tag{display:inline-flex;padding:2.5px 8px;border-radius:8px;background:${C.bgL};border:1px solid ${C.borderL};font-family:${F.mono};font-size:8.5px;color:${C.t2};margin:2px;white-space:nowrap}
/* PROFILE DRAWER */
.drawer-overlay{position:fixed;inset:0;z-index:200;display:flex;justify-content:flex-end;pointer-events:all}
.drawer-bg{position:absolute;inset:0;background:rgba(28,43,58,.4);backdrop-filter:blur(3px);animation:fadeIn .18s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.drawer{position:relative;z-index:1;width:480px;height:100%;background:${C.bgL};border-left:1px solid ${C.border};display:flex;flex-direction:column;overflow:hidden;animation:slideIn .22s ease}
@keyframes slideIn{from{transform:translateX(30px);opacity:0}to{transform:translateX(0);opacity:1}}
.drawer-topnav{display:flex;border-bottom:1px solid ${C.border};background:${C.bgL};flex-shrink:0}
.drawer-tab{flex:1;padding:9px 6px;text-align:center;font-family:${F.mono};font-size:8.5px;font-weight:700;color:${C.t3};cursor:pointer;transition:all .14s;letter-spacing:.07em;border-bottom:2px solid transparent}
.drawer-tab:hover{color:${C.t2}}
.drawer-tab.active{color:${C.navy};border-bottom-color:${C.gold}}
.drawer-hd{background:${C.navy};padding:16px 18px 14px;flex-shrink:0}
.drawer-body{flex:1;overflow-y:auto;padding:16px 18px}
.drawer-footer{padding:12px 18px;border-top:1px solid ${C.border};flex-shrink:0;display:flex;flex-direction:column;gap:7px;background:${C.bgL}}
.d-photo{width:50px;height:50px;border-radius:11px;overflow:hidden;flex-shrink:0;border:2px solid rgba(200,146,12,.3)}
.d-photo img{width:100%;height:100%;object-fit:cover;display:block}
.d-sec{margin-bottom:16px}
.d-sec-title{font-family:${F.mono};font-size:7.5px;letter-spacing:.15em;color:${C.t4};text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:6px}
.d-sec-title::after{content:'';flex:1;height:1px;background:${C.borderL}}
.d-row{display:flex;justify-content:space-between;align-items:flex-start;padding:5px 0;border-bottom:1px solid ${C.borderL};font-size:12px;gap:12px}
.d-row:last-child{border-bottom:none}
.d-lbl{color:${C.t4};flex-shrink:0}
.d-val{font-weight:600;color:${C.t1};text-align:right}
/* doc cards */
.doc-card{background:${C.white};border:1px solid ${C.border};border-radius:11px;padding:13px 14px;margin-bottom:10px;position:relative}
.doc-card-hd{display:flex;align-items:center;gap:9px;margin-bottom:10px}
.doc-icon{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}
.doc-title{font-size:13px;font-weight:700;color:${C.t1}}
.doc-sub{font-size:10.5px;color:${C.t3};margin-top:1px}
.verified-badge{display:inline-flex;align-items:center;gap:4px;padding:2px 9px;border-radius:20px;font-family:${F.mono};font-size:8px;font-weight:700;letter-spacing:.07em}
.upload-zone{border:2px dashed ${C.border};border-radius:10px;padding:24px;text-align:center;cursor:pointer;transition:all .15s;background:${C.bgL};margin-bottom:10px}
.upload-zone:hover{border-color:${C.gold}80;background:${C.goldL}30}
/* leave badges */
.leave-chip{display:inline-flex;padding:2px 8px;border-radius:8px;font-family:${F.mono};font-size:8.5px;font-weight:700;margin:2px}
/* ADD STAFF MODAL */
.modal-overlay{position:fixed;inset:0;z-index:300;background:rgba(10,15,25,.65);display:flex;align-items:flex-start;justify-content:center;padding-top:40px;backdrop-filter:blur(6px);animation:fadeIn .18s ease}
.modal{width:820px;max-width:96vw;max-height:calc(100vh - 60px);background:${C.bgL};border:1px solid ${C.border};border-radius:18px;box-shadow:0 32px 80px rgba(0,0,0,.3);display:flex;flex-direction:column;overflow:hidden;animation:slideIn .2s ease}
.modal-hd{padding:18px 24px 14px;border-bottom:1px solid ${C.border};display:flex;align-items:center;gap:12px;flex-shrink:0;background:${C.navy}}
.modal-title{font-family:${F.serif};font-size:22px;font-weight:700;color:#F5EDDA;letter-spacing:.02em}
.modal-body{flex:1;overflow-y:auto;padding:20px 24px;display:grid;grid-template-columns:1fr 1fr;gap:20px}
.modal-footer{padding:14px 24px;border-top:1px solid ${C.border};display:flex;align-items:center;gap:10px;justify-content:flex-end;flex-shrink:0;background:${C.bgL}}
.form-col{display:flex;flex-direction:column;gap:14px}
.form-section{background:${C.white};border:1px solid ${C.border};border-radius:12px;padding:14px}
.form-sec-title{font-family:${F.mono};font-size:8.5px;color:${C.t4};letter-spacing:.15em;text-transform:uppercase;margin-bottom:12px;display:flex;align-items:center;gap:6px}
.form-sec-title::after{content:'';flex:1;height:1px;background:${C.borderL}}
.form-row{display:flex;flex-direction:column;gap:4px;margin-bottom:10px}
.form-row:last-child{margin-bottom:0}
.form-lbl{font-family:${F.mono};font-size:8.5px;color:${C.t3};letter-spacing:.08em;font-weight:600}
.form-input{padding:7px 11px;border:1.5px solid ${C.border};border-radius:8px;font-family:${F.sans};font-size:12.5px;color:${C.t1};background:${C.bgL};outline:none;transition:all .15s;width:100%}
.form-input:focus{border-color:${C.gold}80;box-shadow:0 0 0 3px ${C.gold}10;background:${C.white}}
.form-select{padding:7px 11px;border:1.5px solid ${C.border};border-radius:8px;font-family:${F.sans};font-size:12.5px;color:${C.t1};background:${C.bgL};outline:none;cursor:pointer;width:100%}
/* ID upload box */
.id-upload-area{border:2px dashed ${C.border};border-radius:12px;padding:20px;text-align:center;cursor:pointer;transition:all .15s;background:${C.bgL};position:relative}
.id-upload-area:hover{border-color:${C.gold}80;background:${C.goldL}30}
.id-upload-area.scanning{border-color:${C.teal}80;background:${C.tealL}30;animation:scanPulse 1.4s ease infinite}
@keyframes scanPulse{0%,100%{border-color:${C.teal}80}50%{border-color:${C.teal}}}
.id-upload-area.done{border-color:${C.green}80;background:${C.greenL}30;border-style:solid}
.ocr-result{background:${C.bgL};border:1px solid ${C.border};border-radius:10px;padding:12px;margin-top:10px;animation:fadeIn .3s ease}
.ocr-field{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid ${C.borderL};font-size:11.5px}
.ocr-field:last-child{border-bottom:none}
.ocr-key{color:${C.t4};font-family:${F.mono};font-size:9px;letter-spacing:.05em}
.ocr-val{font-weight:600;color:${C.teal};font-family:${F.mono};font-size:10px;animation:flashField .6s ease}
@keyframes flashField{0%{color:${C.teal};background:${C.tealL}}100%{color:${C.teal};background:transparent}}
/* shared buttons */
.abtn{display:flex;align-items:center;justify-content:center;gap:7px;padding:9px 14px;border-radius:9px;font-family:${F.sans};font-size:12.5px;font-weight:600;cursor:pointer;border:1px solid transparent;transition:all .15s;width:100%}
.abtn:hover{transform:translateY(-1px)}
.abtn-navy{background:${C.navy};border-color:${C.navyM}!important;color:#F5EDDA}
.abtn-navy:hover{background:${C.navyM}}
.abtn-outline{background:transparent;border-color:${C.border}!important;color:${C.t2}}
.abtn-outline:hover{border-color:${C.borderL}!important;color:${C.t1};background:${C.bgM}}
.abtn-gold{background:${C.goldD};border-color:${C.gold}!important;color:${C.goldL}}
.abtn-gold:hover{background:#a07810}
.abtn-green{background:${C.green};border-color:${C.greenD}!important;color:#fff}
.abtn-red{background:${C.red};border-color:${C.redD}!important;color:#fff}
.sbtn{padding:7px 18px;border-radius:8px;font-family:${F.sans};font-size:12.5px;font-weight:600;cursor:pointer;border:1px solid transparent;transition:all .14s;white-space:nowrap}
.sbtn-gold{background:${C.goldD};border-color:${C.gold}!important;color:${C.goldL}}
.sbtn-gold:hover{background:#a07810}
.sbtn-outline{background:transparent;border-color:${C.border}!important;color:${C.t2}}
.sbtn-outline:hover{border-color:${C.t2}!important;color:${C.t1}}
/* toast */
.toast{position:fixed;bottom:24px;right:24px;z-index:2000;background:${C.navy};border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.88);padding:10px 18px;border-radius:10px;font-family:${F.mono};font-size:11px;box-shadow:0 6px 28px rgba(0,0,0,.28);animation:slideUp .22s ease;display:flex;align-items:center;gap:8px}
@keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.card-anim{animation:slideUp .2s ease both}
.visa-urgent{animation:visaBlink 1.5s ease infinite}
@keyframes visaBlink{0%,100%{opacity:1}50%{opacity:.5}}
`;

/* ═══════════════════ HELPERS ════════════════════════════════ */
function ratingColor(r){if(r>=4.7)return C.green;if(r>=4.3)return C.teal;if(r>=4.0)return C.amber;return C.red;}
function daysLeft(expiry){
  if(!expiry||expiry==="—")return null;
  const d=Math.ceil((new Date(expiry.split(" ").reverse().join("-"))-new Date())/(1000*60*60*24));
  return d;
}
function StaffPhoto({src,name,size=46,radius=11}){
  const[err,setErr]=useState(false);
  const initials=name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const colors=["#1C3A5C","#2A3A1A","#3A1A2A","#1A2A3A","#3A2A1A","#1A3A3A"];
  const bg=colors[name.charCodeAt(0)%colors.length];
  return(
    <div style={{width:size,height:size,borderRadius:radius,overflow:"hidden",flexShrink:0,background:bg}}>
      {!err
        ?<img src={src} alt={name} onError={()=>setErr(true)} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
        :<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.serif,fontWeight:700,color:"#fff",fontSize:size*.38}}>{initials}</div>
      }
    </div>
  );
}

/* ═══════════════════ AI OCR — REAL CLAUDE VISION ══════════════ */
const DOC_PROMPTS={
  passport:`You are reading a passport image. Extract ALL visible fields as JSON only, no markdown, no explanation. Use these exact keys: {"full_name":"","surname":"","given_name":"","passport_no":"","nationality":"","date_of_birth":"","place_of_birth":"","date_of_issue":"","date_of_expiry":"","place_of_issue":"","gender":"","mrz_line1":"","mrz_line2":""}. If a field is not visible write "—". Return ONLY the JSON object.`,
  aadhar:`You are reading an Aadhaar card image. Extract ALL visible fields as JSON only, no markdown. Use these exact keys: {"full_name":"","date_of_birth":"","gender":"","aadhar_number":"","address":"","pin_code":""}. If not visible write "—". Return ONLY the JSON object.`,
  iqama:`You are reading an Iqama (Saudi/GCC residence permit) or similar residence permit. Extract ALL visible fields as JSON only, no markdown. Use these exact keys: {"full_name":"","iqama_number":"","nationality":"","date_of_birth":"","date_of_issue":"","date_of_expiry":"","sponsor":"","occupation":"","religion":"","id_number":""}. If not visible write "—". Return ONLY the JSON object.`,
  dl:`You are reading a driving licence image. Extract ALL visible fields as JSON only, no markdown. Use these exact keys: {"full_name":"","date_of_birth":"","dl_number":"","date_of_issue":"","date_of_expiry":"","vehicle_classes":"","issuing_authority":"","address":"","blood_group":""}. If not visible write "—". Return ONLY the JSON object.`,
};

const DOC_FIELD_LABELS={
  passport:{full_name:"Full Name",surname:"Surname",given_name:"Given Name",passport_no:"Passport No",nationality:"Nationality",date_of_birth:"Date of Birth",place_of_birth:"Place of Birth",date_of_issue:"Date of Issue",date_of_expiry:"Date of Expiry",place_of_issue:"Place of Issue",gender:"Gender",mrz_line1:"MRZ Line 1",mrz_line2:"MRZ Line 2"},
  aadhar:{full_name:"Full Name",date_of_birth:"Date of Birth",gender:"Gender",aadhar_number:"Aadhaar Number",address:"Address",pin_code:"PIN Code"},
  iqama:{full_name:"Full Name",iqama_number:"Iqama Number",nationality:"Nationality",date_of_birth:"Date of Birth",date_of_issue:"Date of Issue",date_of_expiry:"Date of Expiry",sponsor:"Sponsor",occupation:"Occupation",religion:"Religion",id_number:"ID Number"},
  dl:{full_name:"Full Name",date_of_birth:"Date of Birth",dl_number:"DL Number",date_of_issue:"Date of Issue",date_of_expiry:"Date of Expiry",vehicle_classes:"Vehicle Classes",issuing_authority:"Issuing Authority",address:"Address",blood_group:"Blood Group"},
};

// Field keys that should auto-populate form fields
const FIELD_MAP={
  passport:{full_name:"name",nationality:"nationality",date_of_birth:"dob",passport_no:"passportNo",date_of_expiry:"passportExpiry",date_of_issue:"passportIssue",place_of_issue:"passportCountry"},
  aadhar:{full_name:"name",date_of_birth:"dob",address:"permanentAddr",aadhar_number:"aadharNo"},
  iqama:{full_name:"name",iqama_number:"iqamaNo",date_of_expiry:"iqamaExpiry",sponsor:"iqamaSponsor",occupation:"role"},
  dl:{full_name:"name",date_of_birth:"dob",dl_number:"dlNo",date_of_expiry:"dlExpiry",vehicle_classes:"dlType",issuing_authority:"dlState",address:"permanentAddr"},
};

async function callClaudeVision(base64,mediaType,docType){
  const prompt=DOC_PROMPTS[docType]||DOC_PROMPTS.passport;
  const resp=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:1000,
      messages:[{role:"user",content:[
        {type:"image",source:{type:"base64",media_type:mediaType,data:base64}},
        {type:"text",text:prompt}
      ]}]
    })
  });
  const data=await resp.json();
  const text=(data.content||[]).map(b=>b.text||"").join("").trim();
  try{
    const clean=text.replace(/```json|```/g,"").trim();
    return JSON.parse(clean);
  }catch{return null;}
}

function DocUploadCard({docType,label,icon,color,bg,extracted,scanState,onUpload}){
  const fileRef=useRef();
  const fields=DOC_FIELD_LABELS[docType]||{};
  const isScanning=scanState==="scanning";
  const isDone=scanState==="done";
  const isError=scanState==="error";

  return(
    <div style={{background:C.white,border:`1.5px solid ${isDone?color:isError?C.red:isScanning?C.teal:C.border}`,borderRadius:13,overflow:"hidden",transition:"border-color .2s"}}>
      {/* Card header */}
      <div style={{padding:"12px 14px",background:isDone?bg:isScanning?C.tealL:C.bgL,borderBottom:`1px solid ${C.borderL}`,display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:34,height:34,borderRadius:9,background:isDone?bg:C.bgM,border:`1px solid ${isDone?color+"60":C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{icon}</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:F.mono,fontSize:10,fontWeight:700,color:isDone?color:C.t2,letterSpacing:".06em"}}>{label.toUpperCase()}</div>
          <div style={{fontFamily:F.mono,fontSize:8.5,color:isScanning?C.teal:isError?C.red:isDone?color:C.t4,marginTop:2}}>
            {isScanning?"🔍 AI scanning…":isError?"⚠ Could not read — try again":isDone?"✅ Extracted successfully":"Click to upload"}
          </div>
        </div>
        {isDone&&<span style={{display:"inline-flex",padding:"2px 9px",borderRadius:20,background:C.greenL,color:C.green,border:`1px solid ${C.greenD}40`,fontFamily:F.mono,fontSize:8,fontWeight:700}}>✓ READ</span>}
      </div>

      {/* Upload zone */}
      {!isDone&&(
        <div
          className={`id-upload-area${isScanning?" scanning":""}`}
          style={{margin:"12px 14px",borderRadius:10,cursor:isScanning?"default":"pointer"}}
          onClick={()=>!isScanning&&fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept="image/*,.pdf" style={{display:"none"}}
            onChange={e=>{const f=e.target.files[0];if(f)onUpload(f,docType);}}/>
          {isScanning?(
            <div style={{padding:"16px 0"}}>
              <div style={{fontFamily:F.mono,fontSize:11,color:C.teal,fontWeight:700,marginBottom:6}}>Reading document with AI…</div>
              <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:8}}>
                {[0,1,2,3,4].map(i=>(
                  <div key={i} style={{width:6,height:6,borderRadius:3,background:C.teal,animation:`blink ${0.8+i*0.15}s ease infinite`}}/>
                ))}
              </div>
            </div>
          ):(
            <div style={{padding:"10px 0"}}>
              <div style={{fontSize:26,marginBottom:6}}>{icon}</div>
              <div style={{fontFamily:F.mono,fontSize:10.5,color:C.t3,fontWeight:600}}>Drop or click to upload</div>
              <div style={{fontFamily:F.mono,fontSize:9,color:C.t4,marginTop:3}}>JPG · PNG · PDF · Aadhaar · Passport · Iqama · DL</div>
            </div>
          )}
        </div>
      )}

      {/* Extracted fields */}
      {extracted&&Object.keys(extracted).length>0&&(
        <div style={{padding:"0 14px 14px"}}>
          <div style={{fontFamily:F.mono,fontSize:7.5,color:C.teal,letterSpacing:".15em",marginBottom:6,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
            ✦ AI EXTRACTED FIELDS
            <div style={{flex:1,height:1,background:C.tealL}}/>
          </div>
          <div style={{background:C.bgL,borderRadius:9,border:`1px solid ${C.borderL}`,overflow:"hidden"}}>
            {Object.entries(extracted).filter(([,v])=>v&&v!=="—").map(([k,v],i,arr)=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"6px 11px",borderBottom:i<arr.length-1?`1px solid ${C.borderL}`:"none",gap:10}}>
                <span style={{fontFamily:F.mono,fontSize:8.5,color:C.t4,letterSpacing:".04em",flexShrink:0}}>{(fields[k]||k).toUpperCase()}</span>
                <span style={{fontFamily:F.mono,fontSize:9.5,fontWeight:700,color:C.teal,textAlign:"right",wordBreak:"break-all"}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{marginTop:8,display:"flex",alignItems:"center",gap:6,padding:"5px 9px",borderRadius:8,background:C.goldL,border:`1px solid ${C.gold}50`}}>
            <span style={{fontSize:11}}>✏️</span>
            <span style={{fontFamily:F.mono,fontSize:8.5,color:C.goldD}}>Fields auto-populated below — edit if needed</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════ ADD STAFF MODAL ════════════════════════ */
function AddStaffModal({onClose,onAdd,fireToast}){
  const[step,setStep]=useState(1); // 1=upload IDs, 2=verify & complete, 3=employment, 4=review
  const[form,setForm]=useState({
    name:"",dob:"",gender:"",nationality:"",role:"",dept:"Front Desk",shift:"Morning",
    phone:"",email:"",permanentAddr:"",localAddr:"",
    aadharNo:"",passportNo:"",passportExpiry:"",passportIssue:"",passportCountry:"",
    iqamaNo:"",iqamaExpiry:"",iqamaSponsor:"",
    dlNo:"",dlType:"LMV",dlExpiry:"",dlState:"",
    visaType:"N/A – Indian National",visaPeriod:"",visaExpiry:"",
    reference:"",refPhone:"",refRelation:"",emergencyName:"",emergencyPhone:"",emergencyRelation:"",
    salary:"",salaryType:"Monthly",insurance:"",flightTickets:"None",accommodation:"Staff Quarters",
    totalLeaves:"21",
  });
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const setMany=(obj)=>setForm(p=>({...p,...obj}));

  const[scanStates,setScanStates]=useState({passport:"idle",aadhar:"idle",iqama:"idle",dl:"idle"});
  const[extracted,setExtracted]=useState({passport:{},aadhar:{},iqama:{},dl:{}});

  const setScan=(docType,state)=>setScanStates(p=>({...p,[docType]:state}));

  const handleUpload=useCallback(async(file,docType)=>{
    setScan(docType,"scanning");
    try{
      const base64=await new Promise((res,rej)=>{
        const r=new FileReader();
        r.onload=()=>res(r.result.split(",")[1]);
        r.onerror=()=>rej(new Error("read failed"));
        r.readAsDataURL(file);
      });
      const mediaType=file.type||"image/jpeg";
      const result=await callClaudeVision(base64,mediaType,docType);
      if(result){
        setExtracted(p=>({...p,[docType]:result}));
        // Auto-populate form from extracted data
        const mapping=FIELD_MAP[docType]||{};
        const updates={};
        Object.entries(mapping).forEach(([ocrKey,formKey])=>{
          if(result[ocrKey]&&result[ocrKey]!=="—")updates[formKey]=result[ocrKey];
        });
        if(Object.keys(updates).length)setMany(updates);
        setScan(docType,"done");
        fireToast(`${docType.charAt(0).toUpperCase()+docType.slice(1)} read — ${Object.values(result).filter(v=>v&&v!=="—").length} fields extracted`);
      }else{
        setScan(docType,"error");
        fireToast("Could not parse document — please try a clearer image");
      }
    }catch(e){
      setScan(docType,"error");
      fireToast("Upload failed — check your connection");
    }
  },[fireToast]);

  const steps=[{n:1,label:"Upload IDs"},{n:2,label:"Verify Info"},{n:3,label:"Employment"},{n:4,label:"Review"}];

  const inp=(k,label,type="text",placeholder="")=>{
    const isAutoFilled=form[k]&&form[k]!=="";
    return(
      <div className="form-row">
        <label className="form-lbl" style={{display:"flex",alignItems:"center",gap:5}}>
          {label}
          {isAutoFilled&&<span style={{display:"inline-flex",padding:"1px 5px",borderRadius:5,background:C.tealL,color:C.teal,fontSize:7,fontWeight:700,letterSpacing:".06em"}}>AI</span>}
        </label>
        <input className="form-input" type={type}
          placeholder={placeholder||`Enter ${label.toLowerCase()}`}
          value={form[k]}
          onChange={e=>set(k,e.target.value)}
          style={{borderColor:isAutoFilled?C.teal+"60":"",background:isAutoFilled?C.tealL+"40":""}}
        />
      </div>
    );
  };
  const ta=(k,label,rows=3)=>{
    const isAutoFilled=form[k]&&form[k]!=="";
    return(
      <div className="form-row">
        <label className="form-lbl" style={{display:"flex",alignItems:"center",gap:5}}>
          {label}
          {isAutoFilled&&<span style={{display:"inline-flex",padding:"1px 5px",borderRadius:5,background:C.tealL,color:C.teal,fontSize:7,fontWeight:700,letterSpacing:".06em"}}>AI</span>}
        </label>
        <textarea className="form-input" rows={rows} placeholder={`Enter ${label.toLowerCase()}`}
          value={form[k]} onChange={e=>set(k,e.target.value)} style={{resize:"none",borderColor:isAutoFilled?C.teal+"60":"",background:isAutoFilled?C.tealL+"40":""}}/>
      </div>
    );
  };
  const sel=(k,label,options)=>(
    <div className="form-row">
      <label className="form-lbl">{label}</label>
      <select className="form-select" value={form[k]} onChange={e=>set(k,e.target.value)}>
        {options.map(o=><option key={o}>{o}</option>)}
      </select>
    </div>
  );

  const DOC_CARDS=[
    {key:"passport",label:"Passport",icon:"🛂",color:C.blue,bg:C.blueL},
    {key:"aadhar",label:"Aadhaar Card",icon:"🪪",color:C.teal,bg:C.tealL},
    {key:"iqama",label:"Iqama / Residency",icon:"📋",color:C.amber,bg:C.amberL},
    {key:"dl",label:"Driving Licence",icon:"🚗",color:C.purple,bg:C.purpleL},
  ];

  const docsScanned=Object.values(scanStates).filter(s=>s==="done").length;

  const handleSubmit=()=>{
    fireToast(`Staff profile created for ${form.name||"new staff"} ✓`);
    onAdd&&onAdd(form);
    onClose();
  };

  return(
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        {/* Header */}
        <div className="modal-hd">
          <div style={{width:36,height:36,borderRadius:9,background:C.goldD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>👤</div>
          <div style={{flex:1}}>
            <div className="modal-title">Add New Staff Member</div>
            <div style={{fontFamily:F.mono,fontSize:8.5,color:"#456080",letterSpacing:".1em",marginTop:2}}>
              STEP {step} OF 4 · {docsScanned > 0 ? `${docsScanned} DOCUMENT${docsScanned>1?"S":""} SCANNED` : "UPLOAD DOCUMENTS TO AUTO-FILL"}
            </div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#456080",cursor:"pointer",fontSize:18,padding:4,lineHeight:1}}>✕</button>
        </div>

        {/* Step tabs */}
        <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,background:C.bgL,flexShrink:0}}>
          {steps.map(s=>(
            <div key={s.n} onClick={()=>s.n<step&&setStep(s.n)}
              style={{flex:1,padding:"10px 6px",textAlign:"center",fontFamily:F.mono,fontSize:8.5,fontWeight:700,cursor:s.n<step?"pointer":"default",color:step===s.n?C.navy:s.n<step?C.teal:C.t4,borderBottom:`2px solid ${step===s.n?C.gold:s.n<step?C.teal:"transparent"}`,letterSpacing:".06em",transition:"all .14s",background:step===s.n?C.goldL+"50":"transparent"}}>
              {s.n<step?"✓":s.n}. {s.label.toUpperCase()}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="modal-body" style={{gridTemplateColumns:"1fr 1fr",padding:"20px 24px"}}>

          {/* ── STEP 1: Document Upload ── */}
          {step===1&&<>
            <div style={{gridColumn:"1/-1"}}>
              <div style={{background:C.navy,borderRadius:12,padding:"14px 18px",marginBottom:18,display:"flex",alignItems:"center",gap:14}}>
                <div style={{fontSize:28}}>🤖</div>
                <div>
                  <div style={{fontFamily:F.serif,fontSize:17,fontWeight:600,color:"#F5EDDA"}}>Upload Government ID Documents</div>
                  <div style={{fontFamily:F.mono,fontSize:9,color:"#456080",marginTop:3,lineHeight:1.6}}>
                    Claude AI will read the documents and automatically fill the staff profile. Upload at least one ID to continue. All fields can be edited after extraction.
                  </div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                {DOC_CARDS.map(d=>(
                  <DocUploadCard
                    key={d.key}
                    docType={d.key}
                    label={d.label}
                    icon={d.icon}
                    color={d.color}
                    bg={d.bg}
                    extracted={extracted[d.key]}
                    scanState={scanStates[d.key]}
                    onUpload={handleUpload}
                  />
                ))}
              </div>
              {docsScanned===0&&(
                <div style={{marginTop:14,padding:"10px 14px",borderRadius:9,background:C.amberL,border:`1px solid ${C.amber}50`,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:14}}>💡</span>
                  <span style={{fontFamily:F.mono,fontSize:9,color:C.amberD}}>Upload at least one document. AI will extract name, DOB, address, ID numbers, and validity dates automatically.</span>
                </div>
              )}
              {docsScanned>0&&(
                <div style={{marginTop:14,padding:"10px 14px",borderRadius:9,background:C.greenL,border:`1px solid ${C.greenD}40`,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:14}}>✅</span>
                  <span style={{fontFamily:F.mono,fontSize:9,color:C.green,fontWeight:700}}>{docsScanned} document{docsScanned>1?"s":""} scanned · Profile fields auto-populated · Click Next to review</span>
                </div>
              )}
            </div>
          </>}

          {/* ── STEP 2: Verify & Complete ── */}
          {step===2&&<>
            {/* AI fill notice */}
            {docsScanned>0&&(
              <div style={{gridColumn:"1/-1",background:C.tealL,border:`1px solid ${C.teal}50`,borderRadius:10,padding:"10px 14px",marginBottom:4,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:16}}>✦</span>
                <div style={{fontFamily:F.mono,fontSize:9,color:C.tealD}}>
                  Fields highlighted in <span style={{background:C.tealL,border:`1px solid ${C.teal}60`,padding:"1px 5px",borderRadius:4,color:C.teal,fontWeight:700}}>AI</span> were auto-extracted from uploaded documents. Review and correct if needed.
                </div>
              </div>
            )}
            <div className="form-col">
              <div className="form-section">
                <div className="form-sec-title">Personal Details</div>
                {inp("name","Full Name")}
                {inp("dob","Date of Birth")}
                {sel("gender","Gender",["Male","Female","Other","Prefer not to say"])}
                {inp("nationality","Nationality")}
                {inp("phone","Phone Number","tel")}
                {inp("email","Email Address","email")}
              </div>
              <div className="form-section">
                <div className="form-sec-title">Document Numbers</div>
                {inp("passportNo","Passport Number")}
                {inp("passportExpiry","Passport Expiry")}
                {inp("aadharNo","Aadhaar Number")}
                {inp("iqamaNo","Iqama Number")}
                {inp("iqamaExpiry","Iqama Expiry")}
                {inp("dlNo","DL Number")}
                {inp("dlExpiry","DL Expiry")}
              </div>
            </div>
            <div className="form-col">
              <div className="form-section">
                <div className="form-sec-title">Address</div>
                {ta("permanentAddr","Permanent Address",3)}
                {ta("localAddr","Corresponding / Local Address",3)}
              </div>
              <div className="form-section">
                <div className="form-sec-title">Role & Shift</div>
                {inp("role","Job Title / Role")}
                {sel("dept","Department",Object.keys(DEPTS))}
                {sel("shift","Shift",["Morning","Afternoon","Night"])}
              </div>
              <div className="form-section">
                <div className="form-sec-title">Visa Details</div>
                {inp("visaType","Visa Type")}
                {inp("visaPeriod","Visa Period")}
                {inp("visaExpiry","Visa Expiry Date")}
              </div>
              <div className="form-section">
                <div className="form-sec-title">Reference & Emergency</div>
                {inp("reference","Reference Name")}
                {inp("refPhone","Reference Phone","tel")}
                {inp("emergencyName","Emergency Contact")}
                {inp("emergencyPhone","Emergency Phone","tel")}
              </div>
            </div>
          </>}

          {step===3&&<>
            <div className="form-col">
              <div className="form-section">
                <div className="form-sec-title">Salary & Compensation</div>
                {inp("salary","Basic Salary (₹)")}
                {sel("salaryType","Pay Cycle",["Monthly","Weekly","Annual"])}
                {inp("insurance","Insurance Coverage")}
                {inp("flightTickets","Flight Ticket Entitlement")}
                <div className="form-row">
                  <label className="form-lbl">Other Benefits</label>
                  <textarea className="form-input" rows={2} placeholder="e.g. meal allowance, accommodation…" style={{resize:"none"}}/>
                </div>
              </div>
            </div>
            <div className="form-col">
              <div className="form-section">
                <div className="form-sec-title">Leaves</div>
                {inp("totalLeaves","Total Annual Leaves")}
                {sel("leaveTypes","Leave Types Available",["Casual, Sick, Earned","Casual, Sick","All Types"])}
                <div style={{background:C.bgL,borderRadius:8,padding:"10px 11px",border:`1px solid ${C.borderL}`,marginTop:4}}>
                  <div style={{fontFamily:F.mono,fontSize:8.5,color:C.t4,letterSpacing:".1em",marginBottom:6}}>LEAVE BREAKDOWN</div>
                  {[["Casual Leave","7"],["Sick Leave","10"],["Earned Leave","4"]].map(([t,d])=>(
                    <div key={t} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:11.5}}>
                      <span style={{color:C.t3}}>{t}</span>
                      <span style={{fontFamily:F.mono,fontWeight:700,color:C.t1}}>{d} days</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-section">
                <div className="form-sec-title">Accommodation</div>
                {sel("accommodation","Accommodation Type",["Staff Quarters","HRA Provided","Hotel Subsidised","Self-arranged"])}
                {inp("accommodationDetail","Details (optional)")}
              </div>
            </div>
          </>}

          {step===4&&(
            <div style={{gridColumn:"1/-1"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                {/* Summary cards */}
                {[
                  {title:"Personal",icon:"👤",rows:[["Name",form.name||"—"],["Phone",form.phone||"—"],["Email",form.email||"—"],["Department",form.dept],["Role",form.role||"—"],["Shift",form.shift]]},
                  {title:"Address",icon:"🏠",rows:[["Permanent",form.permanentAddr||"—"],["Local",form.localAddr||"—"],["Reference",form.reference||"—"],["Emergency",form.emergencyName||"—"]]},
                  {title:"Documents",icon:"📋",rows:Object.entries(scanStates).filter(([,v])=>v==="done").map(([k])=>[k.charAt(0).toUpperCase()+k.slice(1),`✓ Scanned & extracted`])},
                  {title:"Employment",icon:"💼",rows:[["Salary",form.salary?`₹${form.salary}`:"—"],["Pay Cycle",form.salaryType],["Leaves",form.totalLeaves+" days"],["Insurance",form.insurance||"—"],["Flight Tickets",form.flightTickets]]},
                ].map(card=>(
                  <div key={card.title} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:11,padding:"13px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
                      <span style={{fontSize:17}}>{card.icon}</span>
                      <span style={{fontFamily:F.mono,fontSize:9,color:C.t4,letterSpacing:".12em",fontWeight:700}}>{card.title.toUpperCase()}</span>
                    </div>
                    {card.rows.map(([k,v])=>(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${C.borderL}`,fontSize:11.5}}>
                        <span style={{color:C.t4,fontSize:10.5}}>{k}</span>
                        <span style={{fontWeight:600,color:C.t1,maxWidth:200,textAlign:"right",wordBreak:"break-word"}}>{v}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{background:C.goldL,border:`1px solid ${C.gold}60`,borderRadius:10,padding:"11px 14px",marginTop:14,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:18}}>✦</span>
                <div style={{fontFamily:F.mono,fontSize:10,color:C.goldD}}>Review all details before creating the profile. Documents will be stored securely and marked for verification.</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          {step>1&&<button className="sbtn sbtn-outline" onClick={()=>setStep(s=>s-1)}>← Back</button>}
          <button className="sbtn sbtn-outline" onClick={onClose}>Cancel</button>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
            {step===1&&docsScanned===0&&(
              <span style={{fontFamily:F.mono,fontSize:9,color:C.amber}}>Upload at least 1 document to continue</span>
            )}
            {step<4
              ?<button className="sbtn sbtn-gold"
                  style={{opacity:step===1&&docsScanned===0?.45:1,cursor:step===1&&docsScanned===0?"not-allowed":"pointer"}}
                  onClick={()=>{if(step===1&&docsScanned===0)return;setStep(s=>s+1);}}>
                  Next →
                </button>
              :<button className="sbtn sbtn-gold" onClick={handleSubmit}>✓ Create Staff Profile</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ PROFILE DRAWER ════════════════════════ */
function ProfileDrawer({staff,onClose,fireToast}){
  const[dtab,setDtab]=useState("overview");
  if(!staff)return null;
  const dept=DEPTS[staff.dept]||DEPTS["Front Desk"];
  const shift=SHIFTS[staff.shift]||SHIFTS.Morning;
  const status=STATUSES[staff.status]||STATUSES["On Shift"];
  const rc=ratingColor(staff.rating);
  const DTABS=[{key:"overview",label:"OVERVIEW"},{key:"documents",label:"DOCUMENTS"},{key:"employment",label:"EMPLOYMENT"},{key:"leaves",label:"LEAVES"}];

  const VerBadge=({ok})=>(
    <span className="verified-badge" style={{background:ok?C.greenL:C.redL,color:ok?C.green:C.red,border:`1px solid ${ok?C.greenD:C.redD}40`}}>
      {ok?"✓ VERIFIED":"⚠ UNVERIFIED"}
    </span>
  );

  const DRow=({label,val,mono=false,color=null,bold=false})=>(
    <div className="d-row">
      <span className="d-lbl">{label}</span>
      <span className="d-val" style={{fontFamily:mono?F.mono:"inherit",color:color||C.t1,fontWeight:bold?700:600}}>{val}</span>
    </div>
  );

  const renderOverview=()=>(
    <div>
      <div className="d-sec">
        <div className="d-sec-title">Today's Performance</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          {[
            {val:staff.tasksToday,lbl:"Tasks Today",color:C.t1},
            {val:staff.rating+"/5",lbl:"Guest Rating",color:rc},
          ].map(s=>(
            <div key={s.lbl} style={{background:C.bgL,border:`1px solid ${C.borderL}`,borderRadius:9,padding:"10px 12px"}}>
              <div style={{fontFamily:F.serif,fontSize:22,fontWeight:700,color:s.color,lineHeight:1}}>{s.val}</div>
              <div style={{fontFamily:F.mono,fontSize:7.5,color:C.t4,letterSpacing:".09em",marginTop:3}}>{s.lbl.toUpperCase()}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[
            {val:staff.avgResponse,lbl:"Avg Response",color:C.t1},
            {val:staff.tasksTotal.toLocaleString("en-IN"),lbl:"All-Time Tasks",color:C.teal},
          ].map(s=>(
            <div key={s.lbl} style={{background:C.bgL,border:`1px solid ${C.borderL}`,borderRadius:9,padding:"10px 12px"}}>
              <div style={{fontFamily:F.mono,fontSize:16,fontWeight:700,color:s.color,lineHeight:1}}>{s.val}</div>
              <div style={{fontFamily:F.mono,fontSize:7.5,color:C.t4,letterSpacing:".09em",marginTop:3}}>{s.lbl.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="d-sec">
        <div className="d-sec-title">Contact</div>
        <DRow label="Phone" val={staff.phone} mono/>
        <DRow label="Email" val={staff.email}/>
        <DRow label="Reports To" val={staff.reportTo}/>
        <DRow label="Joined" val={staff.joined}/>
      </div>
      <div className="d-sec">
        <div className="d-sec-title">Address</div>
        <div className="d-row" style={{flexDirection:"column",gap:4}}>
          <span className="d-lbl">Permanent</span>
          <span style={{fontSize:11.5,color:C.t1,lineHeight:1.5}}>{staff.address?.permanent||"—"}</span>
        </div>
        <div className="d-row" style={{flexDirection:"column",gap:4,marginTop:8}}>
          <span className="d-lbl">Local / Corresponding</span>
          <span style={{fontSize:11.5,color:C.t1,lineHeight:1.5}}>{staff.address?.local||"—"}</span>
        </div>
      </div>
      {staff.reference&&(
        <div className="d-sec">
          <div className="d-sec-title">Reference</div>
          <DRow label="Name" val={staff.reference.name} bold/>
          <DRow label="Relation" val={staff.reference.relation}/>
          <DRow label="Phone" val={staff.reference.phone} mono/>
          <DRow label="Email" val={staff.reference.email}/>
        </div>
      )}
      {staff.emergency&&(
        <div className="d-sec">
          <div className="d-sec-title">Emergency Contact</div>
          <DRow label="Name" val={staff.emergency.name} bold/>
          <DRow label="Relation" val={staff.emergency.relation}/>
          <DRow label="Phone" val={staff.emergency.phone} mono/>
        </div>
      )}
    </div>
  );

  const renderDocuments=()=>{
    const docs=staff.docs||{};
    const DOC_DEFS={
      passport:{icon:"🛂",label:"Passport",color:C.blue,bg:C.blueL},
      aadhar:{icon:"🪪",label:"Aadhaar Card",color:C.teal,bg:C.tealL},
      iqama:{icon:"📋",label:"Iqama / Residence Permit",color:C.amber,bg:C.amberL},
      dl:{icon:"🚗",label:"Driving Licence",color:C.purple,bg:C.purpleL},
    };
    return(
      <div>
        {/* Visa strip */}
        {staff.visa&&staff.visa.type!=="N/A – Indian National"&&(
          <div style={{background:staff.visa.daysLeft&&staff.visa.daysLeft<30?C.redL:C.amberL,border:`1px solid ${staff.visa.daysLeft&&staff.visa.daysLeft<30?C.red:C.amber}60`,borderRadius:10,padding:"11px 14px",marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontSize:16}}>🛬</span>
              <span style={{fontFamily:F.mono,fontSize:9,fontWeight:700,color:staff.visa.daysLeft&&staff.visa.daysLeft<30?C.red:C.amber,letterSpacing:".1em"}}>VISA STATUS</span>
              {staff.visa.daysLeft&&staff.visa.daysLeft<30&&(
                <span className="visa-urgent" style={{marginLeft:"auto",fontFamily:F.mono,fontSize:8.5,color:C.red,fontWeight:700}}>⚠ EXPIRING SOON</span>
              )}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                ["Type",staff.visa.type],
                ["Period",staff.visa.period],
                ["Expiry",staff.visa.expiry],
                ["Days Left",staff.visa.daysLeft?`${staff.visa.daysLeft} days`:"—"],
              ].map(([l,v])=>(
                <div key={l} style={{background:"rgba(255,255,255,.6)",borderRadius:7,padding:"7px 10px"}}>
                  <div style={{fontFamily:F.mono,fontSize:7.5,color:C.t4,letterSpacing:".08em"}}>{l}</div>
                  <div style={{fontFamily:F.mono,fontSize:11,fontWeight:700,color:staff.visa.daysLeft&&l==="Days Left"&&staff.visa.daysLeft<30?C.red:C.t1,marginTop:2}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {Object.entries(DOC_DEFS).map(([key,def])=>{
          const doc=docs[key];
          return(
            <div key={key} className="doc-card">
              <div className="doc-card-hd">
                <div className="doc-icon" style={{background:def.bg,border:`1px solid ${def.color}40`}}>{def.icon}</div>
                <div style={{flex:1}}>
                  <div className="doc-title">{def.label}</div>
                  {doc
                    ?<div className="doc-sub">Uploaded {doc.uploaded||doc.issueDate||"—"}</div>
                    :<div className="doc-sub" style={{color:C.t4}}>Not uploaded</div>
                  }
                </div>
                {doc&&<VerBadge ok={doc.verified}/>}
              </div>
              {doc?(
                <div style={{background:C.bgL,borderRadius:9,padding:"10px 12px",border:`1px solid ${C.borderL}`}}>
                  {key==="passport"&&<>
                    <DRow label="Passport No" val={doc.number} mono bold/>
                    <DRow label="Country" val={doc.country}/>
                    <DRow label="Issue Date" val={doc.issueDate}/>
                    <DRow label="Expiry" val={doc.expiry} color={daysLeft(doc.expiry)<180?C.red:C.t1}/>
                    <DRow label="Days to Expiry" val={daysLeft(doc.expiry)?`${daysLeft(doc.expiry)} days`:"—"} color={daysLeft(doc.expiry)<180?C.red:C.green} mono bold/>
                  </>}
                  {key==="aadhar"&&<>
                    <DRow label="Aadhaar No" val={doc.number} mono bold/>
                    <DRow label="Uploaded" val={doc.uploaded}/>
                  </>}
                  {key==="iqama"&&<>
                    <DRow label="Iqama No" val={doc.number} mono bold/>
                    <DRow label="Sponsor" val={doc.sponsor}/>
                    <DRow label="Issue Date" val={doc.issueDate}/>
                    <DRow label="Expiry" val={doc.expiry} color={C.red}/>
                  </>}
                  {key==="dl"&&<>
                    <DRow label="DL No" val={doc.number} mono bold/>
                    <DRow label="Type" val={doc.type}/>
                    <DRow label="Issue State" val={doc.issueState}/>
                    <DRow label="Expiry" val={doc.expiry} color={!doc.verified?C.red:C.t1}/>
                    {!doc.verified&&<div style={{fontFamily:F.mono,fontSize:8.5,color:C.red,marginTop:6,padding:"4px 8px",background:C.redL,borderRadius:6}}>⚠ Verification pending</div>}
                  </>}
                </div>
              ):(
                <div className="upload-zone" onClick={()=>fireToast(`Opening upload for ${def.label}…`)}>
                  <div style={{fontSize:22,opacity:.3,marginBottom:6}}>{def.icon}</div>
                  <div style={{fontFamily:F.mono,fontSize:10,color:C.t4}}>Click to upload {def.label}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderEmployment=()=>{
    const sal=staff.salary;
    const ben=staff.benefits;
    return(
      <div>
        <div className="d-sec">
          <div className="d-sec-title">Salary</div>
          <div style={{background:C.navy,borderRadius:10,padding:"12px 14px",marginBottom:10}}>
            <div style={{fontFamily:F.mono,fontSize:8.5,color:"#456080",letterSpacing:".1em",marginBottom:4}}>TOTAL MONTHLY COMPENSATION</div>
            <div style={{fontFamily:F.serif,fontSize:28,fontWeight:700,color:C.gold}}>₹{sal?.total?.toLocaleString("en-IN")||"—"}</div>
            <div style={{fontFamily:F.mono,fontSize:9,color:"#456080",marginTop:3}}>{sal?.cycle||"Monthly"} · {sal?.currency||"INR"}</div>
          </div>
          {sal&&<>
            <DRow label="Basic Salary" val={`₹${sal.basic?.toLocaleString("en-IN")}`} mono/>
            <DRow label="HRA" val={`₹${sal.hra?.toLocaleString("en-IN")}`} mono/>
            <DRow label="Allowances" val={`₹${sal.allowances?.toLocaleString("en-IN")}`} mono/>
          </>}
        </div>
        {ben&&<div className="d-sec">
          <div className="d-sec-title">Benefits & Facilities</div>
          <div style={{background:C.greenL,border:`1px solid ${C.greenD}40`,borderRadius:9,padding:"10px 12px",marginBottom:8}}>
            <div style={{fontFamily:F.mono,fontSize:8,color:C.green,letterSpacing:".1em",marginBottom:4}}>🏥 INSURANCE</div>
            <div style={{fontSize:12.5,fontWeight:600,color:C.t1}}>{ben.insurance}</div>
          </div>
          <div style={{background:C.blueL,border:`1px solid ${C.blueD}40`,borderRadius:9,padding:"10px 12px",marginBottom:8}}>
            <div style={{fontFamily:F.mono,fontSize:8,color:C.blue,letterSpacing:".1em",marginBottom:4}}>✈ FLIGHT TICKETS</div>
            <div style={{fontSize:12.5,fontWeight:600,color:C.t1}}>{ben.flightTickets}</div>
          </div>
          <div style={{background:C.amberL,border:`1px solid ${C.amberD}40`,borderRadius:9,padding:"10px 12px",marginBottom:8}}>
            <div style={{fontFamily:F.mono,fontSize:8,color:C.amber,letterSpacing:".1em",marginBottom:4}}>🏠 ACCOMMODATION</div>
            <div style={{fontSize:12.5,fontWeight:600,color:C.t1}}>{ben.accommodation}</div>
          </div>
          {ben.other?.length>0&&(
            <div style={{background:C.bgL,border:`1px solid ${C.borderL}`,borderRadius:9,padding:"10px 12px"}}>
              <div style={{fontFamily:F.mono,fontSize:8,color:C.t4,letterSpacing:".1em",marginBottom:6}}>OTHER BENEFITS</div>
              {ben.other.map(o=>(
                <div key={o} style={{display:"flex",alignItems:"center",gap:6,padding:"3px 0",fontSize:11.5}}>
                  <span style={{color:C.green}}>✓</span>
                  <span style={{color:C.t2}}>{o}</span>
                </div>
              ))}
            </div>
          )}
        </div>}
      </div>
    );
  };

  const renderLeaves=()=>{
    const lv=staff.leaves;
    if(!lv)return<div style={{padding:20,color:C.t4,fontFamily:F.mono,fontSize:11}}>No leave data available</div>;
    const leaveTypeColors={Casual:C.blue,Sick:C.red,Earned:C.green};
    const pct=Math.round((lv.taken/lv.total)*100);
    return(
      <div>
        {/* Summary donuts */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
          {[
            {label:"Total",val:lv.total,color:C.navy},
            {label:"Taken",val:lv.taken,color:C.amber},
            {label:"Balance",val:lv.balance,color:C.green},
          ].map(s=>(
            <div key={s.label} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 10px",textAlign:"center"}}>
              <div style={{fontFamily:F.serif,fontSize:26,fontWeight:700,color:s.color,lineHeight:1}}>{s.val}</div>
              <div style={{fontFamily:F.mono,fontSize:7.5,color:C.t4,letterSpacing:".1em",marginTop:3}}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
        {/* Progress */}
        <div style={{background:C.bgL,border:`1px solid ${C.borderL}`,borderRadius:10,padding:"12px 14px",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontFamily:F.mono,fontSize:8.5,color:C.t4}}>LEAVE USED</span>
            <span style={{fontFamily:F.mono,fontSize:9,fontWeight:700,color:pct>80?C.red:C.amber}}>{pct}%</span>
          </div>
          <div style={{height:8,borderRadius:4,background:C.border}}>
            <div style={{width:`${pct}%`,height:"100%",borderRadius:4,background:pct>80?C.red:C.amber,transition:"width .5s"}}/>
          </div>
        </div>
        {/* Leave type breakdown */}
        <div className="d-sec">
          <div className="d-sec-title">Leave Types</div>
          {Object.entries(lv.types||{}).map(([type,days])=>{
            const typeLabel=type.charAt(0).toUpperCase()+type.slice(1);
            const col=leaveTypeColors[typeLabel]||C.blue;
            return(
              <div key={type} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",background:C.bgL,borderRadius:8,marginBottom:6,border:`1px solid ${C.borderL}`}}>
                <div style={{width:8,height:8,borderRadius:2,background:col,flexShrink:0}}/>
                <span style={{flex:1,fontSize:12}}>{typeLabel} Leave</span>
                <span style={{fontFamily:F.mono,fontSize:11,fontWeight:700,color:col}}>{days} days</span>
              </div>
            );
          })}
        </div>
        {/* Leave history */}
        <div className="d-sec">
          <div className="d-sec-title">Leave History</div>
          {(lv.history||[]).map((h,i)=>{
            const col=leaveTypeColors[h.type]||C.blue;
            return(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 11px",background:C.white,borderRadius:9,marginBottom:7,border:`1px solid ${C.border}`}}>
                <span style={{display:"inline-flex",padding:"2px 8px",borderRadius:8,background:`${col}18`,color:col,border:`1px solid ${col}40`,fontFamily:F.mono,fontSize:8,fontWeight:700,flexShrink:0,marginTop:1}}>{h.type.toUpperCase()}</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:F.mono,fontSize:10,color:C.t4}}>{h.date}</div>
                  <div style={{fontSize:12,color:C.t2,marginTop:2}}>{h.reason}</div>
                </div>
                <span style={{fontFamily:F.mono,fontSize:11,fontWeight:700,color:C.t1,flexShrink:0}}>{h.days}d</span>
              </div>
            );
          })}
          {(!lv.history||lv.history.length===0)&&<div style={{fontFamily:F.mono,fontSize:10,color:C.t4,textAlign:"center",padding:16}}>No leave history</div>}
        </div>
      </div>
    );
  };

  const tabContent={overview:renderOverview,documents:renderDocuments,employment:renderEmployment,leaves:renderLeaves};

  return(
    <div className="drawer-overlay">
      <div className="drawer-bg" onClick={onClose}/>
      <div className="drawer">
        {/* Header */}
        <div className="drawer-hd">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div style={{fontFamily:F.mono,fontSize:7.5,color:"#3A5070",letterSpacing:".15em"}}>STAFF PROFILE</div>
            <button onClick={onClose} style={{background:"none",border:"none",color:"#456080",cursor:"pointer",fontSize:17,padding:2,lineHeight:1}}>✕</button>
          </div>
          <div style={{display:"flex",gap:13,alignItems:"center"}}>
            <div className="d-photo"><img src={staff.photo} alt={staff.name} onError={e=>e.target.parentNode.innerHTML=`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:serif;font-weight:700;color:#fff;font-size:20px">${staff.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>`}/></div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:F.serif,fontSize:20,fontWeight:700,color:"#F5EDDA",lineHeight:1.2}}>{staff.name}</div>
              <div style={{fontFamily:F.mono,fontSize:9.5,color:"#456080",marginTop:3}}>{staff.role}</div>
              <div style={{display:"flex",gap:5,marginTop:6,flexWrap:"wrap"}}>
                <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:9,background:dept.bg+"30",color:dept.color,border:`1px solid ${dept.border}50`,fontFamily:F.mono,fontSize:7.5,fontWeight:700,letterSpacing:".07em"}}>{dept.icon} {staff.dept.toUpperCase()}</span>
                <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:9,background:status.bg,color:status.color,border:`1px solid ${status.color}40`,fontFamily:F.mono,fontSize:7.5,fontWeight:700,letterSpacing:".06em"}}>
                  <span style={{width:5,height:5,borderRadius:"50%",background:status.dot,display:"inline-block"}}/>
                  {staff.status.toUpperCase()}
                </span>
                <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:9,background:shift.color+"20",color:shift.color,border:`1px solid ${shift.color}40`,fontFamily:F.mono,fontSize:7.5,fontWeight:700}}>{shift.icon} {staff.shift.toUpperCase()}</span>
              </div>
            </div>
          </div>
          {/* Visa urgency in header */}
          {staff.visa?.daysLeft&&staff.visa.daysLeft<30&&(
            <div className="visa-urgent" style={{marginTop:10,background:C.redL,border:`1px solid ${C.red}50`,borderRadius:8,padding:"6px 10px",display:"flex",alignItems:"center",gap:7}}>
              <span style={{fontSize:14}}>⚠️</span>
              <span style={{fontFamily:F.mono,fontSize:9,color:C.red,fontWeight:700}}>VISA EXPIRING IN {staff.visa.daysLeft} DAYS — Action required</span>
            </div>
          )}
        </div>

        {/* Sub-tabs */}
        <div className="drawer-topnav">
          {DTABS.map(t=>(
            <div key={t.key} className={`drawer-tab${dtab===t.key?" active":""}`} onClick={()=>setDtab(t.key)}>{t.label}</div>
          ))}
        </div>

        {/* Body */}
        <div className="drawer-body">
          {(tabContent[dtab]||renderOverview)()}
        </div>

        {/* Actions */}
        <div className="drawer-footer">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7}}>
            <button className="abtn abtn-gold" onClick={()=>fireToast(`Opening ${staff.name}'s task queue…`)}>📋 Tasks</button>
            <button className="abtn abtn-navy" onClick={()=>fireToast(`Messaging ${staff.name}…`)}>💬 Message</button>
            <button className="abtn abtn-outline" onClick={()=>fireToast(`Editing ${staff.name}'s profile…`)}>✎ Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ MAIN APP ════════════════════════════════ */
export default function Staff(){
  const[tab,setTab]=useState("directory");
  const[selected,setSelected]=useState(null);
  const[search,setSearch]=useState("");
  const[deptFilter,setDeptFilter]=useState(null);
  const[toast,setToast]=useState(null);
  const[showAdd,setShowAdd]=useState(false);
  const[staffList,setStaffList]=useState(STAFF);

  const fireToast=useCallback((msg)=>{setToast(msg);setTimeout(()=>setToast(null),2600);},[]);

  const filteredStaff=useMemo(()=>{
    let list=staffList;
    if(deptFilter)list=list.filter(s=>s.dept===deptFilter);
    if(search.trim()){const q=search.toLowerCase();list=list.filter(s=>s.name.toLowerCase().includes(q)||s.role.toLowerCase().includes(q)||s.dept.toLowerCase().includes(q)||s.status.toLowerCase().includes(q));}
    return list;
  },[staffList,search,deptFilter]);

  const stats=useMemo(()=>({
    total:staffList.length,onShift:staffList.filter(s=>s.status==="On Shift").length,
    tasksToday:staffList.reduce((a,s)=>a+s.tasksToday,0),
    avgRating:(staffList.reduce((a,s)=>a+s.rating,0)/staffList.length).toFixed(1),
  }),[staffList]);

  const TABS=[{key:"directory",label:"Staff Directory",icon:"👥",count:staffList.length},{key:"shifts",label:"Shift Schedule",icon:"🗓",count:null},{key:"performance",label:"Performance",icon:"📊",count:null},{key:"roles",label:"Roles & Access",icon:"🔐",count:ROLES_CONFIG.length}];
  const selectedStaff=staffList.find(s=>s.id===selected);

  const handleAddStaff=(form)=>{
    const newStaff={
      id:staffList.length+1,name:form.name||"New Staff",role:form.role||"Staff",dept:form.dept,shift:form.shift,
      status:"On Shift",photo:"",phone:form.phone||"",email:form.email||"",joined:new Date().toLocaleDateString("en-IN",{month:"short",year:"numeric"}),
      rating:4.0,tasksToday:0,tasksTotal:0,roomsCleaned:0,avgResponse:"—",permissions:["basic"],reportTo:"Priya Kapoor",hierarchy:"Staff",
      docs:{aadhar:null,passport:null,dl:null,iqama:null},
      address:{permanent:form.permanentAddr||"—",local:form.localAddr||"—"},
      visa:{type:form.visaType||"N/A",period:form.visaPeriod||"—",expiry:form.visaExpiry||"—",daysLeft:null},
      salary:{basic:parseInt(form.salary)||0,hra:0,allowances:0,total:parseInt(form.salary)||0,currency:"INR",cycle:form.salaryType},
      benefits:{insurance:form.insurance||"None",flightTickets:form.flightTickets||"None",accommodation:"—",other:[]},
      leaves:{total:parseInt(form.totalLeaves)||21,taken:0,balance:parseInt(form.totalLeaves)||21,types:{casual:7,sick:10,earned:4},history:[]},
      reference:{name:form.reference||"—",relation:"—",phone:form.refPhone||"—",email:""},
      emergency:{name:form.emergencyName||"—",relation:"—",phone:form.emergencyPhone||"—"},
    };
    setStaffList(p=>[...p,newStaff]);
  };

  const renderDirectory=()=>(
    <div>
      <div className="staff-grid">
        {filteredStaff.map((s,i)=>{
          const dept=DEPTS[s.dept]||DEPTS["Front Desk"];
          const status=STATUSES[s.status]||STATUSES["On Shift"];
          const shift=SHIFTS[s.shift]||SHIFTS.Morning;
          const rc=ratingColor(s.rating);
          const hasVisaAlert=s.visa?.daysLeft&&s.visa.daysLeft<30;
          return(
            <div key={s.id} className={`staff-card card-anim${selected===s.id?" selected":""}`} style={{animationDelay:`${Math.min(i,10)*30}ms`}} onClick={()=>setSelected(p=>p===s.id?null:s.id)}>
              <div className="shift-tag" style={{background:shift.color+"20",color:shift.color,border:`1px solid ${shift.color}40`}}>{shift.icon} {s.shift}</div>
              {hasVisaAlert&&<div style={{position:"absolute",top:12,left:12,width:8,height:8,borderRadius:"50%",background:C.red,animation:"blink 1s ease infinite"}}/>}
              <div className="staff-card-top">
                <StaffPhoto src={s.photo} name={s.name} size={46} radius={11}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13.5,fontWeight:700,color:C.t1,lineHeight:1.2}}>{s.name}</div>
                  <div style={{fontSize:11,color:C.t3,marginTop:2}}>{s.role}</div>
                  <div style={{display:"flex",gap:5,marginTop:4,flexWrap:"wrap"}}>
                    <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:10,background:dept.bg,color:dept.color,border:`1px solid ${dept.border}40`,fontFamily:F.mono,fontSize:8,fontWeight:700}}>{dept.icon} {s.dept}</span>
                    <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:10,background:status.bg,color:status.color,border:`1px solid ${status.color}30`,fontFamily:F.mono,fontSize:8,fontWeight:700}}>
                      <span style={{width:5,height:5,borderRadius:"50%",background:status.dot,display:"inline-block"}}/>
                      {s.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="staff-metrics">
                <div className="metric-box"><div className="metric-val">{s.tasksToday}</div><div className="metric-lbl">Tasks Today</div></div>
                <div className="metric-box"><div className="metric-val" style={{color:rc,fontSize:13}}>{s.rating}</div><div className="metric-lbl">Rating</div></div>
                <div className="metric-box"><div className="metric-val" style={{fontSize:11}}>{s.avgResponse}</div><div className="metric-lbl">Avg Response</div></div>
                <div className="metric-box"><div className="metric-val" style={{fontSize:11}}>{s.hierarchy}</div><div className="metric-lbl">Level</div></div>
              </div>
              {/* Doc summary */}
              <div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>
                {s.docs&&Object.entries(s.docs).map(([k,v])=>v?(
                  <span key={k} style={{display:"inline-flex",alignItems:"center",gap:3,padding:"1.5px 7px",borderRadius:7,background:v.verified?C.greenL:C.redL,color:v.verified?C.green:C.red,border:`1px solid ${v.verified?C.greenD:C.redD}40`,fontFamily:F.mono,fontSize:7.5,fontWeight:700}}>
                    {v.verified?"✓":"⚠"} {k.toUpperCase()}
                  </span>
                ):null)}
              </div>
            </div>
          );
        })}
      </div>
      {filteredStaff.length===0&&<div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:32,opacity:.3,marginBottom:10}}>👥</div><div style={{fontFamily:F.serif,fontSize:20,color:C.t2}}>No staff found</div></div>}
    </div>
  );

  const renderShifts=()=>(
    <div>
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px",marginBottom:16}}>
        <div style={{fontFamily:F.mono,fontSize:8.5,color:C.t4,letterSpacing:".12em",marginBottom:8}}>24-HOUR SHIFT COVERAGE</div>
        <div style={{display:"flex",height:18,borderRadius:5,overflow:"hidden",gap:1}}>
          {[{label:"06:00–14:00",color:C.gold,pct:33},{label:"14:00–22:00",color:C.teal,pct:34},{label:"22:00–06:00",color:C.blue,pct:33}].map(s=>(
            <div key={s.label} style={{flex:s.pct,background:s.color+"30",border:`1px solid ${s.color}40`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontFamily:F.mono,fontSize:8,color:s.color,fontWeight:700}}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16}}>
        {Object.entries(SHIFT_SCHEDULE).map(([dept,members])=>{
          const d=DEPTS[dept]||DEPTS["Front Desk"];
          return(
            <div key={dept} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:13,overflow:"hidden"}}>
              <div style={{padding:"12px 16px",background:d.bg,borderBottom:`1px solid ${d.border}30`,display:"flex",alignItems:"center",gap:9}}>
                <span style={{fontSize:18}}>{d.icon}</span>
                <div>
                  <div style={{fontFamily:F.serif,fontSize:16,fontWeight:600,color:d.color}}>{dept}</div>
                  <div style={{fontFamily:F.mono,fontSize:8,color:d.color+"90"}}>{members.length} STAFF</div>
                </div>
              </div>
              <div style={{padding:"0 14px 12px"}}>
                {members.map((m,i)=>{
                  const sh=SHIFTS[m.shift]||SHIFTS.Morning;
                  const offsets={Morning:"0",Afternoon:"33%",Night:"67%","Off":"0"};
                  const widths={Morning:"33%",Afternoon:"34%",Night:"33%","Off":"100%"};
                  const staffObj=staffList.find(s=>s.id===m.id);
                  return(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<members.length-1?`1px solid ${C.borderL}`:"none",cursor:m.id?"pointer":"default"}} onClick={()=>m.id&&setSelected(m.id)}>
                      {staffObj?<StaffPhoto src={staffObj.photo} name={staffObj.name} size={30} radius={7}/>:<div style={{width:30,height:30,borderRadius:7,background:C.bgM,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>?</div>}
                      <div style={{flex:1}}>
                        <div style={{fontSize:11.5,fontWeight:600,color:C.t2,width:90,flexShrink:0}}>{m.name}</div>
                        <div style={{height:16,background:C.bgL,borderRadius:4,position:"relative",overflow:"hidden",marginTop:3}}>
                          <div style={{position:"absolute",left:offsets[m.shift],width:widths[m.shift],height:"100%",background:sh.color+"25",border:`1px solid ${sh.color}40`,borderRadius:3,display:"flex",alignItems:"center",paddingLeft:5}}>
                            <span style={{fontFamily:F.mono,fontSize:7.5,color:sh.color,fontWeight:700,whiteSpace:"nowrap"}}>{sh.icon} {sh.label}</span>
                          </div>
                        </div>
                      </div>
                      <span style={{fontFamily:F.mono,fontSize:8.5,color:sh.color,flexShrink:0}}>{sh.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPerformance=()=>{
    const sorted=[...staffList].sort((a,b)=>b.rating-a.rating);
    const medals=["🥇","🥈","🥉"];
    return(
      <div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
          {sorted.slice(0,3).map((s,i)=>{const rc=ratingColor(s.rating);return(
            <div key={s.id} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px",cursor:"pointer"}} onClick={()=>setSelected(s.id)}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
                <StaffPhoto src={s.photo} name={s.name} size={40} radius={10}/>
                <div><div style={{fontSize:12,fontWeight:700,color:C.t1}}>{medals[i]} {s.name}</div><div style={{fontSize:10.5,color:C.t3}}>{s.role}</div></div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontFamily:F.serif,fontSize:24,fontWeight:700,color:rc}}>{s.rating}</div>
                <div style={{fontFamily:F.mono,fontSize:9,color:C.t4}}>{s.tasksToday} tasks today</div>
              </div>
              <div style={{height:4,borderRadius:2,background:C.border,marginTop:8}}>
                <div style={{width:`${s.rating/5*100}%`,height:"100%",borderRadius:2,background:rc}}/>
              </div>
            </div>
          );})}
        </div>
        <table className="perf-table">
          <thead><tr>{["Staff Member","Department","Shift","Tasks Today","All-Time","Avg Response","Rating"].map(h=><th key={h} className="perf-th">{h}</th>)}</tr></thead>
          <tbody>
            {sorted.map(s=>{
              const dept=DEPTS[s.dept]||DEPTS["Front Desk"];const shift=SHIFTS[s.shift]||SHIFTS.Morning;const rc=ratingColor(s.rating);
              return(
                <tr key={s.id} className="perf-tr" onClick={()=>setSelected(s.id)}>
                  <td className="perf-td"><div style={{display:"flex",alignItems:"center",gap:9}}><StaffPhoto src={s.photo} name={s.name} size={30} radius={7}/><div><div style={{fontWeight:700,color:C.t1,fontSize:12.5}}>{s.name}</div><div style={{fontSize:10.5,color:C.t3}}>{s.role}</div></div></div></td>
                  <td className="perf-td"><span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:8,background:dept.bg,color:dept.color,border:`1px solid ${dept.border}40`,fontFamily:F.mono,fontSize:8,fontWeight:700}}>{dept.icon} {s.dept}</span></td>
                  <td className="perf-td"><span style={{fontFamily:F.mono,fontSize:10.5,color:shift.color}}>{shift.icon} {s.shift}</span></td>
                  <td className="perf-td"><div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontFamily:F.mono,fontWeight:700,fontSize:13,minWidth:18}}>{s.tasksToday}</span><div className="perf-bar-bg"><div className="perf-bar-fill" style={{width:`${Math.min(s.tasksToday/14*100,100)}%`,background:C.teal}}/></div></div></td>
                  <td className="perf-td" style={{fontFamily:F.mono,fontSize:11,color:C.t2}}>{s.tasksTotal.toLocaleString("en-IN")}</td>
                  <td className="perf-td" style={{fontFamily:F.mono,fontSize:11,color:C.t3}}>{s.avgResponse}</td>
                  <td className="perf-td"><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:28,height:28,borderRadius:"50%",background:`${rc}18`,border:`2px solid ${rc}50`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.mono,fontSize:10,fontWeight:700,color:rc}}>{s.rating}</div></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderRoles=()=>(
    <div>
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 16px",marginBottom:16,display:"flex",gap:20,alignItems:"center"}}>
        <div>
          <div style={{fontFamily:F.mono,fontSize:8,color:C.t4,letterSpacing:".12em",marginBottom:4}}>ACCESS HIERARCHY</div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {[{label:"Level 1 — GM",color:C.gold},{label:"Level 2 — Lead",color:C.teal},{label:"Level 3 — Staff",color:C.blue}].map(l=>(
              <div key={l.label} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:2,background:l.color}}/><span style={{fontFamily:F.mono,fontSize:8.5,color:C.t4}}>{l.label}</span></div>
            ))}
          </div>
        </div>
        <div style={{marginLeft:"auto",fontFamily:F.mono,fontSize:9,color:C.t4}}>{ROLES_CONFIG.length} roles defined</div>
      </div>
      <div className="roles-grid">
        {ROLES_CONFIG.map(r=>{
          const dept=DEPTS[r.dept]||DEPTS["Front Desk"];const lc={1:C.gold,2:C.teal,3:C.blue}[r.level]||C.blue;
          return(
            <div key={r.role} className="role-card">
              <div className="role-card-hd">
                <div className="role-badge" style={{background:dept.bg,border:`1px solid ${dept.border}40`}}>{dept.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.t1}}>{r.role}</div>
                  <div style={{fontSize:10.5,color:C.t3,marginTop:1}}>{r.dept}</div>
                  <div style={{display:"flex",gap:3,marginTop:5}}>
                    {[1,2,3].map(pip=><div key={pip} className="level-pip" style={{background:pip<=r.level?lc:C.borderL,opacity:pip<=r.level?1:.4}}/>)}
                    <span style={{fontFamily:F.mono,fontSize:7.5,color:lc,marginLeft:4,letterSpacing:".06em"}}>L{r.level}</span>
                  </div>
                </div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:0}}>{r.permissions.map(p=><span key={p} className="perm-tag">{p}</span>)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const tabContent={directory:renderDirectory,shifts:renderShifts,performance:renderPerformance,roles:renderRoles};

  return(
    <>
      <style>{CSS}</style>
      <div className="shell">
        <header className="topbar">
          <div className="tb-logo">A</div>
          <div className="tb-hotel">The Grand Aurum</div>
          <div className="tb-sep"/>
          <nav className="tb-crumb">
            <span style={{color:"#456080"}}>Dashboard</span>
            <span style={{color:C.navyM}}>›</span>
            <span className="cur">Staff Operations</span>
          </nav>
          <div className="tb-right">
            <button className="tbtn tbtn-ghost" onClick={()=>fireToast("Exporting staff report…")}>⬇ Export</button>
            <button className="tbtn tbtn-ghost" onClick={()=>fireToast("Opening shift planner…")}>🗓 Shifts</button>
            <button className="tbtn tbtn-gold" onClick={()=>setShowAdd(true)}>+ Add Staff</button>
          </div>
        </header>

        <div className="body">
          <aside className="sidebar">
            <div className="sb-hd">
              <div className="sb-title">Staff Operations</div>
              <div className="sb-sub">WORKFORCE CONTROL CENTER</div>
              <div className="on-shift-count"><span className="on-dot"/>{stats.onShift} ON SHIFT NOW</div>
            </div>
            <div className="nav-tabs">
              {TABS.map(t=>(
                <div key={t.key} className={`nav-tab${tab===t.key?" active":""}`} onClick={()=>{setTab(t.key);setSelected(null);}}>
                  <span className="nav-tab-icon">{t.icon}</span>
                  <span className="nav-tab-label">{t.label}</span>
                  {t.count!=null&&<span className="nav-tab-count">{t.count}</span>}
                </div>
              ))}
            </div>
            <div className="dept-legend">
              <div className="legend-title">Departments</div>
              {Object.entries(DEPTS).map(([name,d])=>(
                <div key={name} className="legend-item" style={{color:deptFilter===name?d.color:C.t3}} onClick={()=>{setDeptFilter(p=>p===name?null:name);setTab("directory");}}>
                  <span className="legend-dot" style={{background:d.color}}/>{d.icon} {name}
                  <span style={{marginLeft:"auto",fontFamily:F.mono,fontSize:9,opacity:.6}}>{staffList.filter(s=>s.dept===name).length}</span>
                </div>
              ))}
            </div>
          </aside>

          <div className="main">
            <div className="summary-strip">
              {[
                {val:stats.total,lbl:"Total Staff",color:C.teal,pct:100},
                {val:stats.onShift,lbl:"On Shift Now",color:C.green,pct:(stats.onShift/stats.total)*100},
                {val:Object.keys(DEPTS).length,lbl:"Departments",color:C.gold,pct:100},
                {val:stats.tasksToday,lbl:"Tasks Today",color:C.amber,pct:Math.min(stats.tasksToday/100*100,100)},
                {val:stats.avgRating,lbl:"Avg Rating",color:C.purple,pct:(stats.avgRating/5)*100},
              ].map(s=>(
                <div key={s.lbl} className="sum-cell">
                  <div className="sum-val">{s.val}</div>
                  <div className="sum-lbl">{s.lbl}</div>
                  <div className="sum-bar"><div className="sum-fill" style={{width:`${s.pct}%`,background:s.color}}/></div>
                </div>
              ))}
            </div>
            {(tab==="directory"||tab==="performance")&&(
              <div className="toolbar">
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input placeholder="Search staff name, role, department…" value={search} onChange={e=>setSearch(e.target.value)}/>
                </div>
                {["Front Desk","Housekeeping","Maintenance","Concierge","F&B"].map(d=>(
                  <div key={d} className={`fchip${deptFilter===d?" on":""}`} onClick={()=>setDeptFilter(p=>p===d?null:d)}>{DEPTS[d]?.icon} {d}</div>
                ))}
                {(deptFilter||search)&&<div className="fchip" style={{borderColor:C.red,color:C.red}} onClick={()=>{setDeptFilter(null);setSearch("");}}>Clear ×</div>}
                <span style={{marginLeft:"auto",fontFamily:F.mono,fontSize:9,color:C.t4}}>{filteredStaff.length} staff</span>
              </div>
            )}
            <div className="content">{(tabContent[tab]||renderDirectory)()}</div>
          </div>
        </div>
      </div>

      {selected&&<ProfileDrawer staff={selectedStaff} onClose={()=>setSelected(null)} fireToast={fireToast}/>}
      {showAdd&&<AddStaffModal onClose={()=>setShowAdd(false)} onAdd={handleAddStaff} fireToast={fireToast}/>}
      {toast&&<div className="toast"><span style={{color:C.gold}}>✓</span> {toast}</div>}
    </>
  );
}
