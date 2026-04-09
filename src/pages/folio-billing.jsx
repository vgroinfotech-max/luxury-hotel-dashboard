import { useState, useRef, useEffect } from "react";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Lato:wght@300;400;700&family=JetBrains+Mono:wght@400;500;600&display=swap');`;

// ─── Color system ─────────────────────────────────────────────
const C = {
  bg:      '#f5f2ec',
  panel:   '#faf8f4',
  white:   '#ffffff',
  border:  '#e4dfd4',
  border2: '#d4cfc4',
  teal:    '#0c4a42',
  teal2:   '#156050',
  tealBg:  '#e8f4f1',
  tealBd:  '#9ecec7',
  gold:    '#9a6c10',
  goldBg:  '#fdf5e4',
  goldBd:  '#e0c070',
  red:     '#8b2a2a',
  redBg:   '#fdf0f0',
  redBd:   '#e0a0a0',
  green:   '#1e5c38',
  greenBg: '#eaf6ef',
  greenBd: '#90d0a8',
  amber:   '#8a4c08',
  amberBg: '#fef4e6',
  amberBd: '#e0b068',
  blue:    '#1a3e8c',
  blueBg:  '#eef4fd',
  blueBd:  '#a0c0f0',
  ink:     '#1a1814',
  ink2:    '#3c3830',
  ink3:    '#6c6860',
  ink4:    '#a8a49e',
  ink5:    '#ccc8c2',
};

// ─── Charge categories ─────────────────────────────────────────
const CHARGE_CATS = [
  { id:'room',       label:'Room Charge',    icon:'🛏', color: C.teal   },
  { id:'restaurant', label:'Restaurant',     icon:'🍽', color: C.gold   },
  { id:'bar',        label:'Bar / Minibar',  icon:'🥂', color: C.amber  },
  { id:'laundry',    label:'Laundry',        icon:'👔', color: C.blue   },
  { id:'spa',        label:'Spa & Wellness', icon:'🧖', color: '#4a6e2a'},
  { id:'transport',  label:'Transport',      icon:'🚗', color: '#5a3e8a'},
  { id:'misc',       label:'Miscellaneous',  icon:'📋', color: C.ink3   },
  { id:'tax',        label:'Tax',            icon:'🏛', color: C.red    },
  { id:'payment',    label:'Payment',        icon:'✓',  color: C.green  },
  { id:'refund',     label:'Refund',         icon:'↩',  color: C.blue   },
];

const catFor = id => CHARGE_CATS.find(c=>c.id===id) || CHARGE_CATS[6];

// ─── Sample data ──────────────────────────────────────

const fmt = (n) => n === 0 ? '—' : '₹' + Math.abs(n).toLocaleString('en-IN');
const fmtN = (n) => '₹' + Math.abs(n).toLocaleString('en-IN');

// ─── CSS ──────────────────────────────────────────────────────
const CSS = `
${FONT}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Lato',sans-serif;background:${C.bg};color:${C.ink};font-size:13.5px;line-height:1.5;overflow:hidden}

.shell{display:grid;grid-template-rows:52px 1fr;height:100vh;overflow:hidden}

/* Topbar */
.topbar{background:${C.teal};display:flex;align-items:center;padding:0 22px;gap:14px}
.tb-logo{width:28px;height:28px;border-radius:6px;background:${C.gold};display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:14px;color:#fff;flex-shrink:0}
.tb-hotel{font-family:'Playfair Display',serif;font-size:15px;color:#fff;font-weight:600}
.tb-sep{width:1px;height:18px;background:rgba(255,255,255,.2)}
.tb-crumb{font-size:11.5px;color:rgba(255,255,255,.45);display:flex;align-items:center;gap:5px}
.tb-crumb span{color:rgba(255,255,255,.75)}
.tb-crumb .cur{color:#e8c878;font-weight:700}
.tb-right{margin-left:auto;display:flex;align-items:center;gap:8px}
.tbtn{padding:5px 14px;border-radius:6px;font-family:'Lato',sans-serif;font-size:12px;font-weight:700;cursor:pointer;border:none;transition:all .15s}
.tbtn-ghost{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);color:rgba(255,255,255,.75)}
.tbtn-ghost:hover{background:rgba(255,255,255,.18);color:#fff}
.tbtn-gold{background:${C.gold};color:#fff}
.tbtn-gold:hover{background:#b07e18}

/* Main layout */
.body{display:grid;grid-template-columns:260px 1fr 310px;height:100%;overflow:hidden}

/* ── LEFT: Guest list ── */
.guest-col{background:${C.panel};border-right:1px solid ${C.border};overflow-y:auto;display:flex;flex-direction:column}
.gc-hd{padding:16px 18px;border-bottom:1px solid ${C.border};flex-shrink:0}
.gc-title{font-family:'Playfair Display',serif;font-size:16px;font-weight:600;color:${C.teal};margin-bottom:10px}
.gc-srch{display:flex;align-items:center;gap:8px;background:${C.bg};border:1.5px solid ${C.border};border-radius:8px;padding:7px 10px}
.gc-srch:focus-within{border-color:${C.tealBd};background:#fff}
.gc-srch input{border:none;background:none;outline:none;font-family:'Lato',sans-serif;font-size:12.5px;color:${C.ink};width:100%}
.gc-srch input::placeholder{color:${C.ink5}}
.gc-section{padding:10px 18px 4px;font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:2px;text-transform:uppercase;color:${C.ink5}}
.guest-card{padding:11px 18px;border-bottom:1px solid ${C.border};cursor:pointer;transition:background .12s;display:flex;align-items:center;gap:11px}
.guest-card:hover{background:${C.bg}}
.guest-card.active{background:${C.tealBg};border-left:3px solid ${C.teal}}
.gc-photo{width:38px;height:38px;border-radius:50%;object-fit:cover;border:2px solid ${C.border};flex-shrink:0}
.gc-info{flex:1;min-width:0}
.gc-name{font-size:13px;font-weight:700;color:${C.ink};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gc-room{font-size:11px;color:${C.ink3};font-family:'JetBrains Mono',monospace;margin-top:1px}
.gc-bal{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;flex-shrink:0}
.gc-bal.due{color:${C.red}}
.gc-bal.paid{color:${C.green}}
.gc-badge{font-size:9px;font-weight:700;padding:2px 7px;border-radius:10px;font-family:'JetBrains Mono',monospace;margin-top:3px;display:inline-block}
.badge-in{background:${C.greenBg};color:${C.green}}
.badge-out{background:${C.amberBg};color:${C.amber}}

/* ── CENTER: Folio ledger ── */
.folio-col{overflow-y:auto;background:${C.bg};display:flex;flex-direction:column}

/* Guest header */
.guest-hd{background:${C.panel};border-bottom:2px solid ${C.border};padding:18px 24px;flex-shrink:0}
.ghd-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px}
.ghd-left{display:flex;align-items:center;gap:14px}
.ghd-photo{width:52px;height:52px;border-radius:50%;object-fit:cover;border:2px solid ${C.border}}
.ghd-name{font-family:'Playfair Display',serif;font-size:22px;font-weight:600;color:${C.ink};line-height:1.15}
.ghd-meta{font-size:12px;color:${C.ink3};margin-top:3px;display:flex;align-items:center;gap:8px}
.ghd-right{text-align:right}
.ghd-res{font-family:'JetBrains Mono',monospace;font-size:10px;color:${C.ink4};margin-bottom:4px}
.status-pill{display:inline-flex;align-items:center;gap:5px;padding:4px 11px;border-radius:20px;font-size:10px;font-weight:700;font-family:'JetBrains Mono',monospace}
.sp-in{background:${C.greenBg};color:${C.green};border:1px solid ${C.greenBd}}
.sp-out{background:${C.amberBg};color:${C.amber};border:1px solid ${C.amberBd}}

.stay-chips{display:flex;gap:8px;flex-wrap:wrap}
.stay-chip{background:${C.white};border:1px solid ${C.border};border-radius:8px;padding:7px 12px;display:flex;flex-direction:column;gap:2px}
.sc-l{font-size:9.5px;font-weight:700;color:${C.ink4};text-transform:uppercase;letter-spacing:.5px}
.sc-v{font-size:13px;font-weight:700;color:${C.ink2}}

/* Folio tabs */
.folio-tabs{display:flex;align-items:center;gap:1px;padding:12px 24px 0;flex-shrink:0}
.f-tab{padding:8px 16px;border-radius:8px 8px 0 0;font-size:12.5px;font-weight:700;cursor:pointer;transition:all .15s;border:1px solid transparent;border-bottom:none;display:flex;align-items:center;gap:6px}
.f-tab:not(.on){background:transparent;color:${C.ink4}}
.f-tab:not(.on):hover{color:${C.ink3};background:rgba(0,0,0,.03)}
.f-tab.on{background:${C.white};color:${C.teal};border-color:${C.border}}
.f-tab-ct{font-family:'JetBrains Mono',monospace;font-size:9px;background:${C.tealBg};color:${C.teal2};padding:1px 5px;border-radius:10px}
.f-tab-add{margin-left:6px;padding:6px 12px;border-radius:6px;background:transparent;border:1.5px dashed ${C.border2};color:${C.ink4};font-size:12px;cursor:pointer;transition:all .15s}
.f-tab-add:hover{border-color:${C.tealBd};color:${C.teal}}

/* Folio ledger */
.ledger-wrap{background:${C.white};border:1px solid ${C.border};border-radius:0 10px 10px 10px;margin:0 24px 0;flex-shrink:0}
.ledger-hd{display:grid;grid-template-columns:72px 80px 1fr 90px 90px 80px 32px;padding:9px 16px;border-bottom:2px solid ${C.border2};background:${C.bg};border-radius:0 10px 0 0}
.lhd-cell{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:${C.ink4};font-weight:600}
.lhd-right{text-align:right}

.tx-row{display:grid;grid-template-columns:72px 80px 1fr 90px 90px 80px 32px;padding:9px 16px;border-bottom:1px solid ${C.border};transition:background .1s;align-items:center}
.tx-row:last-child{border-bottom:none}
.tx-row:hover{background:${C.bg}}
.tx-row.credit-row{background:rgba(30,92,56,.02)}
.tx-row.payment-row{background:rgba(30,92,56,.04)}

.tx-date{font-family:'JetBrains Mono',monospace;font-size:11px;color:${C.ink3}}
.tx-time{font-family:'JetBrains Mono',monospace;font-size:9.5px;color:${C.ink5};margin-top:1px}
.tx-cat{display:flex;align-items:center;gap:5px}
.tx-cat-dot{width:7px;height:7px;border-radius:2px;flex-shrink:0}
.tx-cat-lbl{font-size:10px;color:${C.ink4};white-space:nowrap}
.tx-desc{font-size:13px;color:${C.ink2}}
.tx-ref{font-size:10px;color:${C.ink4};font-family:'JetBrains Mono',monospace;margin-top:1px}
.tx-debit{text-align:right;font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:600;color:${C.ink}}
.tx-credit{text-align:right;font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:600;color:${C.green}}
.tx-bal{text-align:right;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600}
.tx-del{text-align:center;opacity:0;transition:opacity .15s;cursor:pointer;color:${C.red};font-size:14px}
.tx-row:hover .tx-del{opacity:.6}
.tx-row:hover .tx-del:hover{opacity:1}

/* Totals row */
.totals-row{background:${C.teal};padding:12px 16px;border-radius:0 0 10px 10px;display:grid;grid-template-columns:1fr auto auto auto;gap:24px;align-items:center}
.tr-label{color:rgba(255,255,255,.5);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
.tr-val{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;text-align:right}
.tr-total{font-family:'Playfair Display',serif;font-size:22px;font-weight:600;color:#fff}
.tr-total-lbl{color:rgba(255,255,255,.55);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}

/* Quick actions bar */
.actions-bar{padding:14px 24px;display:flex;gap:8px;flex-shrink:0;flex-wrap:wrap}
.act-btn{display:flex;align-items:center;gap:7px;padding:8px 15px;border-radius:8px;font-family:'Lato',sans-serif;font-size:12.5px;font-weight:700;cursor:pointer;transition:all .15s;border:1.5px solid ${C.border};background:${C.white};color:${C.ink2}}
.act-btn:hover{transform:translateY(-1px);box-shadow:0 2px 8px rgba(0,0,0,.08)}
.ab-charge{border-color:${C.tealBd};color:${C.teal}}
.ab-charge:hover{background:${C.tealBg}}
.ab-pay{border-color:${C.greenBd};color:${C.green}}
.ab-pay:hover{background:${C.greenBg}}
.ab-split{border-color:${C.blueBd};color:${C.blue}}
.ab-split:hover{background:${C.blueBg}}
.ab-transfer{border-color:${C.amberBd};color:${C.amber}}
.ab-transfer:hover{background:${C.amberBg}}
.ab-invoice{background:${C.teal};color:#fff;border-color:${C.teal}}
.ab-invoice:hover{background:${C.teal2}}
.ab-checkout{background:${C.red};color:#fff;border-color:${C.red}}
.ab-checkout:hover{background:#a03030}

/* ── RIGHT: Summary sidebar ── */
.summary-col{background:${C.panel};border-left:1px solid ${C.border};overflow-y:auto;display:flex;flex-direction:column}

.sum-hd{background:${C.teal};padding:16px 18px}
.sum-hd-t{font-family:'Playfair Display',serif;font-size:15px;font-weight:600;color:#fff}
.sum-hd-s{font-size:10px;color:rgba(255,255,255,.45);font-family:'JetBrains Mono',monospace;margin-top:2px}

.sum-sec{padding:13px 18px;border-bottom:1px solid ${C.border}}
.sum-sec-t{font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:2px;text-transform:uppercase;color:${C.ink5};margin-bottom:10px}
.sum-row{display:flex;justify-content:space-between;align-items:baseline;font-size:12.5px;margin-bottom:6px}
.sum-row:last-child{margin-bottom:0}
.sr-l{color:${C.ink3}}
.sr-v{font-weight:700;font-family:'JetBrains Mono',monospace;font-size:12px;color:${C.ink2}}
.sr-red{color:${C.red}}
.sr-green{color:${C.green}}
.sr-divider{border:none;border-top:1px dashed ${C.border};margin:8px 0}

.balance-card{margin:0 18px;background:linear-gradient(135deg,${C.teal} 0%,#1a6050 100%);border-radius:10px;padding:16px;margin-top:-1px}
.bc-label{color:rgba(255,255,255,.5);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px}
.bc-amount{font-family:'Playfair Display',serif;font-size:30px;font-weight:700;color:#fff;line-height:1}
.bc-sub{font-size:11px;color:rgba(255,255,255,.5);margin-top:5px}
.bc-settled{background:linear-gradient(135deg,${C.green} 0%,#1a7040 100%)}

/* Category breakdown */
.cat-bar{margin-bottom:7px}
.cat-bar-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;font-size:11.5px}
.cbl{color:${C.ink2};font-weight:600;display:flex;align-items:center;gap:6px}
.cbr{font-family:'JetBrains Mono',monospace;font-size:11px;color:${C.ink3};font-weight:600}
.progress{height:4px;background:${C.border};border-radius:4px;overflow:hidden}
.prog-fill{height:100%;border-radius:4px;transition:width .4s}

/* Payment log */
.pay-item{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid ${C.border}}
.pay-item:last-child{border-bottom:none}
.pi-left{display:flex;align-items:center;gap:8px}
.pi-icon{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px}
.pi-desc{font-size:12px;font-weight:600;color:${C.ink2}}
.pi-date{font-size:10px;color:${C.ink4};font-family:'JetBrains Mono',monospace;margin-top:1px}
.pi-amt{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:${C.green}}

/* Invoice modal */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:500;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal{background:#fff;border-radius:14px;width:480px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3)}
.invoice{padding:32px;font-family:'Lato',sans-serif}
.inv-hotel{text-align:center;margin-bottom:24px;padding-bottom:18px;border-bottom:2px solid ${C.border}}
.inv-hotel-name{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:${C.teal}}
.inv-hotel-addr{font-size:11px;color:${C.ink3};margin-top:3px}
.inv-hd{display:flex;justify-content:space-between;margin-bottom:20px}
.inv-hd-l .label{font-size:10px;font-weight:700;color:${C.ink4};text-transform:uppercase;letter-spacing:.5px}
.inv-hd-l .val{font-size:13.5px;font-weight:700;color:${C.ink};margin-top:2px}
.inv-id{font-family:'JetBrains Mono',monospace;font-size:12px;color:${C.teal};font-weight:600}
.inv-table{width:100%;border-collapse:collapse;margin-bottom:16px}
.inv-table th{padding:8px 10px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:${C.ink4};border-bottom:2px solid ${C.border}}
.inv-table th:last-child{text-align:right}
.inv-table td{padding:8px 10px;border-bottom:1px solid ${C.border};font-size:12.5px;color:${C.ink2}}
.inv-table td:last-child{text-align:right;font-family:'JetBrains Mono',monospace;font-weight:600}
.inv-table tr.credit td{color:${C.green}}
.inv-totals{background:${C.bg};border-radius:8px;padding:12px 14px}
.it-row{display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:5px}
.it-row:last-child{margin-bottom:0}
.it-total{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:${C.teal};border-top:2px solid ${C.border};padding-top:8px;margin-top:8px;display:flex;justify-content:space-between}
.inv-btns{display:flex;gap:8px;padding:16px 32px 24px}
.inv-btn{flex:1;padding:10px;border-radius:8px;font-family:'Lato',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .15s;border:none}
.inv-btn-out{background:${C.bg};border:1.5px solid ${C.border};color:${C.ink2}}
.inv-btn-out:hover{border-color:${C.tealBd};color:${C.teal}}
.inv-btn-primary{background:${C.teal};color:#fff}
.inv-btn-primary:hover{background:${C.teal2}}

/* Add charge / payment modal */
.add-modal{background:${C.panel};border-radius:14px;width:420px;box-shadow:0 20px 60px rgba(0,0,0,.3);padding:24px}
.am-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:600;color:${C.teal};margin-bottom:18px}
.am-fld{margin-bottom:13px}
.am-lbl{font-size:10.5px;font-weight:700;color:${C.ink3};text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
.am-in,.am-sel{width:100%;background:${C.white};border:1.5px solid ${C.border};border-radius:8px;padding:9px 12px;font-family:'Lato',sans-serif;font-size:13.5px;color:${C.ink};outline:none;transition:all .2s;appearance:none}
.am-in:focus,.am-sel:focus{border-color:${C.tealBd};box-shadow:0 0 0 3px rgba(12,74,66,.08)}
.am-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.am-cats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:2px}
.am-cat{padding:7px 4px;border-radius:7px;border:1.5px solid ${C.border};background:${C.white};cursor:pointer;text-align:center;transition:all .15s;font-size:10px;font-weight:700;color:${C.ink3}}
.am-cat:hover{border-color:${C.tealBd};color:${C.teal}}
.am-cat.on{border-color:${C.teal};background:${C.tealBg};color:${C.teal}}
.am-cat-icon{font-size:14px;display:block;margin-bottom:2px}
.am-btns{display:flex;gap:8px;margin-top:18px;justify-content:flex-end}
.am-cancel{padding:9px 18px;border-radius:8px;background:transparent;border:1.5px solid ${C.border};color:${C.ink3};font-family:'Lato',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .15s}
.am-cancel:hover{border-color:${C.ink3};color:${C.ink}}
.am-submit{padding:9px 20px;border-radius:8px;border:none;font-family:'Lato',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .15s;color:#fff}
.am-submit-charge{background:${C.teal}}
.am-submit-charge:hover{background:${C.teal2}}
.am-submit-pay{background:${C.green}}
.am-submit-pay:hover{background:#256040}

::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.border};border-radius:4px}
`;

// ─── Component ────────────────────────────────────────────────
export default function Folio() {
 const [guests, setGuests] = useState([]);
const [activeGuest, setActiveGuest] = useState(null);
const [txMap, setTxMap] = useState({});
const [activeFolioId, setActiveFolioId] = useState(null);
  const [modal, setModal] = useState(null); // 'charge'|'payment'|'invoice'|null
  const [searchQ, setSearchQ] = useState('');

  // Add charge form state
  const [chCat, setChCat] = useState('restaurant');
  const [chDesc, setChDesc] = useState('');
  const [chAmt, setChAmt] = useState('');

  // Add payment form state
  const [payMethod, setPayMethod] = useState('UPI');
  const [payAmt, setPayAmt] = useState('');
  const [payRef, setPayRef] = useState('');
const txs = txMap[activeGuest?.reservation_id] || [];
  const folioTxs = txs;
  const allFolios = [...new Set(txs.map(t => t.folio))].sort();

  // Running balance
  const txsWithBal = folioTxs.reduce((acc, tx) => {
    const prev = acc.length > 0 ? acc[acc.length-1].running : 0;
    return [...acc, { ...tx, running: prev + tx.debit - tx.credit }];
  }, []);

  const totalDebits  = folioTxs.reduce((s,t) => s + t.debit, 0);
  const totalCredits = folioTxs.reduce((s,t) => s + t.credit, 0);
  const balance = totalDebits - totalCredits;

  // Category totals
  const catTotals = folioTxs.reduce((m,t) => {
    if (t.cat === 'payment' || t.cat === 'refund') return m;
    return { ...m, [t.cat]: (m[t.cat] || 0) + t.debit };
  }, {});
  const maxCat = Math.max(...Object.values(catTotals), 1);

  // Payments only
  const payments = folioTxs.filter(t => t.cat === 'payment' || t.cat === 'refund');

  const today = () => {
    const d = new Date(); return `${d.getDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]}`;
  };
  useEffect(() => {
  fetchGuests();
}, []);

const fetchGuests = async () => {
  const res = await fetch("http://localhost:5000/guests");
  const data = await res.json();

  setGuests(data);

  if (data.length > 0) {
    setActiveGuest(data[0]);
  }
};
useEffect(() => {
  if (activeGuest?.reservation_id) {
    fetchFolio(activeGuest.reservation_id);
  }
}, [activeGuest]);
const fetchFolio = async (reservationId) => {
  const res = await fetch(`http://localhost:5000/api/folios/${reservationId}`);
  const data = await res.json();

  setActiveFolioId(data.folioId);

  const txs = [
    ...data.charges.map(c => ({
      id: c.id,
      date: new Date(c.created_at).toLocaleDateString(),
      desc: c.description || "Charge",
      debit: Number(c.amount),
      credit: 0,
      cat: "charge"
    })),
    ...data.payments.map(p => ({
      id: p.payment_id,
      date: new Date().toLocaleDateString(),
      desc: `Payment (${p.payment_method})`,
      debit: 0,
      credit: Number(p.amount),
      cat: "payment"
    }))
  ];

  setTxMap(prev => ({
    ...prev,
    [reservationId]: txs
  }));
};
const fetchTransactions = async (guestId) => {
  const res = await fetch(`http://localhost:5000/api/folios/${guestId}`);
  const data = await res.json();

  // convert charges + payments → tx format
  const txs = [
    ...data.charges.map(c => ({
      id: c.id,
      date: new Date(c.created_at).toLocaleDateString(),
      desc: "Charge",
      debit: Number(c.amount),
      credit: 0,
      folio: "A",
      cat: "charge"
    })),

    ...data.payments.map(p => ({
      id: p.payment_id,
      date: new Date().toLocaleDateString(),
      desc: `Payment (${p.payment_method})`,
      debit: 0,
      credit: Number(p.amount),
      folio: "A",
      cat: "payment"
    }))
  ];

  setTxMap(prev => ({
    ...prev,
    [guestId]: txs
  }));
};
const addCharge = async () => {
  if (!chAmt || !activeFolioId) return;

  await fetch(`http://localhost:5000/api/folios/${activeFolioId}/charges`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: chDesc,
      amount: Number(chAmt)
    })
  });

  fetchFolio(activeGuest.reservation_id);
  setModal(null);
};

  

  const addPayment = async () => {
  if (!payAmt || !activeFolioId) return;

  await fetch(`http://localhost:5000/api/folios/${activeFolioId}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: Number(payAmt),
      method: payMethod
    })
  });

  fetchFolio(activeGuest.reservation_id);
  setModal(null);

  
};

  const deleteTx = (id) => {
    setTxMap(m => ({ ...m, [activeGuest?.id]: m[activeGuest.id].filter(t => t.id !== id) }));
  };

  const payMethodIcon = (m) => ({ 'Cash':'💵','Card':'💳','UPI':'📱','Corporate':'🏢','NEFT':'🏦' })[m] || '💳';

  return (
    <>
      <style>{CSS}</style>
      <div className="shell">

        {/* ── TOP BAR ── */}
        <header className="topbar">
          <div className="tb-logo">A</div>
          <div className="tb-hotel">The Grand Aurum</div>
          <div className="tb-sep"/>
          <div className="tb-crumb">
            <span>Dashboard</span>
            <span style={{color:'rgba(255,255,255,.2)'}}>›</span>
            <span>Billing</span>
            <span style={{color:'rgba(255,255,255,.2)'}}>›</span>
            <span className="cur">Folio & Billing</span>
          </div>
          <div className="tb-right">
            <button className="tbtn tbtn-ghost">All Folios</button>
            <button className="tbtn tbtn-ghost">Batch Invoice</button>
            <button className="tbtn tbtn-gold" onClick={() => setModal('invoice')}>Generate Invoice</button>
          </div>
        </header>

        <div className="body">

          {/* ══ LEFT: GUEST LIST ══ */}
          <aside className="guest-col">
            <div className="gc-hd">
              <div className="gc-title">In-House Guests</div>
              <div className="gc-srch">
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color:C.ink5,flexShrink:0}}>
                  <circle cx="11" cy="11" r="8" strokeWidth="2"/><path d="M21 21l-4.35-4.35" strokeWidth="2"/>
                </svg>
                <input placeholder="Search guest or room…" value={searchQ} onChange={e=>setSearchQ(e.target.value)}/>
              </div>
            </div>

            <div className="gc-section">Checked In</div>
            {guests.filter(g => g.status==='checkedin' && (g.name.toLowerCase().includes(searchQ.toLowerCase()) || g.room.includes(searchQ))).map(g => {
              const gTxs = txMap[g.id] || [];
              const bal = gTxs.reduce((s,t) => s + t.debit - t.credit, 0);
              return (
                <div key={g.id} className={`guest-card${activeGuest.id===g.id?' active':''}`} onClick={()=>{setActiveGuest(g);setActiveFolioId('A')}}>
                  <img className="gc-photo" src={g.photo} alt=""/>
                  <div className="gc-info">
                    <div className="gc-name">{g.name}</div>
                    <div className="gc-room">Room {g.room} · {g.type}</div>
                    <span className="gc-badge badge-in">● Checked In</span>
                  </div>
                  <div>
                    <div className={`gc-bal ${bal>0?'due':'paid'}`}>{bal>0?fmt(bal):'Settled'}</div>
                  </div>
                </div>
              );
            })}

            <div className="gc-section" style={{marginTop:8}}>Checking Out Today</div>
            {guests.filter(g => g.status==='checkout').map(g => {
              const gTxs = txMap[g.id] || [];
              const bal = gTxs.reduce((s,t) => s + t.debit - t.credit, 0);
              return (
                <div key={g.id} className={`guest-card${activeGuest.id===g.id?' active':''}`} onClick={()=>{setActiveGuest(g);setActiveFolioId('A')}}>
                  <img className="gc-photo" src={g.photo} alt=""/>
                  <div className="gc-info">
                    <div className="gc-name">{g.name}</div>
                    <div className="gc-room">Room {g.room} · {g.type}</div>
                    <span className="gc-badge badge-out">⇒ Checkout</span>
                  </div>
                  <div className={`gc-bal ${bal>0?'due':'paid'}`}>{bal>0?fmt(bal):'Settled'}</div>
                </div>
              );
            })}
          </aside>

          {/* ══ CENTER: FOLIO LEDGER ══ */}
          <main className="folio-col">

            {/* Guest header */}
            <div className="guest-hd">
              <div className="ghd-top">
                <div className="ghd-left">
                  <img className="ghd-photo" src={activeGuest.photo} alt=""/>
                  <div>
                    <div className="ghd-name">{activeGuest.name}</div>
                    <div className="ghd-meta">
                      <span>Room {activeGuest.room}</span>
                      <span style={{color:C.border2}}>·</span>
                      <span>{activeGuest.type}</span>
                      <span style={{color:C.border2}}>·</span>
                      <span>{activeGuest.adults} adults</span>
                    </div>
                  </div>
                </div>
                <div className="ghd-right">
                  <div className="ghd-res">{activeGuest.resId} · {activeGuest.source}</div>
                  <span className={`status-pill ${activeGuest.status==='checkedin'?'sp-in':'sp-out'}`}>
                    {activeGuest.status==='checkedin' ? '● Checked In' : '⇒ Checking Out'}
                  </span>
                </div>
              </div>
              <div className="stay-chips">
                {[
                  ['Check-in', activeGuest.checkin],
                  ['Check-out', activeGuest.checkout],
                  ['Nights', activeGuest.nights],
                  ['Room Rate', `₹${activeGuest.rate.toLocaleString('en-IN')}/n`],
                  ['Room Total', `₹${(activeGuest.rate * activeGuest.nights).toLocaleString('en-IN')}`],
                ].map(([l,v]) => (
                  <div key={l} className="stay-chip">
                    <div className="sc-l">{l}</div>
                    <div className="sc-v">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="actions-bar">
              <button className="act-btn ab-charge" onClick={()=>setModal('charge')}>
                <span>＋</span> Add Charge
              </button>
              <button className="act-btn ab-pay" onClick={()=>setModal('payment')}>
                <span>✓</span> Record Payment
              </button>
              <button className="act-btn ab-split">
                <span>⊟</span> Split Folio
              </button>
              <button className="act-btn ab-transfer">
                <span>⇄</span> Transfer Charges
              </button>
              <div style={{flex:1}}/>
              <button className="act-btn" onClick={()=>setModal('invoice')}>
                🖨 Print Invoice
              </button>
              {activeGuest.status === 'checkout' && (
                <button className="act-btn ab-checkout">
                  ⇒ Settle & Checkout
                </button>
              )}
            </div>

            {/* Folio tabs */}
            <div className="folio-tabs">
              {allFolios.map(f => {
                const fTxs = txs.filter(t=>t.folio===f);
                return (
                  <div key={f} className={`f-tab${activeFolioId===f?' on':''}`} onClick={()=>setActiveFolioId(f)}>
                    Folio {f}
                    <span className="f-tab-ct">{fTxs.length}</span>
                  </div>
                );
              })}
              <button className="f-tab-add" 
              onClick={() => {
  alert("Create new folio via backend API");
}}> ADD</button>
            </div>

            {/* Ledger table */}
            <div className="ledger-wrap">
              {/* Header */}
              <div className="ledger-hd">
                <div className="lhd-cell">Date</div>
                <div className="lhd-cell">Category</div>
                <div className="lhd-cell">Description</div>
                <div className="lhd-cell lhd-right">Debit</div>
                <div className="lhd-cell lhd-right">Credit</div>
                <div className="lhd-cell lhd-right">Balance</div>
                <div className="lhd-cell"/>
              </div>

              {/* Transactions */}
              {txsWithBal.map(t => {
                const cat = catFor(t.cat);
                const isPayment = t.cat === 'payment' || t.cat === 'refund';
                return (
                  <div key={t.id} className={`tx-row${t.credit>0?' credit-row':''}${isPayment?' payment-row':''}`}>
                    <div>
                      <div className="tx-date">{t.date}</div>
                      <div className="tx-time">{t.time}</div>
                    </div>
                    <div className="tx-cat">
                      <div className="tx-cat-dot" style={{background: cat.color}}/>
                      <div className="tx-cat-lbl">{cat.icon}</div>
                    </div>
                    <div>
                      <div className="tx-desc" style={{color: isPayment ? C.green : C.ink2}}>{t.desc}</div>
                      <div className="tx-ref">{t.posted}</div>
                    </div>
                    <div className="tx-debit" style={{color: t.debit>0 ? C.ink : C.ink5}}>{fmt(t.debit)}</div>
                    <div className="tx-credit" style={{color: t.credit>0 ? C.green : C.ink5}}>{fmt(t.credit)}</div>
                    <div className="tx-bal" style={{color: t.running > 0 ? C.red : C.green}}>{fmt(t.running)}</div>
                    <div className="tx-del" onClick={()=>deleteTx(t.id)}>✕</div>
                  </div>
                );
              })}

              {/* Totals */}
              <div className="totals-row">
                <div/>
                <div>
                  <div className="tr-label" style={{color:'rgba(255,255,255,.5)'}}>Total Charges</div>
                  <div className="tr-val" style={{color:'rgba(255,255,255,.8)'}}>{fmtN(totalDebits)}</div>
                </div>
                <div>
                  <div className="tr-label" style={{color:'rgba(255,255,255,.5)'}}>Payments</div>
                  <div className="tr-val" style={{color:'#7dd8a8'}}>{fmtN(totalCredits)}</div>
                </div>
                <div>
                  <div className="tr-total-lbl">Balance Due</div>
                  <div className="tr-total">{fmtN(balance)}</div>
                </div>
              </div>
            </div>

            <div style={{height:24}}/>
          </main>

          {/* ══ RIGHT: SUMMARY SIDEBAR ══ */}
          <aside className="summary-col">
            <div className="sum-hd">
              <div className="sum-hd-t">Account Summary</div>
              <div className="sum-hd-s">Folio {activeFolioId} · {activeGuest.name}</div>
            </div>

            {/* Balance card */}
            <div style={{padding:'14px 0 0'}}>
              <div className={`balance-card${balance<=0?' bc-settled':''}`}>
                <div className="bc-label">{balance > 0 ? 'Balance Due' : 'Account Settled'}</div>
                <div className="bc-amount">{fmtN(balance)}</div>
                <div className="bc-sub">{balance > 0 ? `Due at checkout · ${activeGuest.checkout}` : 'All charges paid ✓'}</div>
              </div>
            </div>

            {/* Financial summary */}
            <div className="sum-sec" style={{marginTop:14}}>
              <div className="sum-sec-t">Charge Summary</div>
              <div className="sum-row">
                <span className="sr-l">Room ({activeGuest.nights} nights)</span>
                <span className="sr-v">{fmtN(activeGuest.rate * activeGuest.nights)}</span>
              </div>
              {Object.entries(catTotals).filter(([k])=>k!=='room'&&k!=='tax').map(([k,v])=>(
                <div key={k} className="sum-row">
                  <span className="sr-l">{catFor(k).label}</span>
                  <span className="sr-v">{fmtN(v)}</span>
                </div>
              ))}
              <hr className="sr-divider"/>
              <div className="sum-row">
                <span className="sr-l">Sub-total</span>
                <span className="sr-v">{fmtN(totalDebits - (catTotals.tax||0))}</span>
              </div>
              <div className="sum-row">
                <span className="sr-l">GST / Taxes</span>
                <span className="sr-v sr-red">{fmtN(catTotals.tax||0)}</span>
              </div>
              <div className="sum-row">
                <span style={{fontWeight:700,color:C.ink2}}>Total</span>
                <span className="sr-v" style={{fontFamily:'Playfair Display,serif',fontSize:15,color:C.teal}}>{fmtN(totalDebits)}</span>
              </div>
              <hr className="sr-divider"/>
              <div className="sum-row">
                <span className="sr-l">Payments Received</span>
                <span className="sr-v sr-green">−{fmtN(totalCredits)}</span>
              </div>
              <div className="sum-row">
                <span style={{fontWeight:700,color:C.ink2}}>Balance Due</span>
                <span className="sr-v" style={{color: balance>0? C.red : C.green, fontFamily:'Playfair Display,serif',fontSize:16}}>
                  {fmtN(balance)}
                </span>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="sum-sec">
              <div className="sum-sec-t">Spend Breakdown</div>
              {Object.entries(catTotals).map(([k,v]) => {
                const cat = catFor(k);
                return (
                  <div key={k} className="cat-bar">
                    <div className="cat-bar-hd">
                      <span className="cbl">
                        <span style={{fontSize:11}}>{cat.icon}</span>
                        {cat.label}
                      </span>
                      <span className="cbr">{fmtN(v)}</span>
                    </div>
                    <div className="progress">
                      <div className="prog-fill" style={{width:`${(v/maxCat)*100}%`,background:cat.color}}/>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment log */}
            {payments.length > 0 && (
              <div className="sum-sec">
                <div className="sum-sec-t">Payments Received</div>
                {payments.map(p => {
                  const method = p.desc.includes('UPI')?'UPI':p.desc.includes('Card')?'Card':p.desc.includes('Cash')?'Cash':'Bank';
                  return (
                    <div key={p.id} className="pay-item">
                      <div className="pi-left">
                        <div className="pi-icon" style={{background:C.greenBg}}>{payMethodIcon(method)}</div>
                        <div>
                          <div className="pi-desc">{p.desc}</div>
                          <div className="pi-date">{p.date} · {p.time}</div>
                        </div>
                      </div>
                      <div className="pi-amt">{fmtN(p.credit)}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </aside>
        </div>

        {/* ══ MODAL: ADD CHARGE ══ */}
        {modal === 'charge' && (
          <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
            <div className="add-modal">
              <div className="am-title">Add Charge</div>
              <div className="am-fld">
                <div className="am-lbl">Category</div>
                <div className="am-cats">
                  {CHARGE_CATS.filter(c=>c.id!=='payment'&&c.id!=='tax'&&c.id!=='refund').map(c=>(
                    <div key={c.id} className={`am-cat${chCat===c.id?' on':''}`} onClick={()=>setChCat(c.id)}>
                      <span className="am-cat-icon">{c.icon}</span>{c.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="am-fld">
                <div className="am-lbl">Description</div>
                <input className="am-in" placeholder="e.g. Breakfast × 2" value={chDesc} onChange={e=>setChDesc(e.target.value)} autoFocus/>
              </div>
              <div className="am-row">
                <div className="am-fld">
                  <div className="am-lbl">Amount (₹)</div>
                  <input className="am-in" type="number" placeholder="0" value={chAmt} onChange={e=>setChAmt(e.target.value)}/>
                </div>
                <div className="am-fld">
                  <div className="am-lbl">Folio</div>
                  <select className="am-sel" value={activeFolioId} onChange={e=>setActiveFolioId(e.target.value)}>
                    {allFolios.map(f=><option key={f} value={f}>Folio {f}</option>)}
                  </select>
                </div>
              </div>
              {chAmt && <div style={{background:C.tealBg,border:`1px solid ${C.tealBd}`,borderRadius:8,padding:'8px 12px',fontSize:12.5,color:C.teal2,marginBottom:4}}>
                GST 12% will be auto-added: <strong>₹{Math.round(Number(chAmt)*0.12).toLocaleString('en-IN')}</strong>
              </div>}
              <div className="am-btns">
                <button className="am-cancel" onClick={()=>setModal(null)}>Cancel</button>
                <button className="am-submit am-submit-charge" onClick={addCharge}>Post Charge</button>
              </div>
            </div>
          </div>
        )}

        {/* ══ MODAL: ADD PAYMENT ══ */}
        {modal === 'payment' && (
          <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
            <div className="add-modal">
              <div className="am-title">Record Payment</div>
              <div className="am-fld">
                <div className="am-lbl">Payment Method</div>
                <div className="am-cats" style={{gridTemplateColumns:'repeat(5,1fr)'}}>
                  {[['Cash','💵'],['Card','💳'],['UPI','📱'],['Corporate','🏢'],['NEFT','🏦']].map(([m,icon])=>(
                    <div key={m} className={`am-cat${payMethod===m?' on':''}`} onClick={()=>setPayMethod(m)}>
                      <span className="am-cat-icon">{icon}</span>{m}
                    </div>
                  ))}
                </div>
              </div>
              <div className="am-row">
                <div className="am-fld">
                  <div className="am-lbl">Amount (₹)</div>
                  <input className="am-in" type="number" placeholder="0" value={payAmt} onChange={e=>setPayAmt(e.target.value)} autoFocus/>
                </div>
                <div className="am-fld">
                  <div className="am-lbl">Reference / TXN ID</div>
                  <input className="am-in" placeholder="Optional" value={payRef} onChange={e=>setPayRef(e.target.value)}/>
                </div>
              </div>
              {balance > 0 && (
                <div style={{background:C.amberBg,border:`1px solid ${C.amberBd}`,borderRadius:8,padding:'8px 12px',fontSize:12,color:C.amber,marginBottom:4,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span>Balance due:</span>
                  <strong style={{fontFamily:'JetBrains Mono,monospace',fontSize:14}}>{fmtN(balance)}</strong>
                  <button style={{fontSize:11,padding:'3px 9px',borderRadius:5,border:`1px solid ${C.amberBd}`,background:'transparent',color:C.amber,cursor:'pointer'}}
                    onClick={()=>setPayAmt(String(balance))}>Pay Full</button>
                </div>
              )}
              <div className="am-btns">
                <button className="am-cancel" onClick={()=>setModal(null)}>Cancel</button>
                <button className="am-submit am-submit-pay" onClick={addPayment}>Record Payment</button>
              </div>
            </div>
          </div>
        )}

        {/* ══ MODAL: INVOICE ══ */}
        {modal === 'invoice' && (
          <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
            <div className="modal">
              <div className="invoice">
                <div className="inv-hotel">
                  <div className="inv-hotel-name">The Grand Aurum</div>
                  <div className="inv-hotel-addr">Marine Drive, Mumbai 400001 · GSTIN: 27AAAPL1234C1Z5</div>
                </div>
                <div className="inv-hd">
                  <div className="inv-hd-l">
                    <div className="label">Invoice To</div>
                    <div className="val">{activeGuest.name}</div>
                    <div style={{fontSize:12,color:C.ink3,marginTop:2}}>Room {activeGuest.room} — {activeGuest.type}</div>
                    <div style={{fontSize:12,color:C.ink3}}>{activeGuest.checkin} → {activeGuest.checkout} · {activeGuest.nights} nights</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="label" style={{fontSize:10,fontWeight:700,color:C.ink4,textTransform:'uppercase',letterSpacing:'.5px'}}>Invoice</div>
                    <div className="inv-id">INV-{activeGuest.room}-{Math.floor(Math.random()*9000)+1000}</div>
                    <div style={{fontSize:11,color:C.ink4,fontFamily:'JetBrains Mono,monospace',marginTop:4}}>Date: {today()} 2026</div>
                    <div style={{fontSize:11,color:C.ink4,fontFamily:'JetBrains Mono,monospace'}}>{activeGuest.resId}</div>
                  </div>
                </div>

                <table className="inv-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {folioTxs.map(t => (
                      <tr key={t.id} className={t.credit>0?'credit':''}>
                        <td style={{fontFamily:'JetBrains Mono,monospace',fontSize:11.5}}>{t.date}</td>
                        <td>{t.desc}</td>
                        <td>{t.credit > 0 ? `(${fmtN(t.credit)})` : fmtN(t.debit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="inv-totals">
                  <div className="it-row"><span>Total Charges</span><span style={{fontFamily:'JetBrains Mono,monospace',fontWeight:700}}>{fmtN(totalDebits)}</span></div>
                  <div className="it-row"><span>Payments Received</span><span style={{fontFamily:'JetBrains Mono,monospace',fontWeight:700,color:C.green}}>({fmtN(totalCredits)})</span></div>
                  <div className="it-total">
                    <span>Balance Due</span>
                    <span style={{color: balance > 0 ? C.red : C.green}}>{fmtN(balance)}</span>
                  </div>
                </div>
              </div>

              <div className="inv-btns">
                <button className="inv-btn inv-btn-out" onClick={()=>setModal(null)}>Close</button>
                <button className="inv-btn inv-btn-out">💬 WhatsApp</button>
                <button className="inv-btn inv-btn-out">📧 Email</button>
                <button className="inv-btn inv-btn-primary">🖨 Print</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
