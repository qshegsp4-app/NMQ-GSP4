import { useState, useCallback, useEffect } from "react";

const bodyParts = [
  { id: 0,  label: "คอส่วนบน",             side: "left"   },
  { id: 1,  label: "คอส่วนล่าง",            side: "right"  },
  { id: 2,  label: "ไหล่ด้านซ้าย",          side: "left"   },
  { id: 3,  label: "ไหล่ด้านขวา",           side: "right"  },
  { id: 4,  label: "แขนส่วนบนด้านซ้าย",     side: "left"   },
  { id: 5,  label: "หลัง",                  side: "center" },
  { id: 6,  label: "แขนส่วนบนด้านขวา",      side: "right"  },
  { id: 7,  label: "เอว",                   side: "center" },
  { id: 8,  label: "สะโพก",                side: "center" },
  { id: 9,  label: "ก้น",                  side: "center" },
  { id: 10, label: "ข้อศอกด้านซ้าย",        side: "left"   },
  { id: 11, label: "ข้อศอกด้านขวา",         side: "right"  },
  { id: 12, label: "แขนส่วนล่างด้านซ้าย",   side: "left"   },
  { id: 13, label: "แขนส่วนล่างด้านขวา",    side: "right"  },
  { id: 14, label: "ข้อมือด้านซ้าย",        side: "left"   },
  { id: 15, label: "ข้อมือด้านขวา",         side: "right"  },
  { id: 16, label: "มือด้านซ้าย",           side: "left"   },
  { id: 17, label: "มือด้านขวา",            side: "right"  },
  { id: 18, label: "ต้นขาด้านซ้าย",         side: "left"   },
  { id: 19, label: "ต้นขาด้านขวา",          side: "right"  },
  { id: 20, label: "เข่าด้านซ้าย",          side: "left"   },
  { id: 21, label: "เข่าด้านขวา",           side: "right"  },
  { id: 22, label: "ขาด้านซ้าย",            side: "left"   },
  { id: 23, label: "ขาด้านขวา",             side: "right"  },
  { id: 24, label: "ข้อเท้าด้านซ้าย",       side: "left"   },
  { id: 25, label: "ข้อเท้าด้านขวา",        side: "right"  },
  { id: 26, label: "เท้าด้านซ้าย",          side: "left"   },
  { id: 27, label: "เท้าด้านขวา",           side: "right"  },
];

const numPositions = {
  0:[100,30],1:[100,45],2:[62,62],3:[138,62],4:[46,96],5:[100,92],6:[154,96],
  7:[100,120],8:[100,142],9:[100,160],10:[36,122],11:[164,122],12:[28,150],
  13:[172,150],14:[22,174],15:[178,174],16:[18,198],17:[182,198],18:[76,202],
  19:[124,202],20:[74,250],21:[126,250],22:[72,290],23:[128,290],24:[70,330],
  25:[130,330],26:[66,357],27:[134,357],
};

const scaleColors = { 0:"#e2e8f0", 2:"#fef08a", 3:"#fb923c", 4:"#ef4444" };
const scaleLabels = { 0:"ไม่มีอาการ", 2:"เจ็บปวดน้อย", 3:"เจ็บปวดปานกลาง", 4:"เจ็บปวดมาก" };

const divisionOptions = {
  "ผจก.ฝ่าย": [
    { value: "ผจ.ฝ่าย", label: "ผู้จัดการฝ่าย (ยขก.)" },
  ],
  "วบ.": [
    { value: "ผจ.วบ.",                         label: "ผู้จัดการส่วนวิศวกรรมบำรุงรักษาฯ (วบ.)" },
    { value: "ผจก.แผนกไฟฟ้าและระบบควบคุม",      label: "ผู้จัดการแผนกบำรุงรักษาไฟฟ้าและระบบควบคุม" },
    { value: "วิศวกรระบบควบคุม",                 label: "วิศวกรระบบควบคุม" },
    { value: "วิศวกรไฟฟ้า",                      label: "วิศวกรไฟฟ้า" },
    { value: "ช่างเทคนิคไฟฟ้าและผู้ช่วย",           label: "ช่างเทคนิคไฟฟ้าและผู้ช่วย" },
    { value: "ช่างเทคนิคระบบและผู้ช่วย",            label: "ช่างเทคนิคระบบควบคุมและผู้ช่วย" },
    { value: "ผจก.แผนกเครื่องกล",                label: "ผู้จัดการแผนกเครื่องกล" },
    { value: "วิศวกรเครื่องกล Rotating",           label: "วิศวกรเครื่องกล Rotating" },
    { value: "วิศวกรเครื่องกล Stationary",          label: "วิศวกรเครื่องกล Stationary" },
    { value: "ช่างเทคนิค Rotating และผู้ช่วย",        label: "ช่างเทคนิค Rotating และผู้ช่วย" },
    { value: "ช่างเทคนิค Stationary และผู้ช่วย",      label: "ช่างเทคนิค Stationary และผู้ช่วย" },
    { value: "ผจก.แผนกบริหารวิศวกรรมฯ",            label: "ผู้จัดการแผนกบริหารวิศวกรรมและเทคนิค" },
    { value: "วิศวกรกระบวนการผลิต/Lab และผู้ช่วย",    label: "วิศวกรกระบวนการผลิต/Lab และผู้ช่วย" },
    { value: "วิศวกรตรวจสอบโรงงานและผู้ช่วย",         label: "วิศวกรตรวจสอบโรงงานและผู้ช่วย" },
    { value: "วิศวกรโครงการและผู้ช่วย",               label: "วิศวกรโครงการและผู้ช่วย" },
    { value: "พนักงานวิเคราะห์และวางแผน และผู้ช่วย",   label: "พนักงานวิเคราะห์และวางแผน และผู้ช่วย" },
    { value: "พนักงานพัสดุและผู้ช่วย",                label: "พนักงานพัสดุและผู้ช่วย" },
  ],
  "ปน.": [
    { value: "ผจ.ปน.",                                    label: "ผู้จัดการส่วนคุณภาพความปลอดภัยอาชีวอนามัยฯ (ปน.)" },
    { value: "พนักงานมวลชนสัมพันธ์อาวุโสและผู้ช่วย",             label: "พนักงานมวลชนสัมพันธ์อาวุโสและผู้ช่วย" },
    { value: "หัวหน้าช่าง (ธุรการ)และผู้ช่วย",                   label: "หัวหน้าช่าง (ธุรการ)และผู้ช่วย" },
    { value: "พนักงานระบบการจัดการและผู้ช่วย",                 label: "พนักงานระบบการจัดการและผู้ช่วย" },
    { value: "รปภ.",                                      label: "เจ้าหน้าที่รักษาความปลอดภัย" },
    { value: "พนักงานขับรถ",                                label: "พนักงานขับรถ" },
    { value: "แม่บ้าน",                                     label: "แม่บ้าน" },
    { value: "คนสวน",                                     label: "คนสวน" },
    { value: "พนักงานความปลอดภัยฯและผู้ช่วย",                 label: "พนักงานบริหารความปลอดภัยฯและผู้ช่วย" },
    { value: "ช่างเทคนิคบำรุงรักษาอาคารและสถานที่และผู้ช่วย",      label: "ช่างเทคนิคบำรุงรักษาอาคารและสถานที่และผู้ช่วย" },
    { value: "วิศวกรสิ่งแวดล้อมและผู้ช่วย",                      label: "วิศวกรสิ่งแวดล้อมและผู้ช่วย" },
  ],
  "ปข.": [
    { value: "ผจ.ปข.",                              label: "ผู้จัดการส่วนปฏิบัติการฯ (ปข.)" },
    { value: "ผจก.แผนกควบคุมการผลิต",                     label: "ผู้จัดการแผนกควบคุมการผลิต" },
    { value: "พนักงานควบคุมการผลิตและผู้ช่วย",             label: "พนักงานควบคุมการผลิตและผู้ช่วย" },
    { value: "ผจก.แผนกรับจ่ายผลิตภัณฑ์และผู้ช่วย",        label: "ผู้จัดการแผนกรับจ่ายผลิตภัณฑ์และผู้ช่วย" },
  ],
};

function getNowDatetime() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2,"0");
  return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

const initialInfo = {
  name: "", age: "", job: "", division: "",
  date: getNowDatetime(),
  shift: "", gender: "", workAge: ""
};
const initialScores = Object.fromEntries(bodyParts.map(p => [p.id, 0]));

function getRiskColor(score) {
  if (score <= 49) return "#22c55e";
  if (score <= 70) return "#f59e0b";
  if (score <= 91) return "#f97316";
  return "#ef4444";
}

function getRiskLabel(score) {
  if (score <= 49) return "(ความเสี่ยงน้อย)";
  if (score <= 70) return "(ความเสี่ยงปานกลาง)";
  if (score <= 91) return "(ความเสี่ยงสูง)";
  return "(ความเสี่ยงสูงมาก)";
}

function BodyFigureSVG({ scores, onSelect, selected }) {
  const skin = "#fde8c8"; const outline = "#a08060"; const sw = "1.2";
  return (
    <svg viewBox="0 0 200 420" style={{ width:"100%", maxHeight:460 }}>
      <ellipse cx="100" cy="18" rx="14" ry="16" fill={skin} stroke={outline} strokeWidth={sw}/>
      <ellipse cx="86" cy="18" rx="3" ry="4" fill={skin} stroke={outline} strokeWidth="0.8"/>
      <ellipse cx="114" cy="18" rx="3" ry="4" fill={skin} stroke={outline} strokeWidth="0.8"/>
      <rect x="94" y="33" width="12" height="14" rx="2" fill={skin} stroke={outline} strokeWidth={sw}/>
      <path d="M94 47 Q78 50 64 60 L60 68 L68 70 Q80 66 94 63Z" fill={skin} stroke={outline} strokeWidth={sw}/>
      <path d="M106 47 Q122 50 136 60 L140 68 L132 70 Q120 66 106 63Z" fill={skin} stroke={outline} strokeWidth={sw}/>
      <path d="M68 68 L68 176 Q80 180 100 180 Q120 180 132 176 L132 68 Q120 64 100 62 Q80 64 68 68Z" fill={skin} stroke={outline} strokeWidth={sw}/>
      <line x1="100" y1="64" x2="100" y2="100" stroke="#c8a878" strokeWidth="0.5"/>
      <ellipse cx="100" cy="134" rx="2" ry="1.5" fill="none" stroke="#c8a878" strokeWidth="0.8"/>
      <path d="M94 50 Q84 52 74 56" fill="none" stroke="#c8a878" strokeWidth="0.6"/>
      <path d="M106 50 Q116 52 126 56" fill="none" stroke="#c8a878" strokeWidth="0.6"/>
      <path d="M64 60 Q52 66 44 84 L40 112 Q40 116 44 117 Q48 117 50 113 L54 86 Q60 70 68 66Z" fill={skin} stroke={outline} strokeWidth={sw}/>
      <ellipse cx="42" cy="116" rx="6" ry="5" fill={skin} stroke={outline} strokeWidth={sw}/>
      <path d="M36 116 Q28 130 24 152 L22 166 Q22 170 26 170 Q30 170 32 166 L34 152 Q38 132 48 118Z" fill={skin} stroke={outline} strokeWidth={sw}/>
      <ellipse cx="23" cy="170" rx="5" ry="4" fill={skin} stroke={outline} strokeWidth={sw}/>
      <path d="M18 174 Q14 184 14 196 Q14 204 20 206 L28 206 Q34 204 34 196 Q32 184 28 174Z" fill={skin} stroke={outline} strokeWidth={sw}/>
      {[[16,196,15,210],[20,198,19,213],[24,198,23,213],[28,196,28,210],[31,193,31,205]].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={outline} strokeWidth="0.8"/>
      ))}
      <path d="M136 60 Q148 66 156 84 L160 112 Q160 116 156 117 Q152 117 150 113 L146 86 Q140 70 132 66Z" fill={skin} stroke={outline} strokeWidth={sw}/>
      <ellipse cx="158" cy="116" rx="6" ry="5" fill={skin} stroke={outline} strokeWidth={sw}/>
      <path d="M164 116 Q172 130 176 152 L178 166 Q178 170 174 170 Q170 170 168 166 L166 152 Q162 132 152 118Z" fill={skin} stroke={outline} strokeWidth={sw}/>
      <ellipse cx="177" cy="170" rx="5" ry="4" fill={skin} stroke={outline} strokeWidth={sw}/>
      <path d="M182 174 Q186 184 186 196 Q186 204 180 206 L172 206 Q166 204 166 196 Q168 184 172 174Z" fill={skin} stroke={outline} strokeWidth={sw}/>
      {[[184,196,185,210],[180,198,181,213],[176,198,177,213],[172,196,172,210],[169,193,169,205]].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={outline} strokeWidth="0.8"/>
      ))}
      <path d="M68 172 Q64 178 64 192 Q66 202 76 206 L100 208 L124 206 Q134 202 136 192 Q136 178 132 172Z" fill={skin} stroke={outline} strokeWidth={sw}/>
      <line x1="100" y1="176" x2="100" y2="208" stroke="#c8a878" strokeWidth="0.5"/>
      <path d="M76 204 Q66 210 64 228 L62 272 Q62 278 68 278 Q74 278 76 272 L78 228 Q82 212 92 208Z" fill={skin} stroke={outline} strokeWidth={sw}/>
      <ellipse cx="68" cy="276" rx="10" ry="8" fill={skin} stroke={outline} strokeWidth={sw}/>
      <path d="M60 282 Q56 300 56 320 L56 336 Q56 342 62 342 Q68 342 70 336 L72 320 Q74 302 80 284Z" fill={skin} stroke={outline} strokeWidth={sw}/>
      <ellipse cx="60" cy="340" rx="8" ry="6" fill={skin} stroke={outline} strokeWidth={sw}/>
      <path d="M52 344 Q48 352 48 362 Q48 370 58 372 L74 372 Q82 370 82 362 Q80 352 74 346Z" fill={skin} stroke={outline} strokeWidth={sw}/>
      {[50,56,62,68,74].map((cx,i)=>(<ellipse key={`tl${i}`} cx={cx} cy={374} rx="3" ry="3.5" fill={skin} stroke={outline} strokeWidth="0.7"/>))}
      <path d="M124 204 Q134 210 136 228 L138 272 Q138 278 132 278 Q126 278 124 272 L122 228 Q118 212 108 208Z" fill={skin} stroke={outline} strokeWidth={sw}/>
      <ellipse cx="132" cy="276" rx="10" ry="8" fill={skin} stroke={outline} strokeWidth={sw}/>
      <path d="M140 282 Q144 300 144 320 L144 336 Q144 342 138 342 Q132 342 130 336 L128 320 Q126 302 120 284Z" fill={skin} stroke={outline} strokeWidth={sw}/>
      <ellipse cx="140" cy="340" rx="8" ry="6" fill={skin} stroke={outline} strokeWidth={sw}/>
      <path d="M148 344 Q152 352 152 362 Q152 370 142 372 L126 372 Q118 370 118 362 Q120 352 126 346Z" fill={skin} stroke={outline} strokeWidth={sw}/>
      {[150,144,138,132,126].map((cx,i)=>(<ellipse key={`tr${i}`} cx={cx} cy={374} rx="3" ry="3.5" fill={skin} stroke={outline} strokeWidth="0.7"/>))}
      {bodyParts.map(part => {
        const [cx,cy] = numPositions[part.id]; const sc = scores[part.id];
        const isSel = selected === part.id;
        const fill = sc > 0 ? scaleColors[sc] : "#ffffff";
        const strk = isSel ? "#1e3a5f" : sc > 0 ? "#92400e" : "#94a3b8";
        return (
          <g key={part.id} onClick={() => onSelect(part.id)} style={{ cursor:"pointer" }}>
            <circle cx={cx} cy={cy} r={isSel?9:8} fill={fill} stroke={strk} strokeWidth={isSel?2.5:1.5}
              style={{ filter:sc>0?"drop-shadow(0 0 3px rgba(239,68,68,0.5))":"none", transition:"all 0.15s" }}/>
            <text x={cx} y={cy+3.5} textAnchor="middle" fontSize="7.5" fontWeight="bold"
              fill={sc>0?"#1e293b":"#475569"} style={{ pointerEvents:"none", userSelect:"none" }}>{part.id}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ScoreButtons({ id, scores, setScore }) {
  return (
    <div style={{ display:"flex", gap:5 }}>
      {[2,3,4].map(val => (
        <button key={val} onClick={(e)=>{ e.stopPropagation(); setScore(id, scores[id]===val?0:val); }}
          style={{ flex:1, padding:"7px 4px", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer",
            border:`2px solid ${scores[id]===val?scaleColors[val]:"#e2e8f0"}`,
            background:scores[id]===val?scaleColors[val]:"#f8fafc",
            color:scores[id]===val?"#1e293b":"#94a3b8", transition:"all 0.12s" }}>
          {scaleLabels[val]}
        </button>
      ))}
    </div>
  );
}

function PartRow({ part, scores, setScore, selected, onSelect }) {
  const isOpen = selected === part.id; const sc = scores[part.id];
  return (
    <div style={{ marginBottom:6 }}>
      <div onClick={() => onSelect(part.id)} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px",
        background:isOpen?"#eff6ff":"white", borderRadius:isOpen?"10px 10px 0 0":10, cursor:"pointer",
        border:`2px solid ${isOpen?"#3b82f6":sc>0?scaleColors[sc]:"#f1f5f9"}`,
        borderBottom:isOpen?"none":undefined, transition:"all 0.12s" }}>
        <div style={{ width:22, height:22, borderRadius:"50%", background:"#1e3a5f", color:"white",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, flexShrink:0 }}>{part.id}</div>
        <span style={{ flex:1, fontSize:13, color:"#1e293b" }}>{part.label}</span>
        {sc>0 && <span style={{ fontSize:11, fontWeight:700,
          color:sc===3?"#ef4444":sc===2?"#f97316":"#ca8a04",
          background:sc===3?"#fee2e2":sc===2?"#ffedd5":"#fefce8",
          padding:"2px 8px", borderRadius:6 }}>{scaleLabels[sc]}</span>}
        <span style={{ fontSize:12, color:"#94a3b8", marginLeft:4 }}>{isOpen?"▲":"▼"}</span>
      </div>
      {isOpen && (
        <div style={{ padding:"10px", background:"#f0f9ff", border:"2px solid #3b82f6", borderTop:"none", borderRadius:"0 0 10px 10px" }}>
          <ScoreButtons id={part.id} scores={scores} setScore={setScore}/>
        </div>
      )}
    </div>
  );
}

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyNhFv0xP3am7Uba0sx6zLfPBUxvoJpsLlzEHGARFLymNV_8VnOHe1qG86QTllJaFvU4g/exec";

export default function BodyMapAssessment() {
  const [page, setPage] = useState("home");
  const [info, setInfo] = useState(initialInfo);
  const [fatigue, setFatigue] = useState(null);
  const [painArea, setPainArea] = useState("");
  const [scores, setScores] = useState(initialScores);
  const [selected, setSelected] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [touched, setTouched] = useState({});
  const [pdpaConsent, setPdpaConsent] = useState(false);

  useEffect(() => { window.scrollTo(0,0); }, [page]);
  const handleBlur = (field) => setTouched(p => ({ ...p, [field]:true }));
  const isError = (field, value) => touched[field] && !value;
  const setScore = useCallback((id,val) => setScores(p=>({...p,[id]:val})), []);
  const handleSelect = useCallback((id) => setSelected(prev=>prev===id?null:id), []);

  const leftParts   = bodyParts.filter(p=>p.side==="left");
  const rightParts  = bodyParts.filter(p=>p.side==="right");
  const centerParts = bodyParts.filter(p=>p.side==="center");
  const totalScore  = Object.values(scores).reduce((a,b)=>a+(b===0?1:b),0);
  const maxScore    = bodyParts.length*4;
  const affected    = Object.values(scores).filter(v=>v>0).length;
  const leftTotal   = leftParts.reduce((a,p)=>a+scores[p.id],0);
  const rightTotal  = rightParts.reduce((a,p)=>a+scores[p.id],0);
  const centerTotal = centerParts.reduce((a,p)=>a+scores[p.id],0);
  const riskColor   = getRiskColor(totalScore);
  const riskLabel   = getRiskLabel(totalScore);

  const canGoToForm = info.name.trim()!==""&&info.job!==""&&info.age!==""&&info.shift!==""&&info.workAge!=="";
  const formValidationMsg = !info.name.trim()?"กรุณากรอกชื่อผู้ถูกประเมิน"
    :!info.age?"กรุณาเลือกช่วงอายุ":!info.job?"กรุณาเลือกส่วนงาน"
    :!info.shift?"กรุณาเลือกช่วงเวลาทำงาน":!info.workAge?"กรุณากรอกอายุการทำงาน":"";
  const canProceed = fatigue!==null;

  const handleSubmitPre = () => {
    if (!canGoToForm||!fatigue||!pdpaConsent) { setTouched({name:true,age:true,job:true,shift:true,workAge:true}); return; }
    setPage("form");
  };
  const handleReset = () => {
    setPage("home"); setScores(initialScores); setSelected(null); setFatigue(null);
    setPainArea(""); setInfo({...initialInfo, date: getNowDatetime()}); setTouched({}); setPdpaConsent(false);
  };

  async function saveToGoogleSheet() {
    if (isSaving) return; setIsSaving(true);
    const payload = { date:info.date, name:info.name, age:info.age, job:info.job, division:info.division,
      shift:info.shift, gender:info.gender, work_age:info.workAge, fatigue,
      pain_area:painArea, total_score:totalScore, left_total:leftTotal, center_total:centerTotal,
      right_total:rightTotal, affected_count:affected,
      body_scores:bodyParts.map(p=>({body_part_id:p.id,body_part_label:p.label,side:p.side,score:scores[p.id]})) };
    const controller = new AbortController();
    const timeoutId = setTimeout(()=>controller.abort(),30000);
    try {
      await fetch(APPS_SCRIPT_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),signal:controller.signal});
      clearTimeout(timeoutId); alert("✅ ข้อมูลถูกบันทึกเรียบร้อย ขอความร่วมมือช่วยทำแบบประเมินความพึงพอใจ https://forms.gle/GVfA3pjsWYzMrmP37");
    } catch(err) {
      clearTimeout(timeoutId);
      if (err.name==="AbortError") alert("⏱️ กำลังตรวจสอบ"); else alert("❌ เกิดข้อผิดพลาด: "+err.message);
    } finally { setIsSaving(false); }
  }

  // ===== HOME PAGE =====
  if (page==="home") return (
    <div style={pageStyle}><div style={cardStyle}>
      <div style={{background:"linear-gradient(135deg,#1e3a5f,#0369a1)",color:"white",padding:"32px 24px",textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:8}}>💪🏻🦴</div>
        <div style={{fontWeight:900,fontSize:22,marginBottom:4}}>Nordic Musculoskeletal Questionnaire</div>
        <div style={{fontSize:14,opacity:0.8}}>แบบประเมินความเจ็บปวดของระบบกล้ามเนื้อและกระดูก</div>
        <div style={{display:"inline-block",marginTop:10,background:"rgba(255,255,255,0.15)",borderRadius:20,padding:"4px 14px",fontSize:12}}>Ergonomic Assessment · GSP4</div>
      </div>
      <div style={{padding:"24px 20px"}}>
        <div style={{background:"#f0f9ff",border:"1px solid #bfdbfe",borderRadius:14,padding:16,marginBottom:20}}>
          <div style={{fontWeight:700,color:"#1e3a5f",fontSize:14,marginBottom:10}}>📌 วัตถุประสงค์</div>
          <p style={{margin:0,fontSize:13,color:"#334155",lineHeight:1.7}}>แบบประเมินนี้ใช้สำรวจความเจ็บปวดหรือไม่สบายตัวของระบบกล้ามเนื้อและกระดูก ที่เกิดจากการทำงานใน <strong>3 เดือนที่ผ่านมา</strong> เพื่อนำไปสู่การปรับปรุงสภาพแวดล้อมและท่าทางในการทำงานอย่างเหมาะสม</p>
        </div>
        <div style={{marginBottom:20}}>
          <div style={{fontWeight:700,color:"#1e3a5f",fontSize:14,marginBottom:12}}>🗂️ ขั้นตอนการประเมิน</div>
          {[["1","#3b82f6","ตอบแบบสอบถามเบื้องต้น","ข้อมูลทั่วไปและแบบสำรวจความเมื่อยล้าทางร่างกายจากการทำงาน"],
            ["2","#f1861b","ประเมิน NMQ","ระบุระดับความเจ็บปวดในแต่ละส่วนของร่างกาย"],
            ["3","#0369a1","ดูผลการประเมิน","สรุปคะแนนและแปลผลความเสี่ยง"],
            ["4","#8b5cf6","ดูคำแนะนำเพื่อสุขภาพ","ดูคำแนะนำเพื่อเฝ้าระวังสุขภาพ และเพื่อเป็นแนวทางในการปรับเปลี่ยนพฤติกรรม"],
            ["5","#16a34a","บันทึกผล และประเมินความพึงพอใจ","กดบันทึกผลเพื่อส่งข้อมูล และทำแบบประเมินความพึงพอใจในการใช้งานแอปพลิเคชันนี้"]
          ].map(([n,c,t,d])=>(
            <div key={n} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:8,background:"white",borderRadius:10,border:`1.5px solid ${c}33`}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:c,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,flexShrink:0}}>{n}</div>
              <div><div style={{fontWeight:700,fontSize:13,color:"#1e293b"}}>{t}</div><div style={{fontSize:11,color:"#94a3b8"}}>{d}</div></div>
            </div>
          ))}
        </div>

        {/* ===== PDPA SECTION (ย้ายมาไว้หน้าแรก) ===== */}
        <div style={{marginBottom:20,padding:"14px 16px",background:pdpaConsent?"#f0fdf4":"#fafafa",border:`2px solid ${pdpaConsent?"#86efac":"#e2e8f0"}`,borderRadius:14,transition:"all 0.2s"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#1e3a5f",marginBottom:8}}>🔒 การยินยอมเก็บข้อมูลส่วนบุคคล (PDPA)</div>
          <p style={{fontSize:12,color:"#475569",lineHeight:1.7,margin:"0 0 10px 0"}}>ข้อมูลที่คุณกรอกในแบบสอบถามนี้จะถูกจัดเก็บและใช้เพื่อ<strong> วิเคราะห์ความเหนื่อยล้าจากการทำงาน</strong> เท่านั้น และจะไม่ถูกเปิดเผยต่อบุคคลภายนอกโดยไม่ได้รับความยินยอม ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562</p>
          <div onClick={()=>setPdpaConsent(v=>!v)} style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer"}}>
            <div style={{marginTop:2,width:18,height:18,minWidth:18,border:`2px solid ${pdpaConsent?"#16a34a":"#94a3b8"}`,borderRadius:4,background:pdpaConsent?"#16a34a":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}>
              {pdpaConsent&&<svg width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span style={{fontSize:12.5,color:"#334155",lineHeight:1.6,userSelect:"none"}}>ข้าพเจ้าได้อ่านและ<strong>ยินยอมให้จัดเก็บข้อมูลส่วนบุคคล</strong>เพื่อวัตถุประสงค์ในการประเมินความเหนื่อยล้าจากการทำงานตามที่ระบุไว้ข้างต้น</span>
          </div>
        </div>

        <button
          onClick={() => { if (pdpaConsent) setPage("pre"); }}
          style={{width:"100%",padding:16,
            background:pdpaConsent?"linear-gradient(135deg,#1e3a5f,#0369a1)":"#e2e8f0",
            color:pdpaConsent?"white":"#94a3b8",
            border:"none",borderRadius:14,fontWeight:800,fontSize:16,
            cursor:pdpaConsent?"pointer":"not-allowed",
            boxShadow:pdpaConsent?"0 4px 16px rgba(3,105,161,0.4)":"none",
            transition:"all 0.2s"}}>
          {pdpaConsent ? "🚀 เริ่มการประเมิน" : "🔒 กรุณายินยอม PDPA ก่อนเริ่ม"}
        </button>
      </div>
    </div>
    <p style={{textAlign:"center",color:"#94a3b8",fontSize:11,marginTop:12}}>อ้างอิง: Kuorinka et al., Applied Ergonomics 18(3), 1987</p>
    </div>
  );

  // ===== PRE PAGE =====
  if (page==="pre") return (
    <div style={pageStyle}><div style={cardStyle}>
      <div style={{background:"linear-gradient(135deg,#1e3a5f,#0369a1)",color:"white",padding:"16px 20px",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setPage("home")} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"white",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontSize:13}}>←</button>
        <div style={{flex:1}}><div style={{fontWeight:900,fontSize:17}}>แบบสอบถามความเหนื่อยล้าจากการทำงานเบื้องต้น</div><div style={{fontSize:12,opacity:0.8}}>กรุณาตอบก่อนเริ่มการประเมิน</div></div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontSize:11,opacity:0.7}}>วันที่/เวลา</div>
          <div style={{fontSize:12,fontWeight:700}}>{info.date}</div>
        </div>
      </div>
      <div style={{padding:20}}>
        <div style={{background:"#f0f9ff",border:"1px solid #bfdbfe",borderRadius:12,padding:14,marginBottom:22}}>
          <div style={{fontWeight:700,color:"#1e3a5f",fontSize:14,marginBottom:12}}>👤 ข้อมูลผู้ถูกประเมิน</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><label style={labelStyle}>ชื่อผู้ถูกประเมิน <span style={{color:"#ef4444"}}>*</span></label>
              <input type="text" value={info.name} onChange={e=>setInfo(p=>({...p,name:e.target.value}))} onBlur={()=>handleBlur("name")}
                style={{...inputStyle,borderColor:isError("name",info.name.trim())?"#fca5a5":"#e2e8f0"}}/></div>
            <div><label style={labelStyle}>ช่วงอายุ <span style={{color:"#ef4444"}}>*</span></label>
              <select value={info.age} onChange={e=>setInfo(p=>({...p,age:e.target.value}))} onBlur={()=>handleBlur("age")}
                style={{...inputStyle,borderColor:isError("age",info.age)?"#fca5a5":"#e2e8f0"}}>
                <option value="">-- เลือกช่วงอายุ --</option>
                <option value="น้อยกว่า 35 ปี">น้อยกว่า 35 ปี</option>
                <option value="35–50 ปี">35–50 ปี</option>
                <option value="50 ปีขึ้นไป">50 ปีขึ้นไป</option>
              </select></div>
            <div><label style={labelStyle}>ส่วนงาน <span style={{color:"#ef4444"}}>*</span></label>
              <select value={info.job} onBlur={()=>handleBlur("job")}
                onChange={e=>{const job=e.target.value;const opts=divisionOptions[job]||[];setInfo(p=>({...p,job,division:opts.length===1?opts[0].value:""}));}}
                style={{...inputStyle,borderColor:isError("job",info.job)?"#fca5a5":"#e2e8f0"}}>
                <option value="">-- เลือกส่วนงาน --</option>
                <option value="ผจก.ฝ่าย">ผู้จัดการฝ่าย (ยขก.)</option>
                <option value="วบ.">ส่วนวิศวกรรมบำรุงรักษาโรงแยกก๊าซฯ ขนอม (วบ.)</option>
                <option value="ปน.">ส่วนคุณภาพ ความปลอดภัย อาชีวอนามัย และสิ่งแวดล้อม (ปน.)</option>
                <option value="ปข.">ส่วนปฏิบัติกรโรงแยกก๊าซฯ ขนอม (ปข.)</option>
              </select></div>
            <div><label style={labelStyle}>ตำแหน่ง/แผนก</label>
              {(divisionOptions[info.job]||[]).length===1
                ? <div style={{...inputStyle,color:"#475569",background:"#f1f5f9",display:"flex",alignItems:"center"}}>{divisionOptions[info.job][0].label}</div>
                : <select value={info.division} onChange={e=>setInfo(p=>({...p,division:e.target.value}))} disabled={!info.job} style={{...inputStyle,opacity:info.job?1:0.5}}>
                    <option value="">-- เลือกตำแหน่ง --</option>
                    {(divisionOptions[info.job]||[]).map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>}</div>
            <div><label style={labelStyle}>ช่วงเวลาในการทำงาน <span style={{color:"#ef4444"}}>*</span></label>
              <select value={info.shift} onChange={e=>setInfo(p=>({...p,shift:e.target.value}))} onBlur={()=>handleBlur("shift")}
                style={{...inputStyle,borderColor:isError("shift",info.shift)?"#fca5a5":"#e2e8f0"}}>
                <option value="">-- เลือกช่วงเวลาทำงาน --</option>
                <option value="ปกติ">ปกติ (08.00 - 17.00 น.)</option>
                <option value="กะ">เข้ากะ (08.00 - 20.00 น. และ 20.00 - 08.00 น.)</option>
              </select></div>
            <div><label style={labelStyle}>อายุการทำงาน (ปี) <span style={{color:"#ef4444"}}>*</span></label>
              <input type="number" min="0" max="60" value={info.workAge} placeholder="เช่น 5"
                onChange={e=>setInfo(p=>({...p,workAge:e.target.value}))} onBlur={()=>handleBlur("workAge")}
                style={{...inputStyle,borderColor:isError("workAge",info.workAge)?"#fca5a5":"#e2e8f0"}}/></div>
            <div style={{gridColumn:"1 / -1"}}><label style={labelStyle}>เพศ <span style={{color:"#ef4444"}}>*</span></label>
              <div style={{display:"flex",gap:6}}>
                {["ชาย","หญิง"].map(g=>(
                  <button key={g} type="button" onClick={()=>setInfo(p=>({...p,gender:p.gender===g?"":g}))}
                    style={{flex:1,padding:"8px 4px",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",
                      border:`2px solid ${info.gender===g?"#7c3aed":"#e2e8f0"}`,
                      background:info.gender===g?"#7c3aed":"#f8fafc",
                      color:info.gender===g?"white":"#94a3b8",transition:"all 0.15s"}}>
                    {g==="ชาย"?"♂️ ชาย":"♀️ หญิง"}
                  </button>
                ))}
              </div></div>
          </div>
          {formValidationMsg&&Object.keys(touched).length>0&&(
            <div style={{marginTop:10,padding:"8px 12px",background:"#fee2e2",border:"1px solid #fca5a5",borderRadius:8,fontSize:12,color:"#dc2626",fontWeight:600}}>⚠️ {formValidationMsg}</div>
          )}
        </div>
        <div style={{marginBottom:20,padding:"16px",background:fatigue==="yes"?"#fef2f2":fatigue==="no"?"#f0fdf4":"white",
          border:`2px solid ${fatigue==="yes"?"#fca5a5":fatigue==="no"?"#86efac":"#e2e8f0"}`,borderRadius:14,transition:"all 0.2s"}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:14}}>
            <div style={{background:"#1e3a5f",color:"white",borderRadius:"50%",width:24,height:24,minWidth:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800}}>1</div>
            <div style={{fontSize:14,fontWeight:700,color:"#1e293b",lineHeight:1.5}}>
              งานที่คุณกำลังทำอยู่นี้ <span style={{color:"#0369a1"}}>สร้างความเหนื่อยล้าทางร่างกาย</span> ให้คุณหรือไม่?
              <span style={{display:"block",fontSize:11,fontWeight:500,color:"#94a3b8",marginTop:2}}>* จำเป็นต้องตอบ</span>
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setFatigue(fatigue==="yes"?null:"yes")} style={{flex:1,padding:"12px 10px",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer",transition:"all 0.18s",outline:"none",
              border:`2.5px solid ${fatigue==="yes"?"#16a34a":"#e2e8f0"}`,background:fatigue==="yes"?"#16a34a":"#f8fafc",
              color:fatigue==="yes"?"white":"#94a3b8",boxShadow:fatigue==="yes"?"0 4px 12px rgba(22,163,74,0.3)":"none"}}>✅ ใช่</button>
            <button onClick={()=>{setFatigue(fatigue==="no"?null:"no");if(fatigue!=="no")setPainArea("");}} style={{flex:1,padding:"12px 10px",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer",transition:"all 0.18s",outline:"none",
              border:`2.5px solid ${fatigue==="no"?"#dc2626":"#e2e8f0"}`,background:fatigue==="no"?"#dc2626":"#f8fafc",
              color:fatigue==="no"?"white":"#94a3b8",boxShadow:fatigue==="no"?"0 4px 12px rgba(220,38,38,0.3)":"none"}}>❌ ไม่ใช่</button>
          </div>
        </div>
        <div style={{overflow:"hidden",maxHeight:fatigue==="yes"?"300px":"0px",opacity:fatigue==="yes"?1:0,transition:"max-height 0.35s ease,opacity 0.3s ease",marginBottom:fatigue==="yes"?20:0}}>
          <div style={{padding:"16px",background:"#fff7ed",border:"2px solid #fed7aa",borderRadius:14}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10}}>
              <div style={{background:"#ea580c",color:"white",borderRadius:"50%",width:24,height:24,minWidth:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800}}>2</div>
              <div style={{fontSize:14,fontWeight:700,color:"#1e293b",lineHeight:1.5}}>คุณคิดว่า <span style={{color:"#ea580c"}}>ส่วนใดของร่างกาย</span> ที่รู้สึกเจ็บปวดหรือไม่สบายบ้าง?
                <span style={{display:"block",fontSize:11,fontWeight:500,color:"#94a3b8",marginTop:2}}>อธิบายโดยละเอียด (ไม่บังคับ)</span></div>
            </div>
            <textarea value={painArea} onChange={e=>setPainArea(e.target.value)} rows={4}
              placeholder="เช่น ปวดไหล่ขวา จากการเอื้อมหยิบ , เมื่อยหลังส่วนล่าง จากงานยกของ, ปวดคอ ..."
              style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`2px solid ${painArea?"#ea580c":"#fed7aa"}`,
                fontSize:13,boxSizing:"border-box",background:"white",color:"#1e293b",outline:"none",resize:"vertical",
                fontFamily:"'Sarabun','Segoe UI',sans-serif",transition:"border-color 0.15s",lineHeight:1.6}}/>
            {painArea&&<div style={{fontSize:11,color:"#ea580c",marginTop:4,fontWeight:600}}>✏️ บันทึกแล้ว: {painArea.length} ตัวอักษร</div>}
          </div>
        </div>
        <button onClick={handleSubmitPre} style={{width:"100%",padding:14,
          background:(canProceed&&canGoToForm)?"linear-gradient(135deg,#1e3a5f,#0369a1)":"#e2e8f0",
          color:(canProceed&&canGoToForm)?"white":"#94a3b8",border:"none",borderRadius:12,fontWeight:700,fontSize:15,cursor:"pointer",transition:"all 0.2s",
          boxShadow:(canProceed&&canGoToForm)?"0 4px 14px rgba(3,105,161,0.35)":"none"}}>
          {!canProceed?"กรุณาตอบข้อ 1 ก่อนดำเนินการต่อ":formValidationMsg?`⚠️ ${formValidationMsg}`:"เริ่มประเมิน NMQ →"}
        </button>
      </div>
    </div>
    <p style={{textAlign:"center",color:"#64748b",fontSize:11,marginTop:12}}>อ้างอิง: Kuorinka et al., Applied Ergonomics 18(3), 1987</p>
    </div>
  );

  // ===== RESULT PAGE =====
  if (page==="result") {
    const topParts = bodyParts.filter(p=>scores[p.id]>0).sort((a,b)=>scores[b.id]-scores[a.id]);

    const highPainParts  = bodyParts.filter(p=>scores[p.id]===4);
    const medPainParts   = bodyParts.filter(p=>scores[p.id]===3);
    const showHighBanner = highPainParts.length>0 && totalScore<=49;
    const showMedBanner  = medPainParts.length>0  && totalScore<=49 && highPainParts.length===0;
    return (
      <div style={pageStyle}><div style={cardStyle}>
        <div style={{background:"linear-gradient(135deg,#1e3a5f,#0369a1)",color:"white",padding:"14px 20px",display:"flex",alignItems:"center"}}>
          <button onClick={()=>setPage("form")} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"white",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontSize:13,marginRight:8}}>←</button>
          <div style={{flex:1,textAlign:"center"}}><div style={{fontWeight:900,fontSize:17}}>📊 ดูผลการประเมิน</div></div>
          <div style={{width:48}}/>
        </div>
        <div style={{padding:20}}>
          <div style={{background:"#f8fafc",borderRadius:12,padding:14,marginBottom:16,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            {[["ชื่อ",info.name||"-"],["อายุ",info.age||"-"],["ส่วนงาน",info.job||"-"],["ตำแหน่ง/แผนก",info.division||"-"],
              ["ช่วงเวลาทำงาน",info.shift||"-"],["เพศ",info.gender||"-"],["อายุงาน",info.workAge?`${info.workAge} ปี`:"-"],
              ["วันที่/เวลา",info.date]].map(([k,v])=>(
              <div key={k}><div style={{fontSize:11,color:"#64748b"}}>{k}</div><div style={{fontWeight:700,fontSize:13}}>{v}</div></div>
            ))}
          </div>
          <div style={{background:"#f8fafc",borderRadius:12,padding:14,marginBottom:16}}>
            <div style={{fontWeight:700,color:"#1e3a5f",fontSize:13,marginBottom:10}}>📋 คำตอบแบบสอบถามเบื้องต้น</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",background:"white",borderRadius:8,border:"1px solid #e2e8f0",marginBottom:6}}>
              <span style={{fontSize:12,color:"#475569"}}>งานที่คุณทำสร้างความเหนื่อยล้าหรือไม่?</span>
              <span style={{fontSize:12,fontWeight:700,padding:"3px 12px",borderRadius:6,background:fatigue==="yes"?"#dcfce7":"#fee2e2",color:fatigue==="yes"?"#16a34a":"#dc2626"}}>{fatigue==="yes"?"ใช่":"ไม่ใช่"}</span>
            </div>
            {fatigue==="yes"&&<div style={{padding:"8px 10px",background:"white",borderRadius:8,border:"1px solid #fed7aa"}}>
              <div style={{fontSize:11,color:"#64748b",marginBottom:4}}>บริเวณที่รู้สึกเจ็บปวด/ไม่สบาย:</div>
              <div style={{fontSize:13,color:"#1e293b",fontWeight:500}}>{painArea||<span style={{color:"#94a3b8",fontStyle:"italic"}}>ไม่ได้ระบุ</span>}</div>
            </div>}
          </div>
          <div style={{background:`${riskColor}18`,border:`3px solid ${riskColor}`,borderRadius:16,padding:20,textAlign:"center",marginBottom:16}}>
            <div style={{fontSize:12,color:"#64748b"}}>ความผิดปกติของระบบกล้ามเนื้อและกระดูก</div>
            <div style={{fontSize:60,fontWeight:900,color:riskColor,lineHeight:1.1}}>{totalScore}</div>
            <div style={{fontSize:13,fontWeight:700,color:riskColor,marginBottom:6}}>{riskLabel}</div>
            <div style={{fontSize:12,color:"#94a3b8",marginBottom:8}}>จาก {maxScore} คะแนน</div>
            <div style={{background:"white",borderRadius:10,padding:"8px 16px",display:"inline-block"}}>
              <span style={{fontSize:14,color:"#475569"}}>จำนวนส่วนที่มีอาการ </span>
              <strong style={{fontSize:18,color:riskColor}}>{affected}</strong>
              <span style={{fontSize:14,color:"#94a3b8"}}>/{bodyParts.length}</span>
            </div>
          </div>
          {showHighBanner&&(
            <div style={{background:"#fff1f2",border:"2px solid #fda4af",borderRadius:12,padding:"12px 14px",marginBottom:16,display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{fontSize:22,flexShrink:0}}>🚨</div>
              <div>
                <div style={{fontWeight:800,fontSize:13,color:"#be123c",marginBottom:4}}>พบ {highPainParts.length} จุดที่มีอาการระดับ "มาก"</div>
                <div style={{fontSize:12,color:"#9f1239",lineHeight:1.7,marginBottom:6}}>แม้คะแนนรวมจะอยู่ในเกณฑ์ความเสี่ยงน้อย เนื่องจากจุดที่ไม่ปวดมีจำนวนมาก แต่ตำแหน่งที่มีอาการรุนแรง <strong>ควรได้รับการดูแลเพิ่มเติม</strong></div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {highPainParts.map(p=>(<span key={p.id} style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:6,background:"#fda4af",color:"#be123c"}}>#{p.id} {p.label}</span>))}
                </div>
              </div>
            </div>
          )}
          {showMedBanner&&(
            <div style={{background:"#fff7ed",border:"2px solid #fdba74",borderRadius:12,padding:"12px 14px",marginBottom:16,display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{fontSize:22,flexShrink:0}}>⚠️</div>
              <div>
                <div style={{fontWeight:800,fontSize:13,color:"#c2410c",marginBottom:4}}>พบ {medPainParts.length} จุดที่มีอาการระดับ "ปานกลาง"</div>
                <div style={{fontSize:12,color:"#9a3412",lineHeight:1.7,marginBottom:6}}>แม้คะแนนรวมจะอยู่ในเกณฑ์ความเสี่ยงน้อย ตำแหน่งเหล่านี้ <strong>ควรติดตามอาการ</strong> และป้องกันก่อนที่จะรุนแรงขึ้น</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {medPainParts.map(p=>(<span key={p.id} style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:6,background:"#fdba74",color:"#c2410c"}}>#{p.id} {p.label}</span>))}
                </div>
              </div>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
            {[["ซ้าย",leftTotal,leftParts.length*3,"#3b82f6"],["กลาง",centerTotal,centerParts.length*3,"#8b5cf6"],["ขวา",rightTotal,rightParts.length*3,"#ec4899"]].map(([l,v,m,c])=>(
              <div key={l} style={{background:"#f8fafc",borderRadius:12,padding:12,textAlign:"center",border:`2px solid ${c}33`}}>
                <div style={{fontSize:11,color:"#64748b"}}>ด้าน{l}</div>
                <div style={{fontSize:26,fontWeight:800,color:c}}>{v}</div>
                <div style={{fontSize:10,color:"#94a3b8"}}>/{m}</div>
              </div>
            ))}
          </div>
          {topParts.length>0?(
            <div style={{background:"#f8fafc",borderRadius:12,padding:14,marginBottom:16}}>
              <div style={{fontWeight:700,color:"#1e3a5f",marginBottom:10,fontSize:14}}>จำนวนส่วนที่มีอาการ</div>
              {topParts.map(p=>(
                <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",marginBottom:5,background:"white",borderRadius:8,border:`2px solid ${scaleColors[scores[p.id]]}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:22,height:22,borderRadius:"50%",background:"#1e3a5f",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800}}>{p.id}</div>
                    <span style={{fontSize:13}}>{p.label}</span>
                  </div>
                  <span style={{fontWeight:800,fontSize:13,color:scores[p.id]===3?"#ef4444":scores[p.id]===2?"#f97316":"#ca8a04"}}>{scaleLabels[scores[p.id]]}</span>
                </div>
              ))}
            </div>
          ):(
            <div style={{background:"#f0fdf4",border:"2px solid #86efac",borderRadius:12,padding:16,textAlign:"center",marginBottom:16,color:"#166534",fontWeight:700}}>✅ ไม่พบตำแหน่งที่มีอาการ</div>
          )}
          <button onClick={()=>setPage("advice")} style={{width:"100%",padding:14,marginBottom:12,background:"linear-gradient(135deg,#7c3aed,#6d28d9)",color:"white",border:"none",borderRadius:12,fontWeight:700,fontSize:15,cursor:"pointer",boxShadow:"0 4px 14px rgba(109,40,217,0.35)"}}>
            💡 ดูคำแนะนำเพื่อสุขภาพ
          </button>
          <button onClick={saveToGoogleSheet} disabled={isSaving} style={{display:"block",margin:"0 auto 10px auto",padding:"14px 40px",background:isSaving?"#6b7280":"linear-gradient(135deg,#16a34a,#15803d)",color:"white",border:"none",borderRadius:12,fontWeight:700,fontSize:15,cursor:isSaving?"not-allowed":"pointer",boxShadow:isSaving?"none":"0 4px 14px rgba(21,128,61,0.35)",transition:"all 0.2s"}}>
            {isSaving?"⏳ กำลังบันทึก...":"💾 บันทึกผล"}
          </button>
          <button onClick={handleReset} style={{width:"100%",padding:14,background:"linear-gradient(135deg,#1e3a5f,#0369a1)",color:"white",border:"none",borderRadius:12,fontWeight:700,fontSize:15,cursor:"pointer"}}>🔄 ประเมินใหม่</button>
        </div>
      </div>
      <p style={{textAlign:"center",color:"#64748b",fontSize:11,marginTop:12}}>อ้างอิง: Kuorinka et al., Applied Ergonomics 18(3), 1987</p>
      </div>
    );
  }

  // ===== ADVICE PAGE =====
  if (page==="advice") {
    const AD = {
      neck:     {ids:[0,1],   icon:"🦴",title:"คอ",
        posture:["จอคอมพิวเตอร์ควรอยู่ระดับสายตา ห่าง 50–70 ซม. ไม่ก้มหรือเงยคอ","หลีกเลี่ยงการก้มหน้าดูโทรศัพท์นานเกิน 15 นาทีต่อเนื่อง","พักสายตาและคอทุก 30–60 นาที"],
        stretch:["เอียงคอข้างละ 15–30 วินาที ดึงเบาๆ ด้วยมือ ไม่บิดคอ","ก้มคางชิดอก ค้างไว้ 10 วินาที ทำซ้ำ 5 ครั้ง","หมุนคอช้าๆ ซ้าย-ขวา 5 รอบ เช้า-เย็น"],
        ref:"CCOHS — Neck Stretches; OSHA Ergonomics for Computer Workstations",url:"https://www.osha.gov/etools/computer-workstations"},
      shoulder: {ids:[2,3],   icon:"💪",title:"ไหล่",
        posture:["วางแขนบนโต๊ะหรือที่พักแขน ไม่ยกไหล่ขณะพิมพ์","ไม่เอื้อมหยิบของในมุมที่ไหล่ต้องยกสูงเกิน 90 องศา","ปรับความสูงโต๊ะ-เก้าอี้ให้ข้อศอกงอ 90 องศา"],
        stretch:["ยกแขนข้ามลำตัว ดันเบาๆ ด้วยมืออีกข้าง ค้าง 20 วินาที","หมุนไหล่วนไปข้างหน้า 10 รอบ แล้วสลับข้างหลัง 10 รอบ","ประสานมือด้านหลัง ยืดหน้าอก ค้าง 15 วินาที"],
        ref:"NIOSH — Work-Related MSD Prevention; CCOHS — Shoulder Stretches",url:"https://www.cdc.gov/niosh/topics/ergonomics/default.html"},
      upperArm: {ids:[4,6],   icon:"💪",title:"แขนส่วนบน",
        posture:["ไม่ยกแขนเหนือระดับไหล่นานเกิน 2 ชั่วโมงต่อวัน","ใช้เครื่องมือช่วยยกหรือบันไดเมื่อต้องทำงานสูง"],
        stretch:["ยืดแขนเหยียดตรง หมุนข้อมือเข้า-ออก 10 ครั้ง","งอข้อศอก ดึงแขนเข้าหาไหล่ ค้าง 10 วินาที ทำสลับ"],
        ref:"OSHA — Ergonomics for the Prevention of Musculoskeletal Disorders",url:"https://www.osha.gov/ergonomics"},
      back:     {ids:[5,7],   icon:"🧍",title:"หลัง / เอว",
        posture:["นั่งหลังตรง เอนพิงพนักเก้าอี้ เข่างอ 90 องศา เท้าวางราบกับพื้น","ยกของด้วยขา ไม่ใช้หลัง โดยย่อเข่าและหลังตรง","หลีกเลี่ยงการบิดลำตัวขณะยกของ ต้องหันทั้งตัว"],
        stretch:["นอนหงาย กอดเข่าเข้าหาอก ค้าง 20–30 วินาที ทำ 3 ครั้ง","ยืดหลังแมว-วัว (Cat-Cow) ช้าๆ 10 ครั้ง เช้า-เย็น","ยืนตัวตรง มือยันเอว โก่งหลังเบาๆ ค้าง 10 วินาที"],
        ref:"OSHA — Back Safety; NIOSH Lifting Equation; BMJ Clinical Evidence — Low Back Pain",url:"https://www.osha.gov/back-disorders"},
      hip:      {ids:[8,9],   icon:"🦴",title:"สะโพก / ก้น",
        posture:["นั่งให้สะโพกชิดพนักเก้าอี้ น้ำหนักกระจายสองข้าง","สลับท่านั่ง-ยืน ทุก 45–60 นาที"],
        stretch:["ยืดกล้ามเนื้อสะโพกโดยนั่งไขว้ขา ก้มตัวเบาๆ ค้าง 20 วินาที","ลุกยืนแล้วก้าวขาหน้า ย่อเข่าหลัง ค้าง 15 วินาที สลับข้าง"],
        ref:"CCOHS — Sitting and Standing at Work",url:"https://www.ccohs.ca/oshanswers/ergonomics/sitting/sitting_overview.html"},
      elbow:    {ids:[10,11], icon:"💪",title:"ข้อศอก",
        posture:["ข้อศอกควรงอ 90 องศาขณะพิมพ์หรือใช้เครื่องมือ","หลีกเลี่ยงการวางข้อศอกบนพื้นแข็งนานๆ"],
        stretch:["เหยียดแขนตรง หงายฝ่ามือขึ้น ดึงนิ้วลงด้วยมืออีกข้าง ค้าง 15 วินาที","งอข้อศอก 90 องศา หมุนฝ่ามือเข้า-ออก 10 ครั้ง"],
        ref:"NIOSH — Elbow Disorders Prevention (cdc.gov/niosh)",url:"https://www.cdc.gov/niosh/topics/ergonomics/default.html"},
      forearm:  {ids:[12,13], icon:"💪",title:"แขนส่วนล่าง",
        posture:["ไม่บิดหมุนข้อมือขณะออกแรง","ใช้เครื่องมือที่มีด้ามจับพอดีมือ ไม่แน่นหรือหลวมเกินไป"],
        stretch:["เหยียดแขนตรง หมุนข้อมือวนช้าๆ 10 รอบแต่ละทิศ","กำมือแน่น แล้วคลายออกสุด ทำ 10 ครั้ง"],
        ref:"OSHA — Ergonomics: Forearm and Wrist",url:"https://www.osha.gov/ergonomics"},
      wrist:    {ids:[14,15], icon:"🤲",title:"ข้อมือ",
        posture:["พิมพ์งานโดยข้อมืออยู่ในแนวตรงกับปลายแขน ไม่งอ/แอ่น","ใช้ที่รองข้อมือเมื่อพักการพิมพ์ ไม่ใช้ขณะพิมพ์","เมาส์ควรอยู่ในระดับเดียวกับแป้นพิมพ์"],
        stretch:["เหยียดแขน งอข้อมือขึ้น-ลง ค้างข้างละ 15 วินาที ทำ 3 รอบ","หมุนข้อมือวนช้าๆ 10 รอบ เช้า-เย็น"],
        ref:"OSHA — Computer Workstations eTool; CCOHS — Wrist Stretches",url:"https://www.osha.gov/etools/computer-workstations"},
      hand:     {ids:[16,17], icon:"🤲",title:"มือ / นิ้ว",
        posture:["ไม่กำเครื่องมือแน่นเกินความจำเป็น","สลับมือที่ใช้งานหากเป็นไปได้"],
        stretch:["กางนิ้วออกสุด ค้าง 5 วินาที แล้วกำมือ ทำ 10 ครั้ง","ใช้นิ้วหัวแม่มือแตะนิ้วแต่ละนิ้ว ทำวนซ้ำ 5 รอบ"],
        ref:"CCOHS — Hand and Finger Stretches",url:"https://www.ccohs.ca/oshanswers/ergonomics/office/stretching.html"},
      thigh:    {ids:[18,19], icon:"🦵",title:"ต้นขา",
        posture:["ต้นขาควรขนานกับพื้น ไม่ห้อยหรือกดขอบเก้าอี้","ปรับความสูงเก้าอี้ให้เท้าวางราบพื้น"],
        stretch:["ยืนตรง งอเข่าหลัง จับข้อเท้าดึงส้นเข้าหาก้น ค้าง 20 วินาที","นั่งเหยียดขาตรง ก้มตัวเบาๆ จับปลายเท้า ค้าง 15 วินาที"],
        ref:"NIOSH — Lower Extremity MSD (cdc.gov/niosh)",url:"https://www.cdc.gov/niosh/topics/ergonomics/default.html"},
      knee:     {ids:[20,21], icon:"🦵",title:"เข่า",
        posture:["เข่างอ 90 องศาขณะนั่ง ไม่นั่งไขว้ห้างนานๆ","ใส่รองเท้าที่รองรับน้ำหนักดี","หลีกเลี่ยงการนั่งยองหรือคุกเข่านานต่อเนื่อง"],
        stretch:["นั่งบนเก้าอี้ เหยียดขาตรง ค้าง 10 วินาที สลับข้าง ทำ 10 ครั้ง","ยืนตรง งอเข่าช้าๆ ถึง 90 องศา แล้วเหยียดออก ทำ 10 ครั้ง"],
        ref:"OSHA — Knee Disorders Prevention; CCOHS — Standing at Work",url:"https://www.ccohs.ca/oshanswers/ergonomics/standing/standing_basic.html"},
      leg:      {ids:[22,23], icon:"🦵",title:"ขา (แข้ง)",
        posture:["สลับยืน-นั่งทุก 45–60 นาที","ใช้ที่รองเท้าหากยืนทำงานบนพื้นแข็งนานๆ"],
        stretch:["ยืนห่างกำแพง มือยันผนัง ก้าวขาหลัง เหยียดน่อง ค้าง 20 วินาที","หมุนข้อเท้าวน 10 รอบ สลับข้าง"],
        ref:"CCOHS — Standing at Work",url:"https://www.ccohs.ca/oshanswers/ergonomics/standing/standing_basic.html"},
      ankle:    {ids:[24,25], icon:"🦶",title:"ข้อเท้า",
        posture:["ใส่รองเท้าที่รองรับอุ้งเท้าดี ไม่สูงเกิน 3 ซม.","ไม่ยืนนานเกิน 2 ชั่วโมงต่อเนื่อง"],
        stretch:["หมุนข้อเท้าวนซ้าย-ขวา 10 รอบ เช้า-เย็น","ยืนบนปลายเท้า ค้าง 5 วินาที แล้ววางส้นลง ทำ 10 ครั้ง"],
        ref:"NIOSH — Lower Extremity Disorders (cdc.gov/niosh)",url:"https://www.cdc.gov/niosh/topics/ergonomics/default.html"},
      foot:     {ids:[26,27], icon:"🦶",title:"เท้า",
        posture:["ใช้แผ่นรองพื้นเมื่อยืนทำงานบนพื้นแข็ง","เปลี่ยนท่าทางเท้าบ่อยๆ ไม่ยืนนิ่งนานๆ"],
        stretch:["นั่งวางเท้าบนลูกบอลเล็ก กลิ้งไปมาใต้ฝ่าเท้า 1 นาที","กระดกเท้าขึ้น-ลง 15 ครั้ง ทำสลับเท้า"],
        ref:"CCOHS — Footwear at Work",url:"https://www.ccohs.ca/oshanswers/ergonomics/standing/standing_basic.html"},
    };
    const activeGroups = Object.keys(AD).filter(k=>AD[k].ids.some(id=>scores[id]>0));
    const dot = (c) => <div style={{width:6,height:6,borderRadius:"50%",background:c,marginTop:6,flexShrink:0}}/>;
    return (
      <div style={pageStyle}><div style={cardStyle}>
        <div style={{background:"linear-gradient(135deg,#7c3aed,#6d28d9)",color:"white",padding:"14px 20px",display:"flex",alignItems:"center"}}>
          <button onClick={()=>setPage("result")} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"white",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontSize:13,marginRight:8}}>←</button>
          <div style={{flex:1,textAlign:"center"}}><div style={{fontWeight:900,fontSize:17}}>💡 คำแนะนำเพื่อสุขภาพ</div><div style={{fontSize:12,opacity:0.8}}>อ้างอิง NIOSH · OSHA · CCOHS</div></div>
          <div style={{width:48}}/>
        </div>
        <div style={{padding:20}}>
          <div style={{background:"#f0fdf4",border:"2px solid #86efac",borderRadius:12,padding:14,marginBottom:16}}>
            <div style={{fontWeight:700,color:"#166534",fontSize:13,marginBottom:8}}>✅ คำแนะนำทั่วไป (ทุกส่วนของร่างกาย)</div>
            {["พักระหว่างการทำงานทุก 30–60 นาที ลุกยืดเส้นยืดสาย 5 นาที","ดื่มน้ำให้เพียงพออย่างน้อย 8 แก้ว/วัน","รักษาท่าทางที่ถูกต้องตลอดการทำงาน","หากมีอาการเจ็บปวดต่อเนื่องเกิน 2 สัปดาห์ ควรพบแพทย์"].map((t,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:5,alignItems:"flex-start"}}>{dot("#16a34a")}<span style={{fontSize:12.5,color:"#166534",lineHeight:1.6}}>{t}</span></div>
            ))}
          </div>
          {activeGroups.length===0
            ? <div style={{background:"#f0fdf4",border:"2px solid #86efac",borderRadius:12,padding:16,textAlign:"center",color:"#166534",fontWeight:700}}>✅ ไม่พบตำแหน่งที่มีอาการ ดูแลสุขภาพต่อไปนะครับ!</div>
            : <>
              <div style={{fontWeight:700,color:"#1e3a5f",fontSize:13,marginBottom:10}}>⚠️ คำแนะนำตามส่วนที่มีอาการ</div>
              {activeGroups.map(k=>{
                const g=AD[k]; const maxSc=Math.max(...g.ids.map(id=>scores[id]));
                const sc=maxSc===4?"#dc2626":maxSc===3?"#f97316":"#ca8a04";
                const bg=maxSc===4?"#fee2e2":maxSc===3?"#ffedd5":"#fefce8";
                const lb=maxSc===4?"มาก":maxSc===3?"ปานกลาง":"น้อย";
                return (
                  <div key={k} style={{marginBottom:10,border:"1.5px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"white"}}>
                      <span style={{fontSize:20}}>{g.icon}</span>
                      <span style={{flex:1,fontWeight:700,fontSize:13,color:"#1e293b"}}>{g.title}</span>
                      <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:6,background:bg,color:sc}}>{lb}</span>
                    </div>
                    <div style={{padding:"12px 14px",background:"#fafcff",borderTop:"1.5px solid #e2e8f0"}}>
                      <div style={{fontWeight:700,fontSize:12,color:"#1e3a5f",marginBottom:6}}>🪑 ท่าทางที่ถูกต้อง</div>
                      {g.posture.map((t,i)=>(<div key={i} style={{display:"flex",gap:8,marginBottom:5,alignItems:"flex-start"}}>{dot("#3b82f6")}<span style={{fontSize:12,color:"#334155",lineHeight:1.6}}>{t}</span></div>))}
                      <div style={{fontWeight:700,fontSize:12,color:"#1e3a5f",margin:"10px 0 6px"}}>🧘 การยืดกล้ามเนื้อ (ทำ 3 ครั้ง/วัน)</div>
                      {g.stretch.map((t,i)=>(<div key={i} style={{display:"flex",gap:8,marginBottom:5,alignItems:"flex-start"}}>{dot("#10b981")}<span style={{fontSize:12,color:"#334155",lineHeight:1.6}}>{t}</span></div>))}
                      <div style={{marginTop:10,padding:"8px 10px",background:"#eff6ff",borderLeft:"3px solid #3b82f6",borderRadius:"0 8px 8px 0"}}>
                        <span style={{fontSize:11,color:"#1d4ed8"}}>📚 {g.ref} </span>
                        <a href={g.url} style={{fontSize:11,color:"#2563eb"}}>🔗 ลิงก์</a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          }
          <div style={{marginTop:16,padding:"12px 14px",background:"#f8fafc",borderRadius:12,border:"1px solid #e2e8f0"}}>
            <div style={{fontWeight:700,fontSize:12,color:"#1e3a5f",marginBottom:8}}>📖 แหล่งอ้างอิงทั้งหมด</div>
            {[["NIOSH/CDC — Work-Related Musculoskeletal Disorders","https://www.cdc.gov/niosh/topics/ergonomics/default.html"],
              ["OSHA — Ergonomics","https://www.osha.gov/ergonomics"],
              ["CCOHS — Stretching at the Computer","https://www.ccohs.ca/oshanswers/ergonomics/office/stretching.html"],
              ["Kuorinka et al. — Nordic Musculoskeletal Questionnaire, Applied Ergonomics 18(3), 1987","https://doi.org/10.1016/0003-6870(87)90010-X"],
              ["Hush et al. — Exercise interventions for MSD, BMC Musculoskeletal Disorders, 2011","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3199282/"],
            ].map(([label,url],i)=>(
              <div key={i} style={{display:"flex",gap:6,marginBottom:5,alignItems:"flex-start"}}>
                <span style={{fontSize:11,color:"#64748b",lineHeight:1.6}}>{i+1}. {label} </span>
                <a href={url} style={{fontSize:11,color:"#2563eb",flexShrink:0}}>🔗</a>
              </div>
            ))}
          </div>
          <button onClick={saveToGoogleSheet} disabled={isSaving} style={{width:"100%",marginTop:16,padding:14,background:isSaving?"#6b7280":"linear-gradient(135deg,#16a34a,#15803d)",color:"white",border:"none",borderRadius:12,fontWeight:700,fontSize:15,cursor:isSaving?"not-allowed":"pointer",boxShadow:isSaving?"none":"0 4px 14px rgba(21,128,61,0.35)",transition:"all 0.2s"}}>
            {isSaving?"⏳ กำลังบันทึก...":"💾 บันทึกผล"}
          </button>
          <button onClick={()=>setPage("result")} style={{width:"100%",marginTop:10,padding:14,background:"linear-gradient(135deg,#1e3a5f,#0369a1)",color:"white",border:"none",borderRadius:12,fontWeight:700,fontSize:15,cursor:"pointer"}}>← กลับหน้าผลการประเมิน</button>
        </div>
      </div>
      <p style={{textAlign:"center",color:"#64748b",fontSize:11,marginTop:12}}>อ้างอิง: Kuorinka et al., Applied Ergonomics 18(3), 1987</p>
      </div>
    );
  }

  // ===== FORM PAGE =====
  return (
    <div style={pageStyle}><div style={cardStyle}>
      <div style={{background:"linear-gradient(135deg,#1e3a5f,#0369a1)",color:"white",padding:"16px 20px",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setPage("pre")} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"white",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontSize:13}}>←</button>
        <div style={{flex:1}}><div style={{fontWeight:900,fontSize:17}}>Nordic Musculoskeletal Questionnaire (NMQ)</div><div style={{fontSize:12,opacity:0.8}}>Ergonomic Assessment for GSP4</div></div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:"rgba(255,255,255,0.4)"}}/><div style={{width:24,height:2,background:"white"}}/>
          <div style={{width:10,height:10,borderRadius:"50%",background:"white"}}/><div style={{width:24,height:2,background:"rgba(255,255,255,0.4)"}}/>
          <div style={{width:10,height:10,borderRadius:"50%",background:"rgba(255,255,255,0.35)"}}/>
        </div>
      </div>
      <div style={{padding:20}}>
        <div style={{background:"#ffffff",border:"1px solid #000000",borderRadius:1,padding:"10px 14px",marginBottom:12,fontSize:14,color:"#000000"}}>
          แบบประเมินตนเองเกี่ยวกับความเจ็บปวดของระบบกล้ามเนื้อและกระดูกใน <br/> 3 เดือนที่ผ่านมา
        </div>
        <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"12px 14px",marginBottom:12}}>
          <div style={{fontWeight:700,color:"#1e3a5f",fontSize:12,marginBottom:8}}>📝 เกณฑ์การให้คะแนน</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {[
              [0,"#e2e8f0","#475569","ไม่มีอาการ","ไม่รู้สึกถึงอาการเจ็บปวด ไม่มีอาการ"],
              [2,"#fef08a","#92400e","รู้สึกเจ็บปวดน้อย","รู้สึกถึงอาการเจ็บปวด"],
              [3,"#fb923c","#7c2d12","รู้สึกเจ็บปวดปานกลาง","รู้สึกเจ็บปวดจนมีผลกระทบกับการทำงาน"],
              [4,"#ef4444","#7f1d1d","รู้สึกเจ็บปวดมาก","รู้สึกเจ็บปวดมากจนทนไม่ได้ ไม่สามารถทำงานได้ ต้องพบแพทย์"],
            ].map(([v,bg,tc,label,desc])=>(
              <div key={v} style={{display:"flex",alignItems:"flex-start",gap:8}}>
                <div style={{width:13,height:13,borderRadius:"50%",background:bg,border:"1px solid #cbd5e1",flexShrink:0,marginTop:2}}/>
                <div>
                  <span style={{fontSize:12,fontWeight:700,color:tc}}>{label}</span>
                  <span style={{fontSize:11,color:"#64748b"}}> — {desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:13,color:"#1d4ed8"}}>
          👆 คลิกที่ตัวเลขบนรูปร่างกาย หรือคลิกรายการด้านล่างเพื่อให้คะแนนความเจ็บปวด
        </div>
        <div style={{position:"relative",background:"#f8fafc",borderRadius:12,padding:8,marginBottom:12}}>
          <BodyFigureSVG scores={scores} onSelect={handleSelect} selected={selected}/>
          {selected!==null&&(
            <div style={{position:"absolute",top:10,right:10,background:"white",border:"2px solid #3b82f6",borderRadius:12,padding:12,boxShadow:"0 4px 20px rgba(0,0,0,0.15)",minWidth:186,zIndex:10}}>
              <div style={{fontWeight:700,color:"#1e3a5f",fontSize:13,marginBottom:8}}>#{selected} — {bodyParts.find(p=>p.id===selected)?.label}</div>
              <ScoreButtons id={selected} scores={scores} setScore={setScore}/>
              <button onClick={()=>setSelected(null)} style={{width:"100%",marginTop:8,padding:"4px",background:"#f1f5f9",border:"none",borderRadius:6,fontSize:11,color:"#64748b",cursor:"pointer"}}>ปิด ✕</button>
            </div>
          )}
        </div>
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontWeight:700,color:"#1e3a5f",fontSize:14}}>🔵 ด้านซ้าย</span>
            <span style={{fontSize:12,color:"#64748b"}}>รวม: <strong style={{color:"#3b82f6"}}>{leftTotal}</strong>/{leftParts.length*3}</span>
          </div>
          {leftParts.map(p=><PartRow key={p.id} part={p} scores={scores} setScore={setScore} selected={selected} onSelect={handleSelect}/>)}
        </div>
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontWeight:700,color:"#1e3a5f",fontSize:14}}>🔴 ด้านขวา</span>
            <span style={{fontSize:12,color:"#64748b"}}>รวม: <strong style={{color:"#ec4899"}}>{rightTotal}</strong>/{rightParts.length*3}</span>
          </div>
          {rightParts.map(p=><PartRow key={p.id} part={p} scores={scores} setScore={setScore} selected={selected} onSelect={handleSelect}/>)}
        </div>
        <div style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontWeight:700,color:"#1e3a5f",fontSize:14}}>🟣 แนวกลาง</span>
            <span style={{fontSize:12,color:"#64748b"}}>รวม: <strong style={{color:"#8b5cf6"}}>{centerTotal}</strong>/{centerParts.length*3}</span>
          </div>
          {centerParts.map(p=><PartRow key={p.id} part={p} scores={scores} setScore={setScore} selected={selected} onSelect={handleSelect}/>)}
        </div>
        <div style={{background:"#f8fafc",borderRadius:12,padding:14,marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:12,color:"#64748b"}}>คะแนนรวม</div>
            <div style={{fontSize:30,fontWeight:900,color:riskColor}}>{totalScore}<span style={{fontSize:13,color:"#94a3b8"}}>/{maxScore}</span></div>
            <div style={{fontSize:12,fontWeight:700,color:riskColor,marginTop:2}}>{riskLabel}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:12,color:"#64748b"}}>จำนวนส่วนที่มีอาการ</div>
            <div style={{fontSize:30,fontWeight:900,color:riskColor}}>{affected}<span style={{fontSize:13,color:"#94a3b8"}}>/{bodyParts.length}</span></div>
          </div>
        </div>
        <button onClick={()=>setPage("result")} style={{width:"100%",padding:14,background:"linear-gradient(135deg,#1e3a5f,#0369a1)",color:"white",border:"none",borderRadius:12,fontWeight:700,fontSize:15,cursor:"pointer"}}>
          ดูผลการประเมิน 📊
        </button>
      </div>
    </div>
    <p style={{textAlign:"center",color:"#64748b",fontSize:11,marginTop:12}}>อ้างอิง: Kuorinka et al., Applied Ergonomics 18(3), 1987</p>
    </div>
  );
}

const pageStyle = { minHeight:"100vh", background:"linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0369a1 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", padding:20, fontFamily:"'Sarabun','Segoe UI',sans-serif" };
const cardStyle = { width:"100%", maxWidth:520, background:"white", borderRadius:20, overflow:"hidden", boxShadow:"0 25px 50px rgba(0,0,0,0.4)" };
const inputStyle = { width:"100%", padding:"8px 10px", borderRadius:8, border:"2px solid #e2e8f0", fontSize:13, boxSizing:"border-box", background:"#f8fafc", color:"#1e293b", outline:"none" };
const labelStyle = { display:"block", fontSize:12, fontWeight:600, color:"#475569", marginBottom:4 };