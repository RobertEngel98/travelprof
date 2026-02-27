"use client";
import { useState, useEffect, FormEvent, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import "./analyse.css";

const AFF = {
  amexGold: "#DEIN-AMEX-GOLD-REFERRAL-LINK",
  amexPlat: "#DEIN-AMEX-PLATINUM-REFERRAL-LINK",
  amexGreen: "#DEIN-AMEX-GREEN-REFERRAL-LINK",
  amexBiz: "#DEIN-AMEX-BIZ-GOLD-REFERRAL-LINK",
  paybackAmex: "#DEIN-PAYBACK-AMEX-REFERRAL-LINK",
  mmGold: "#DEIN-MILES-AND-MORE-GOLD-LINK",
  eurowings: "#DEIN-EUROWINGS-PREMIUM-LINK",
  hilton: "#DEIN-HILTON-HONORS-LINK",
  marriott: "#DEIN-MARRIOTT-BONVOY-LINK",
  payback: "https://www.payback.de",
  booking: "#DEIN-BOOKING-AFFILIATE-LINK",
  sixtRide: "#DEIN-SIXT-RIDE-LINK",
  shell: "#DEIN-SHELL-CLUBSMART-LINK",
  aral: "#DEIN-ARAL-PAYBACK-LINK",
  check24Strom: "#DEIN-CHECK24-STROM-LINK",
  check24Gas: "#DEIN-CHECK24-GAS-LINK",
  wunschgutschein: "#DEIN-WUNSCHGUTSCHEIN-LINK",
  cadooz: "#DEIN-CADOOZ-LINK",
  instagram: "https://www.instagram.com/traveling.prof",
  crashkurs: "https://travelprof.vercel.app/#produkte",
  community: "https://travelprof.vercel.app/#community",
};

interface Q { id:string; title:string; subtitle:string; emoji:string; options:{label:string;value:string;emoji:string;desc?:string}[] }
const questions:Q[] = [
  {id:"status",title:"Wie ist dein aktueller Status?",subtitle:"Wo stehst du beim Thema Meilen & Punkte?",emoji:"🧭",options:[
    {label:"Kompletter Neuling",value:"beginner",emoji:"🌱",desc:"Habe noch nie Meilen gesammelt"},
    {label:"Etwas Erfahrung",value:"intermediate",emoji:"📊",desc:"Habe Payback/M&M, nutze es aber kaum"},
    {label:"Fortgeschritten",value:"advanced",emoji:"🚀",desc:"Sammle aktiv, will optimieren"},
  ]},
  {id:"lebensphase",title:"In welcher Lebensphase bist du?",subtitle:"Das beeinflusst deine optimale Karten-Strategie.",emoji:"👤",options:[
    {label:"Student / Azubi",value:"student",emoji:"🎓",desc:"Budget-bewusst, erste Karte"},
    {label:"Angestellt",value:"employed",emoji:"💼",desc:"Regelmäßiges Einkommen"},
    {label:"Selbständig / Unternehmer",value:"selfemployed",emoji:"🏢",desc:"Geschäftsausgaben nutzen"},
    {label:"Familie mit Kindern",value:"family",emoji:"👨‍👩‍👧‍👦",desc:"Familienreisen optimieren"},
  ]},
  {id:"reisefrequenz",title:"Wie oft reist du pro Jahr?",subtitle:"Flugreisen, Städtetrips, Urlaube – alles zählt.",emoji:"✈️",options:[
    {label:"1–2 mal",value:"selten",emoji:"🏖️"},
    {label:"3–5 mal",value:"mittel",emoji:"🗺️"},
    {label:"6+ mal",value:"viel",emoji:"🌍"},
    {label:"Geschäftlich oft",value:"business",emoji:"💼"},
  ]},
  {id:"reiseziel",title:"Wohin reist du am liebsten?",subtitle:"Das bestimmt die besten Meilenprogramme für dich.",emoji:"🌍",options:[
    {label:"Europa (Kurzstrecke)",value:"europa",emoji:"🇪🇺",desc:"Städtetrips, Mittelmeer"},
    {label:"Fernreise (Asien, USA)",value:"fern",emoji:"🌏",desc:"Thailand, Japan, New York"},
    {label:"Beides – Mix",value:"mix",emoji:"🔄",desc:"Abwechslungsreich unterwegs"},
    {label:"Luxus-Destinationen",value:"luxus",emoji:"💎",desc:"Dubai, Malediven, Singapur"},
  ]},
  {id:"budget",title:"Wie hoch sind deine monatlichen Gesamtausgaben?",subtitle:"Lebensmittel, Shopping, Tanken, Fixkosten – alles zusammen.",emoji:"💰",options:[
    {label:"Unter 1.500 €",value:"low",emoji:"🪙"},
    {label:"1.500 – 3.000 €",value:"mid",emoji:"💵"},
    {label:"3.000 – 5.000 €",value:"high",emoji:"💳"},
    {label:"Über 5.000 €",value:"premium",emoji:"🏦"},
  ]},
  {id:"karten",title:"Welche Kreditkarten hast du bereits?",subtitle:"Damit wir Dopplungen vermeiden.",emoji:"💳",options:[
    {label:"Keine / nur Girokarte",value:"keine",emoji:"❌"},
    {label:"Payback Amex",value:"payback",emoji:"🔵"},
    {label:"Amex Gold oder Green",value:"amex_mid",emoji:"🟡"},
    {label:"Amex Platinum",value:"amex_plat",emoji:"⚪"},
  ]},
  {id:"ziel",title:"Was ist dein Hauptziel?",subtitle:"Was willst du mit Meilen & Punkten erreichen?",emoji:"🎯",options:[
    {label:"Business Class fliegen",value:"business_class",emoji:"🥂",desc:"Luxuriös ohne Luxuspreise"},
    {label:"Mehr & günstiger reisen",value:"mehr_reisen",emoji:"🌴",desc:"Öfter unterwegs, weniger zahlen"},
    {label:"Lounge-Zugang & Komfort",value:"lounge",emoji:"🛋️",desc:"Am Flughafen wie ein VIP"},
    {label:"Alles zusammen!",value:"alles",emoji:"🏆",desc:"Das volle Programm"},
  ]},
];

type Answers = Record<string,string>;
interface LeadData { vorname:string; nachname:string; email:string; telefon:string }
interface CardRec { name:string; link:string; bonus:string; reason:string; priority:number; tag:string }
interface SetupResult { level:string; levelEmoji:string; monthlyMiles:string; yearlyMiles:string; firstGoal:string; cards:CardRec[]; sammeltipps:{tip:string;link:string;linkLabel:string}[]; buchungstipps:string[]; nextSteps:{step:string;link:string;label:string}[] }

function generateResult(a:Answers):SetupResult {
  const isBeginner=a.status==="beginner",isAdvanced=a.status==="advanced",isStudent=a.lebensphase==="student",isSelfEmp=a.lebensphase==="selfemployed",isFamily=a.lebensphase==="family";
  const highBudget=a.budget==="high"||a.budget==="premium",premiumBudget=a.budget==="premium";
  const wantsBiz=a.ziel==="business_class"||a.ziel==="alles",wantsLounge=a.ziel==="lounge"||a.ziel==="alles";
  const fernreise=a.reiseziel==="fern"||a.reiseziel==="luxus"||a.reiseziel==="mix";
  const hasNoCard=a.karten==="keine",hasPayback=a.karten==="payback",hasAmexMid=a.karten==="amex_mid",hasAmexPlat=a.karten==="amex_plat";
  const businessTravel=a.reisefrequenz==="business";

  let level="Smart Starter",levelEmoji="🌱";
  if(isAdvanced||(highBudget&&!isBeginner)){level="Miles Architect";levelEmoji="🏗️";}
  else if(!isBeginner||highBudget){level="Strategic Collector";levelEmoji="📊";}

  const cards:CardRec[]=[];
  if(!hasPayback&&!hasAmexMid&&!hasAmexPlat) cards.push({name:"Payback American Express",link:AFF.paybackAmex,bonus:"1.000 Punkte Willkommensbonus",reason:"Kostenlos, sofort Punkte bei jedem Einkauf (dm, REWE, Aral, etc.)",priority:1,tag:"PFLICHT – KOSTENLOS"});
  if(highBudget&&!hasAmexPlat) cards.push({name:"Amex Platinum Card",link:AFF.amexPlat,bonus:"Bis zu 75.000 MR Punkte Bonus",reason:`${wantsLounge?"Unbegrenzter Lounge-Zugang weltweit. ":""}640€+ Guthaben/Jahr. Versicherungspaket.${isSelfEmp?" Ideal für Geschäftsausgaben.":""}${premiumBudget?"":" Lohnt sich ab ca. 3.000€ monatlichen Ausgaben."}`,priority:2,tag:"TOP-EMPFEHLUNG"});
  else if(!hasAmexPlat&&!hasAmexMid&&!isStudent) cards.push({name:"Amex Gold Card",link:AFF.amexGold,bonus:"Bis zu 40.000 MR Punkte Bonus",reason:`Starke Punkte-Ausbeute (1,5 MR/€ mit Turbo). ${fernreise?"Perfekt für Fernreisen.":"Solide Basis."}`,priority:2,tag:"EMPFEHLUNG"});
  else if(!hasAmexMid&&!hasAmexPlat&&!isStudent) cards.push({name:"Amex Gold Card",link:AFF.amexGold,bonus:"Bis zu 40.000 MR Punkte Bonus",reason:"Bestes Preis-Leistungs-Verhältnis. 1,5 MR/€ mit Turbo.",priority:2,tag:"EMPFEHLUNG"});
  if(isStudent&&hasNoCard) cards.push({name:"Amex Green Card",link:AFF.amexGreen,bonus:"Bis zu 15.000 MR Punkte Bonus",reason:"Günstiger Einstieg. Versicherungsschutz inklusive.",priority:2,tag:"FÜR STUDENTEN"});
  if(isSelfEmp) cards.push({name:"Amex Business Gold",link:AFF.amexBiz,bonus:"Bis zu 75.000 MR Punkte Bonus",reason:"Geschäftsausgaben → Meilen. Separate Abrechnung.",priority:3,tag:"BUSINESS-TIPP"});
  if(fernreise||businessTravel) cards.push({name:"Miles & More Gold Kreditkarte",link:AFF.mmGold,bonus:"Bis zu 5.000 Meilen Bonus",reason:"Direkt Meilen bei Lufthansa/Swiss/Austrian.",priority:4,tag:fernreise?"FÜR FERNREISEN":"FÜR VIELFLIEGER"});
  if(a.reiseziel==="europa"&&!highBudget) cards.push({name:"Eurowings Premium Kreditkarte",link:AFF.eurowings,bonus:"Bis zu 10.000 Meilen Bonus",reason:"Günstig Europa fliegen. Meilen bei jedem Einkauf.",priority:5,tag:"EUROPA-TIPP"});
  if(hasAmexMid&&!hasAmexPlat&&(highBudget||wantsLounge)) cards.push({name:"Upgrade auf Amex Platinum",link:AFF.amexPlat,bonus:"Bis zu 75.000 MR Punkte Bonus",reason:"Mit Platinum: Lounge-Zugang, 640€+ Guthaben, voller Versicherungsschutz.",priority:2,tag:"UPGRADE-TIPP"});
  cards.sort((x,y)=>x.priority-y.priority);

  let base=0;
  if(a.budget==="low")base=2000; if(a.budget==="mid")base=5000; if(a.budget==="high")base=10000; if(a.budget==="premium")base=18000;
  if(!isBeginner)base=Math.round(base*1.4); if(isAdvanced)base=Math.round(base*1.3); if(isSelfEmp)base=Math.round(base*1.5);

  const sammeltipps=[
    {tip:"Aktiviere VOR jedem Einkauf die Payback-Coupons in der App (10-fach bis 33-fach Punkte!)",link:AFF.payback,linkLabel:"Payback App herunterladen"},
    {tip:"Wunschgutschein-Trick: Kaufe Wunschgutscheine mit Payback-Coupons – 3-10x Punkte!",link:AFF.wunschgutschein,linkLabel:"Wunschgutschein kaufen"},
    {tip:"Tanke bei Aral mit Payback (bis 10x Punkte) oder Shell mit Miles & More.",link:AFF.aral,linkLabel:"Aral Payback aktivieren"},
    {tip:"Stromanbieter über Check24 wechseln – bis 28.000 Payback Punkte Sofortbonus!",link:AFF.check24Strom,linkLabel:"Check24 Strom mit Bonus"},
    {tip:"Cadooz-Gutscheine über M&M: 10 Meilen pro 1€ beim Shopping.",link:AFF.cadooz,linkLabel:"Cadooz Gutscheine"},
    {tip:"Hotels über Amex Fine Hotels & Resorts buchen: gratis Frühstück, Upgrades, Hotelguthaben.",link:AFF.booking,linkLabel:"Hotels vergleichen"},
  ];
  if(isSelfEmp) sammeltipps.push({tip:"Alle Geschäftsausgaben mit Amex Business Gold zahlen – 1,5 MR/€.",link:AFF.amexBiz,linkLabel:"Amex Business Gold"});
  if(isFamily) sammeltipps.push({tip:"Kostenlose Zusatzkarten für Partner:in – doppelt Punkte sammeln.",link:AFF.amexGold,linkLabel:"Zusatzkarte beantragen"});

  const buchungstipps=["Sweet Spot: Frankfurt → Kapstadt Business Class ab 62.000 M&M Meilen.","Amex MR → Airlines transferieren (Ratio variiert je nach Partner, z.B. 5:4 bei British Airways).","Prämienflüge 330 Tage voraus buchen für beste Verfügbarkeit.","Open-Jaw + Stopover: 2 Ziele zum Preis von einem."];
  if(wantsBiz) buchungstipps.push("Business Class: München → Bangkok via Singapore Airlines ab 85.000 KrisFlyer Meilen.");
  if(wantsLounge) buchungstipps.push("Amex Platinum = unbegrenzter Priority Pass Zugang an 1.400+ Lounges weltweit.");

  const nextSteps=[
    {step:"Tritt der Community bei für wöchentliche Deal-Alerts.",link:AFF.community,label:"Community beitreten"},
    {step:"Meilen-Crashkurs: Video-Anleitungen zu jedem Schritt.",link:AFF.crashkurs,label:"Crashkurs ansehen"},
    {step:"Folge @traveling.prof für tägliche Hacks.",link:AFF.instagram,label:"Instagram folgen"},
  ];

  let firstGoal="Dein erster Prämienflug nach Mallorca";
  if(wantsBiz&&highBudget)firstGoal="Business Class nach Dubai oder Bangkok – mit Meilen";
  else if(wantsBiz)firstGoal="Business Class innerhalb Europas";
  else if(fernreise)firstGoal="Prämienflug nach Thailand oder Japan";
  else if(isFamily)firstGoal="Familienurlaub – Flüge komplett mit Meilen";

  return{level,levelEmoji,monthlyMiles:base.toLocaleString("de-DE"),yearlyMiles:(base*12).toLocaleString("de-DE"),firstGoal,cards,sammeltipps,buchungstipps,nextSteps};
}

function QuizStep({q,onSelect,selected}:{q:Q;onSelect:(v:string)=>void;selected?:string}) {
  return <div className="a-step a-fadein"><div className="a-step-emoji">{q.emoji}</div><h2 className="a-step-title">{q.title}</h2><p className="a-step-sub">{q.subtitle}</p><div className="a-options">{q.options.map(o=><button key={o.value} className={`a-option ${selected===o.value?"selected":""}`} onClick={()=>onSelect(o.value)}><span className="a-option-emoji">{o.emoji}</span><div className="a-option-text"><strong>{o.label}</strong>{o.desc&&<span>{o.desc}</span>}</div><div className="a-option-check">{selected===o.value?"✓":""}</div></button>)}</div></div>;
}

function LeadForm({onSubmit,loading}:{onSubmit:(d:LeadData)=>void;loading:boolean}) {
  const [d,setD]=useState<LeadData>({vorname:"",nachname:"",email:"",telefon:""});
  const [errors,setErrors]=useState<Partial<LeadData>>({});
  const validate=()=>{const e:Partial<LeadData>={};if(!d.vorname.trim())e.vorname="Pflichtfeld";if(!d.nachname.trim())e.nachname="Pflichtfeld";if(!d.email.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))e.email="Gültige E-Mail";if(!d.telefon.trim()||d.telefon.replace(/\D/g,"").length<6)e.telefon="Telefonnummer";setErrors(e);return Object.keys(e).length===0;};
  const handleSubmit=(e:FormEvent)=>{e.preventDefault();if(validate())onSubmit(d);};
  return <div className="a-step a-fadein"><div className="a-step-emoji">🔓</div><h2 className="a-step-title">Dein Meilenplan ist fertig!</h2><p className="a-step-sub">Trage deine Daten ein, um deine individuelle Anleitung freizuschalten.</p><div className="a-lead-trust"><span>🔒 DSGVO-konform</span><span>📧 Kein Spam</span><span>❌ Jederzeit abmeldbar</span></div><form className="a-form" onSubmit={handleSubmit}><div className="a-form-row"><div className="a-field"><label>Vorname *</label><input type="text" placeholder="Max" value={d.vorname} onChange={e=>setD({...d,vorname:e.target.value})}/>{errors.vorname&&<span className="a-error">{errors.vorname}</span>}</div><div className="a-field"><label>Nachname *</label><input type="text" placeholder="Mustermann" value={d.nachname} onChange={e=>setD({...d,nachname:e.target.value})}/>{errors.nachname&&<span className="a-error">{errors.nachname}</span>}</div></div><div className="a-field"><label>E-Mail-Adresse *</label><input type="email" placeholder="max@beispiel.de" value={d.email} onChange={e=>setD({...d,email:e.target.value})}/>{errors.email&&<span className="a-error">{errors.email}</span>}</div><div className="a-field"><label>Telefonnummer *</label><input type="tel" placeholder="+49 171 1234567" value={d.telefon} onChange={e=>setD({...d,telefon:e.target.value})}/>{errors.telefon&&<span className="a-error">{errors.telefon}</span>}</div><button type="submit" className="a-submit" disabled={loading}>{loading?"⏳ Wird erstellt...":"🚀 Meine Anleitung freischalten"}</button><p className="a-disclaimer">Mit Absenden stimmst du der Nutzung für den Meilenplan und Newsletter zu. Jederzeit abmeldbar. <Link href="/datenschutz">Datenschutz</Link></p></form></div>;
}

function LoadingScreen() {
  const [done,setDone]=useState([false,false,false,false]);
  useEffect(()=>{const t=[400,800,1200,1600].map((ms,i)=>setTimeout(()=>setDone(p=>{const n=[...p];n[i]=true;return n;}),ms));return()=>t.forEach(clearTimeout);},[]);
  const steps=["Antworten analysieren...","Karten-Setup berechnen...","Meilenpotenzial kalkulieren...","Anleitung erstellen..."];
  return <div className="a-loading a-fadein"><div className="a-loading-spinner"/><h2>Dein Plan wird erstellt</h2><p>Nur wenige Sekunden...</p><div className="a-loading-steps">{steps.map((s,i)=><div key={i} className={`a-loading-step ${done[i]?"done":i===done.filter(Boolean).length?"active":""}`}>{done[i]?"✓":"○"} {s}</div>)}</div></div>;
}

function ResultsView({result,lead}:{result:SetupResult;lead:LeadData}) {
  return <div className="a-results a-fadein">
    <div className="a-result-header"><span className="a-result-level-emoji">{result.levelEmoji}</span><div><h2>Hallo {lead.vorname}, hier ist dein Setup</h2><div className="a-result-level">Dein Level: <strong>{result.level}</strong></div></div></div>
    <div className="a-miles-box"><div className="a-miles-item"><span className="a-miles-num">{result.monthlyMiles}</span><span className="a-miles-label">Meilen / Monat</span></div><div className="a-miles-divider"/><div className="a-miles-item"><span className="a-miles-num">{result.yearlyMiles}</span><span className="a-miles-label">Meilen / Jahr</span></div></div>
    <p className="a-goal">🎯 <strong>Dein erstes Ziel:</strong> {result.firstGoal}</p>

    <div className="a-section"><h3>💳 Schritt 1: Dein Karten-Setup</h3><p className="a-section-hint">Beantrage in dieser Reihenfolge – nutze die Willkommensboni!</p><div className="a-cards">{result.cards.map((c,i)=><a key={i} href={c.link} target="_blank" rel="noopener noreferrer" className="a-card-rec"><div className="a-card-rec-top"><span className="a-card-tag">{c.tag}</span><span className="a-card-num">#{i+1}</span></div><h4>{c.name}</h4><div className="a-card-bonus">🎁 {c.bonus}</div><p>{c.reason}</p><span className="a-card-cta">Jetzt mit Bonus beantragen →</span></a>)}</div><p className="a-affiliate-hint">* Affiliate-Links: Bei Beantragung erhältst du den besten Bonus. Keine Mehrkosten für dich.</p></div>

    <div className="a-section"><h3>🛒 Schritt 2: Punkte maximieren</h3><p className="a-section-hint">Aktiviere diese Tricks heute noch:</p><div className="a-tips">{result.sammeltipps.map((t,i)=><div key={i} className="a-tip"><div className="a-tip-num">{i+1}</div><div className="a-tip-body"><p>{t.tip}</p><a href={t.link} target="_blank" rel="noopener noreferrer" className="a-tip-link">→ {t.linkLabel}</a></div></div>)}</div></div>

    <div className="a-section"><h3>✈️ Schritt 3: Meilen einlösen</h3><div className="a-tips">{result.buchungstipps.map((t,i)=><div key={i} className="a-tip"><div className="a-tip-num">✓</div><div className="a-tip-body"><p>{t}</p></div></div>)}</div>
    <div className="a-partners-row"><h4>🏨 Hotel-Programme:</h4><div className="a-partners"><a href={AFF.hilton} target="_blank" rel="noopener noreferrer" className="a-partner">Hilton Honors – Kostenlos anmelden →</a><a href={AFF.marriott} target="_blank" rel="noopener noreferrer" className="a-partner">Marriott Bonvoy – Kostenlos anmelden →</a><a href={AFF.booking} target="_blank" rel="noopener noreferrer" className="a-partner">Booking.com – Hotels vergleichen →</a></div>
    <h4>🚗 Mobilität mit Bonus:</h4><div className="a-partners"><a href={AFF.sixtRide} target="_blank" rel="noopener noreferrer" className="a-partner">SIXT Ride – Amex Guthaben →</a><a href={AFF.shell} target="_blank" rel="noopener noreferrer" className="a-partner">Shell ClubSmart + M&M →</a><a href={AFF.aral} target="_blank" rel="noopener noreferrer" className="a-partner">Aral + Payback →</a></div>
    <h4>⚡ Fixkosten-Bonus:</h4><div className="a-partners"><a href={AFF.check24Strom} target="_blank" rel="noopener noreferrer" className="a-partner">Check24 Strom – bis 28.000 Payback Punkte →</a><a href={AFF.check24Gas} target="_blank" rel="noopener noreferrer" className="a-partner">Check24 Gas – mit Payback-Bonus →</a></div></div></div>

    <div className="a-section"><h3>🚀 Nächste Schritte</h3><div className="a-next-steps">{result.nextSteps.map((s,i)=><a key={i} href={s.link} target="_blank" rel="noopener noreferrer" className="a-next-step"><span>{s.step}</span><span className="a-next-cta">{s.label} →</span></a>)}</div></div>

    <div className="a-final-cta"><h3>Du willst den vollen Plan?</h3><p>Im Meilen-Crashkurs zeige ich dir in 15 Videos alles Schritt für Schritt.</p><div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",justifyContent:"center"}}><a href={AFF.crashkurs} className="a-submit" style={{maxWidth:280,textAlign:"center"}}>Zum Meilen-Crashkurs →</a><a href={AFF.instagram} target="_blank" rel="noopener noreferrer" className="a-btn-outline">@traveling.prof folgen</a></div></div>
  </div>;
}

// Stripe Payment Link for guests (no account)
const STRIPE_LINK = "https://buy.stripe.com/28EcN431x9Ur9nR7X46c00g";

function PaywallScreen({onAlreadyPaid,onCheckout,isLoggedIn,checkoutLoading}:{onAlreadyPaid:()=>void;onCheckout:()=>void;isLoggedIn:boolean;checkoutLoading:boolean}) {
  const features = [
    "Personalisiertes Karten-Setup mit Reihenfolge",
    "Meilenpotenzial-Berechnung (monatlich + jährlich)",
    "Individuelle Sammeltipps mit Affiliate-Boni",
    "Buchungsstrategien für dein Reiseziel",
    "Hotel- und Lounge-Empfehlungen",
    "Nächste Schritte mit konkreten Links",
  ];
  return <div className="a-step a-fadein">
    <div className="a-step-emoji">🔓</div>
    <h2 className="a-step-title">Deine Analyse ist fertig!</h2>
    <p className="a-step-sub">Schalte jetzt deinen personalisierten Meilen-Plan frei.</p>
    <div style={{maxWidth:420,margin:"0 auto"}}>
      <div style={{background:"#1c1917",border:"1px solid #292524",borderRadius:16,padding:"1.5rem",marginBottom:"1.25rem"}}>
        <div style={{textAlign:"center",marginBottom:"1rem"}}>
          <span style={{fontFamily:"Playfair Display,serif",fontSize:"2.5rem",fontWeight:800,color:"#e8720c"}}>7 €</span>
          <span style={{fontSize:"0.85rem",color:"#78716c",marginLeft:"0.5rem"}}>einmalig</span>
        </div>
        <div style={{display:"grid",gap:"0.5rem"}}>
          {features.map((item,i)=><div key={i} style={{display:"flex",gap:"0.5rem",alignItems:"flex-start",fontSize:"0.85rem",color:"#d6d3d1"}}>
            <span style={{color:"#22c55e",fontWeight:700,flexShrink:0}}>✓</span>{item}
          </div>)}
        </div>
      </div>
      {isLoggedIn ? (
        <button onClick={onCheckout} className="a-submit" style={{display:"block",width:"100%",textAlign:"center",marginBottom:"0.75rem"}} disabled={checkoutLoading}>
          {checkoutLoading ? "⏳ Weiterleitung..." : "Jetzt für 7 € freischalten"}
        </button>
      ) : (
        <a href={STRIPE_LINK} className="a-submit" style={{display:"block",textAlign:"center",textDecoration:"none",marginBottom:"0.75rem"}}>
          Jetzt für 7 € freischalten
        </a>
      )}
      <div style={{display:"flex",justifyContent:"center",gap:"1rem",marginBottom:"0.75rem"}}>
        {["🔒 SSL-verschlüsselt","💳 Stripe","↩️ Geld-zurück-Garantie"].map((t,i)=><span key={i} style={{fontSize:"0.7rem",color:"#57534e"}}>{t}</span>)}
      </div>
      <p style={{textAlign:"center",fontSize:"0.72rem",color:"#44403c"}}>
        Bereits bezahlt?{" "}
        <button onClick={onAlreadyPaid} style={{background:"none",border:"none",color:"#e8720c",cursor:"pointer",fontFamily:"inherit",fontSize:"0.72rem",textDecoration:"underline"}}>
          Ergebnis anzeigen
        </button>
      </p>
    </div>
  </div>;
}

export default function AnalysePage() {
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState<Answers>({});
  const [lead,setLead]=useState<LeadData|null>(null);
  const [result,setResult]=useState<SetupResult|null>(null);
  const [loading,setLoading]=useState(false);
  const [paid,setPaid]=useState(false);
  const [user,setUser]=useState<User|null>(null);
  const [checkoutLoading,setCheckoutLoading]=useState(false);
  const supabase = createClient();

  // Check auth status and purchase on mount
  useEffect(()=>{
    async function init() {
      // Check if user is logged in
      const {data:{user:u}}=await supabase.auth.getUser();
      setUser(u);

      // Check if user has purchased "analyse"
      if(u){
        const {data:purchase}=await supabase
          .from("purchases")
          .select("id")
          .eq("product_id","analyse")
          .limit(1)
          .single();
        if(purchase){
          setPaid(true);
          localStorage.setItem("analyse-paid","true");
        }
      }

      // Check URL params and localStorage for payment status
      const params=new URLSearchParams(window.location.search);
      if(params.get("success")==="true"||params.get("checkout")==="success"){
        setPaid(true);
        localStorage.setItem("analyse-paid","true");
        window.history.replaceState({},"","/analyse");
        // Restore saved answers from before checkout redirect
        const saved=localStorage.getItem("analyse-answers");
        if(saved){
          try{
            const parsed=JSON.parse(saved);
            setAnswers(parsed);
            setStep(questions.length+1); // Skip to lead form
          }catch{}
        }
      } else if(localStorage.getItem("analyse-paid")==="true"){
        setPaid(true);
      }
    }
    init();
  },[]);

  // Save results to DB after generation (for logged-in users)
  const saveResults = useCallback(async (a:Answers, r:SetupResult) => {
    if(!user) return;
    try {
      await fetch("/api/analyse/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: a, result: r }),
      });
    } catch(err) {
      console.error("[Analyse] Save failed:", err);
    }
  }, [user]);

  const total=questions.length+3;
  const handleAnswer=(qId:string,v:string)=>{setAnswers(p=>({...p,[qId]:v}));setTimeout(()=>setStep(s=>s+1),300);};
  const handlePaid=()=>{setPaid(true);localStorage.setItem("analyse-paid","true");setStep(questions.length+1);};

  // Checkout via API for logged-in users
  const handleCheckout=async()=>{
    setCheckoutLoading(true);
    // Save answers to localStorage so they survive the Stripe redirect
    localStorage.setItem("analyse-answers",JSON.stringify(answers));
    try {
      const res=await fetch("/api/stripe/checkout",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          productId:"analyse",
          successUrl:`${window.location.origin}/analyse?checkout=success`,
          cancelUrl:`${window.location.origin}/analyse`,
        }),
      });
      const {url}=await res.json();
      if(url) window.location.href=url;
      else setCheckoutLoading(false);
    } catch {
      setCheckoutLoading(false);
    }
  };

  const handleLead=(d:LeadData)=>{
    setLoading(true);
    setLead(d);
    setTimeout(()=>{
      const r=generateResult(answers);
      setResult(r);
      setLoading(false);
      setStep(questions.length+2);
      // Save to DB for logged-in users
      saveResults(answers, r);
      // Fire-and-forget: send analyse result email
      fetch("/api/analyse-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: d.email,
          vorname: d.vorname,
          result: {
            level: r.level,
            monthlyMiles: r.monthlyMiles,
            yearlyMiles: r.yearlyMiles,
            cards: r.cards.map((c) => c.name),
          },
        }),
      }).catch((err) => console.error("[Analyse] Lead email failed:", err));
      // Clean up localStorage
      localStorage.removeItem("analyse-answers");
    },2200);
  };

  useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"});},[step]);

  const isQuiz=step<questions.length;
  const isPaywall=step===questions.length&&!paid;
  const isLead=step===questions.length+1||(step===questions.length&&paid);
  const isResult=step===questions.length+2;

  return <div className="a-page">
    <div className="a-header"><Link href="/" className="a-header-brand"><div className="a-header-mark">TP</div><div><div className="a-header-name">traveling.prof</div><div className="a-header-tag">Travel Hacking Analyse</div></div></Link>{step>0&&!isResult&&<button onClick={()=>setStep(s=>s-1)} style={{background:"none",border:"1px solid #292524",borderRadius:8,padding:"0.35rem 0.75rem",color:"#78716c",cursor:"pointer",fontSize:"0.78rem",fontFamily:"inherit"}}>← Zurück</button>}</div>
    <div className="a-container">
      {!isResult&&<div className="a-progress"><div className="a-progress-bar" style={{width:`${Math.round(((step+1)/total)*100)}%`}}/><span className="a-progress-label">Schritt {step+1} von {total}</span></div>}
      {isQuiz&&<QuizStep q={questions[step]} onSelect={v=>handleAnswer(questions[step].id,v)} selected={answers[questions[step].id]}/>}
      {isPaywall&&<PaywallScreen onAlreadyPaid={handlePaid} onCheckout={handleCheckout} isLoggedIn={!!user} checkoutLoading={checkoutLoading}/>}
      {isLead&&!loading&&<LeadForm onSubmit={handleLead} loading={loading}/>}
      {isLead&&loading&&<LoadingScreen/>}
      {isResult&&result&&lead&&<ResultsView result={result} lead={lead}/>}
    </div>
  </div>;
}
