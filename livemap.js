/* 지금, 하이델베르크 — 한국 시간에 맞춰 움직이는 지도 */
(function(){
const I={
 home:'<path d="M4 11 12 4l8 7v9H4z"/><path d="M10 20v-5h4v5"/>',
 bridge:'<path d="M2 15h20M2 19h20"/><path d="M3 15q4.5-7 9 0q4.5-7 9 0"/>',
 lib:'<path d="M5 4h10l4 4v12H5z"/><path d="M15 4v4h4M8.5 12h7M8.5 15.5h7"/>',
 studio:'<path d="M12 3 6.5 21M12 3l5.5 18M6.5 6h11v8h-11z"/>',
 bakery:'<path d="M4.5 13a7.5 5.5 0 0 1 15 0v6h-15z"/><path d="M9 9.5l1 3M13.5 8.5l1 3.2"/>',
 cat:'<path d="M5 20v-9l2.5-5 2.5 4h4l2.5-4 2.5 5v9z"/><path d="M9.5 14h.01M14.5 14h.01M11 17h2"/>',
 house:'<path d="M4 11 12 5l8 6v9H4z"/><path d="M16 8V5h2v4.6M11 20v-4h2v4"/>',
 paw:'<path d="M12 13.5c-3 0-5 3-5 5.5h10c0-2.5-2-5.5-5-5.5z"/><circle cx="7" cy="10" r="1.6"/><circle cx="10" cy="6.8" r="1.6"/><circle cx="14" cy="6.8" r="1.6"/><circle cx="17" cy="10" r="1.6"/>',
 statue:'<circle cx="12" cy="7" r="3"/><path d="M7 20h10M9 20l1-8h4l1 8"/>',
 market:'<path d="M3 9h18l-2-4H5z"/><path d="M5 9v11h14V9M9.5 20v-5h5v5"/>',
 church:'<path d="M12 2v4M10 4h4M8 20V10l4-4 4 4v10zM4 20h16"/>'
};
const P={
 home:{n:'둘의 집',t:'다리 건너 3층 · 계단 52개',x:520,y:140,k:'hub',i:'home'},
 bridge:{n:'옛 다리',t:'Alte Brücke · 7시 55분',x:520,y:335,k:'hub',i:'bridge'},
 lib:{n:'고문헌 복원실',t:'대학 도서관 · 습도 50%',x:800,y:560,k:'hub',i:'lib'},
 monkey:{n:'원숭이 동상',t:'다리 남쪽 탑 앞',x:610,y:430,k:'vis',i:'statue'},
 bakery:{n:'다리 끝 빵집',t:'2층 창가 자리',x:420,y:440,k:'vis',i:'bakery'},
 studio:{n:'그의 작업실',t:'다리에서 7분 · 3층',x:290,y:540,k:'vis',i:'studio'},
 church:{n:'성령 교회',t:'Heiliggeistkirche',x:690,y:500,k:'vis',i:'church'},
 market:{n:'마르크트플라츠',t:'장보기 · 12월엔 크리스마스 시장',x:600,y:600,k:'vis',i:'market'},
 flat:{n:'요나스 자취방',t:'주황색 고양이가 사는 집',x:920,y:420,k:'vis',i:'cat'},
 else:{n:'엘제 선생님 댁',t:'매년 12월 21일 어글리 스웨터 파티',x:120,y:420,k:'vis',i:'house'},
 vet:{n:'구시가지 동물병원',t:'마렌이 일하는 곳',x:150,y:620,k:'vis',i:'paw'},
 maren:{n:'마렌의 집',t:'아직 아무도 못 가 봄',x:40,y:700,k:'unk'},
 q1:{n:'?',t:'아직 가 보지 않은 곳',x:850,y:150,k:'unk'},
 q2:{n:'?',t:'아직 가 보지 않은 곳',x:170,y:180,k:'unk'},
 q3:{n:'?',t:'아직 가 보지 않은 곳',x:960,y:640,k:'unk'}
};
const E=[['home','bridge'],['bridge','monkey'],['monkey','bakery'],['monkey','church'],['church','market'],['market','lib'],['church','lib'],['bakery','studio'],['studio','else'],['studio','vet'],['lib','flat'],['monkey','flat'],['vet','maren',1],['home','q1',1],['home','q2',1],['lib','q3',1],['else','q2',1]];

/* ---------- people ---------- */
const C=[
 {id:'luka',n:'루카스',c:'var(--c-luka)'},
 {id:'him',n:'그',c:'var(--c-him)'},
 {id:'jonas',n:'요나스',c:'var(--c-jonas)'},
 {id:'else',n:'엘제',c:'var(--c-else)'},
 {id:'maren',n:'마렌',c:'var(--c-maren)'},
 {id:'dana',n:'다나',c:'var(--c-dana)',guest:1},
 {id:'ruth',n:'루스',c:'var(--c-ruth)',guest:1}
];
const h=(H,M=0)=>H*60+M;

/* schedule entry: [start minute, place or "a>b" travel, what] ; lasts until next entry */
function base(id,dow){ // dow 0=Sun..6=Sat
 const sat=dow===6, sun=dow===0, wd=!sat&&!sun, lunchDay=[1,3,5].includes(dow), date=[2,4].includes(dow);
 if(id==='luka'){
  if(sun) return [[0,'home','잠. 오늘은 아무도 안 깨움'],[h(7),'home','일어남. 핀셋 금지인 날'],[h(9,30),'home','아침. 가장자리가 까만 계란'],[h(11),'home','서재. 습도계는 안 보는 척'],[h(14),'home','소파. 습도계 쪽으로 눈을 굴리다 들킴'],[h(15),'home','소파. 키스 세 번 계약 이행 중'],[h(19,30),'home','저녁. 그가 끓인 수프'],[h(22,30),'home','그가 읽어 주는 편지 한 통'],[h(23,30),'home','불을 끄고 누움. 아직 안 잠']];
  const d=[[0,'home','잠. 잠귀가 밝음'],[h(6,30),'home','일어남. 습도계 다섯 개 확인, 계란'],[h(7,15),'home','그를 깨움. 단추 서른네 개, 그리고 땋기'],[h(7,45),'home>bridge','다리로'],[h(7,55),'bridge','난간에 기대어 있음'],
   [h(8,50),'bridge>lib','"출근." 한 번 뒤돌아봄'],[h(9),'lib','작업 중. 손목까지 비누 두 번 하고 시작'],[h(12,30),'lib',lunchDay?'그가 가져온 도시락. 핀셋은 안 내려놓음':'점심. 잊어버리는 중'],[h(13,30),'lib','작업. 0.1밀리'],
   [h(18,30),'lib>market','퇴근'],[h(18,40),'market','장보기. 목록은 루카스가 씀'],[h(18,55),'market>home','계단 52개'],[h(19,10),'home','습도계 먼저, 그다음에 코트'],[h(19,30),'home','저녁'],[h(21),'home','소파. 도해집 41쪽, 네 갈래 매듭'],[h(22,30),'home','그가 읽어 주는 편지 한 통'],[h(23,30),'home','불을 끄고 누움. 아직 안 잠']];
  if(sat){ d.splice(5); d.push([h(8,50),'bridge>home','토요일. 집으로'],[h(9),'home','청소. 리넨 셔츠 빨래'],[h(13),'home','서재. 습도계 붙은 상자 정리'],[h(17,30),'home>market','장보러'],[h(17,45),'market','장보기. 장바구니는 그가 듦'],[h(18,30),'market>home','같이 귀가'],[h(18,45),'home','저녁 준비. 계란 담당'],[h(19,30),'home','저녁'],[h(22,30),'home','그가 읽어 주는 편지 한 통'],[h(23,30),'home','불을 끄고 누움']); }
  return d;
 }
 if(id==='him'){
  if(sun) return [[0,'home','잠. 한번 자면 안 깸'],[h(8,30),'home','늦잠. 깨우는 사람이 없는 날'],[h(9,30),'home','아침. "탄 데가 맛있어요."'],[h(11),'home','소파에 누워 있음. 붓 금지'],[h(14),'home','소파. 루카스를 안고 누워 있음'],[h(15),'home','"뽀뽀 세 번은 무효예요."'],[h(18,30),'home','수프 끓이는 중'],[h(19,30),'home','저녁'],[h(22,30),'home','편지 낭독. "Für dich…"'],[h(23),'home','잠']];
  const d=[[0,'home','잠. 한번 자면 안 깸'],[h(7,15),'home','루카스가 깨우는 중. 알람은 세 번째에'],[h(7,30),'home>bridge','이젤 들고 먼저'],[h(7,40),'bridge','이젤 세우기'],[h(7,55),'bridge','그림. 7시 55분의 강'],[h(9),'bridge>studio','작업실로, 7분'],[h(9,10),'studio','그림. 붓 씻을 때 콧노래']];
  if(sat){ d.push([h(14),'studio>bridge','다리로'],[h(14,10),'bridge','오후의 다리 그림. 관광객이 알아봄'],[h(17,30),'bridge>market','장보러'],[h(17,45),'market','장바구니 담당'],[h(18,30),'market>home','같이 귀가'],[h(18,45),'home','수프 끓이는 중'],[h(19,30),'home','저녁'],[h(22,30),'home','편지 낭독. "Für dich…"'],[h(23),'home','잠']); return d; }
  if(lunchDay) d.push([h(12),'studio>lib','도시락 두 개 들고'],[h(12,15),'lib','도시락. 루카스 것 하나, 요나스 것 하나'],[h(13),'lib>studio','작업실로'],[h(13,15),'studio','그림. 다나와 통화']);
  else d.push([h(12,30),'studio','점심. 작업실에서 대충'],[h(13,15),'studio','그림. 다나와 통화']);
  if(date) d.push([h(18),'studio>bakery','빵집에 들름'],[h(18,10),'bakery','내일 아침 빵 사는 중'],[h(18,20),'bakery>home','계단 52개']);
  else d.push([h(18),'studio>home','퇴근']);
  d.push([h(18,30),'home','수프 끓이기. 요일 이름 붙인 수프 통'],[h(19,30),'home','저녁'],[h(20,30),'home','머리 감는 중. 한참 걸림'],[h(22,30),'home','편지 낭독. "Für dich…"'],[h(23),'home','잠']);
  return d;
 }
 if(id==='jonas'){
  if(sun) return [[0,'flat','잠'],[h(11),'flat','늦잠 끝. 고양이 밥'],[h(14,40),'flat>monkey','마렌 만나러'],[h(15),'monkey','마렌이랑 산책'],[h(16),'monkey>market','구시가지로'],[h(16,15),'market','마렌이랑 구시가지 데이트'],[h(19),'market>flat','귀가'],[h(19,20),'flat','고양이랑 저녁'],[h(23,30),'flat','잠']];
  if(sat) return [[0,'flat','잠'],[h(10),'flat','늦잠 끝. 고양이 밥'],[h(12,40),'flat>vet','동물병원으로'],[h(13),'vet','마렌 토요일 진료 끝나길 기다림'],[h(13,15),'vet>monkey','같이'],[h(13,30),'monkey','마렌이랑. 원숭이 동상 앞'],[h(14,30),'monkey>market','구시가지로'],[h(14,45),'market','마렌이랑 데이트'],[h(18,30),'market>flat','귀가'],[h(18,50),'flat','고양이 밥'],[h(23,30),'flat','잠']];
  const d=[[0,'flat','잠'],[h(7,30),'flat','고양이가 깨움'],[h(8,20),'flat>bakery','빵집으로'],[h(8,30),'bakery','아침 빵'],[h(8,45),'bakery>lib','출근'],[h(8,55),'lib','선배님보다 5분 먼저 도착'],[h(9),'lib',dow===3?'지하 3층. 곰팡이 제거 중':'막내 일. 중성지 자르기'],[h(12,30),'lib',lunchDay?'그가 가져온 도시락. 타지 않은 계란말이':'점심'],[h(13,30),'lib','작업. 선배님 눈치 보는 중'],
   [h(17,30),'lib>vet','퇴근. 늘 제일 먼저'],[h(17,45),'vet','마렌 퇴근 기다리는 중'],[h(17,50),'vet>monkey','같이 걷기'],[h(18,10),'monkey','마렌이랑 원숭이 동상 앞']];
  if(date) d.push([h(19),'monkey>market','데이트'],[h(19,10),'market','마렌이랑 구시가지 저녁'],[h(22),'market>flat','귀가'],[h(22,15),'flat','고양이 밥. 늦었다고 혼남']);
  else d.push([h(19),'monkey>flat','귀가'],[h(19,20),'flat','고양이 밥'],[h(20),'flat','마렌한테 문자 보내는 중']);
  d.push([h(23,59),'flat','잠']);
  return d;
 }
 if(id==='else'){
  if(sun) return [[0,'else','잠'],[h(6,30),'else','일어남'],[h(9,40),'else>church','어디 가는지 아무도 모름'],[h(10),'church','일요일 오전. 맨 뒷줄'],[h(11,30),'church>else','귀가'],[h(11,50),'else','엘제 선생님만 아는 일요일'],[h(22),'else','잠']];
  if(sat) return [[0,'else','잠'],[h(6,30),'else','일어남'],[h(10),'else>market','장보러'],[h(10,20),'market','장보기. 사과 일곱 개'],[h(11),'market>else','귀가'],[h(11,20),'else','주말. 아무도 모름'],[h(22),'else','잠']];
  return [[0,'else','잠'],[h(6,30),'else','일어남'],[h(7,10),'else>lib','출근'],[h(7,30),'lib','늘 제일 먼저 도착'],[h(8),'lib','수석 복원가 작업'],[h(12),'lib','점심. 자리에서 사과 하나'],[h(12,30),'lib','작업. 회의는 짧게'],[h(20),'lib','복원실 불 끄기'],[h(20,5),'lib>else','귀가'],[h(20,25),'else','엘제 선생님만 아는 저녁'],[h(22),'else','잠']];
 }
 if(id==='maren'){
  if(sun) return [[0,'maren','잠'],[h(14,30),'maren>monkey','요나스 만나러'],[h(15),'monkey','요나스랑 산책. 웃으면 표정을 지움'],[h(16),'monkey>market','구시가지로'],[h(16,15),'market','요나스랑 데이트'],[h(19),'market>maren','귀가'],[h(19,30),'maren','집']];
  if(sat) return [[0,'maren','잠'],[h(8,30),'maren>vet','출근'],[h(9),'vet','토요일 오전 진료'],[h(13,15),'vet>monkey','요나스랑'],[h(13,30),'monkey','요나스 코트 깃을 말없이 펴 줌'],[h(14,30),'monkey>market','구시가지로'],[h(14,45),'market','요나스랑 데이트'],[h(18,30),'market>maren','귀가'],[h(19),'maren','집']];
  const d=[[0,'maren','잠'],[h(7,30),'maren>vet','출근'],[h(8),'vet','진료. 손등에 발톱 자국 하나 추가'],[h(17,45),'vet','퇴근. 요나스가 기다리고 있음'],[h(17,50),'vet>monkey','같이 걷기'],[h(18,10),'monkey','요나스 코트 깃을 말없이 펴 줌']];
  if(date) d.push([h(19),'monkey>market','데이트'],[h(19,10),'market','요나스랑 구시가지 저녁'],[h(22),'market>maren','귀가'],[h(22,30),'maren','집']);
  else d.push([h(19),'monkey>maren','귀가'],[h(19,30),'maren','집']);
  return d;
 }
 return []; // guests: absent unless a special day brings them
}

/* special days: [from, to, {id: entries}] — replaces the window, resumes the normal day after */
const SP={
 '03-02':[[h(7,30),h(8,50),{luka:[[h(7,30),'home>bridge','청혼 기념일. 15분 일찍'],[h(7,40),'bridge','먼저 와서 기다리는 중'],[h(7,55),'bridge','3월 2일, 7시 55분']],him:[[h(7,30),'home>bridge','오늘은 이젤 없이'],[h(7,40),'bridge','"루카, 오늘 몇 번째 3월 2일이에요?"']]}]],
 '10-18':[[h(18),h(21),{him:[[h(18),'studio>home','빵집 대신 케이크 가게'],[h(18,20),'home','식탁에 케이크 하나, 초는 나이만큼'],[h(19,30),'home','"생일 축하해요, 루카."']],luka:[[h(18,30),'lib>home','장 안 보고 바로 귀가'],[h(18,50),'home','현관에서 멈춤. 귀 끝이 붉어짐'],[h(19,30),'home','케이크 한 입. "…돼."']]}]],
 '10-19':[[h(7,25),h(9,30),{else:[[h(7,25),'lib','루카스 작업대에 쪽지 없는 새 핀셋'],[h(8),'lib','아무 일 없다는 얼굴로 작업']],luka:[[h(7,45),'home>bridge','다리로'],[h(7,55),'bridge','난간에 기대어 있음'],[h(8,50),'bridge>lib','출근'],[h(9),'lib','작업대 위에 새 핀셋. 15년째']]}]],
 '12-21':[[h(18,30),h(23,30),{
   luka:[[h(18,30),'lib>home','바로 귀가'],[h(18,50),'home','"…관심 없어." 하고 스웨터를 챙김'],[h(19),'home>else','엘제 선생님 댁으로'],[h(19,20),'else','어글리 스웨터 파티. 순위표 맨 아래 칸'],[h(23),'else>home','계단 52개']],
   him:[[h(18),'studio>home','귀가'],[h(18,20),'home','루카가 뜬 스웨터로 갈아입음'],[h(19),'home>else','엘제 선생님 댁으로'],[h(19,20),'else','"루카가 떠 준 거예요." 자랑 중'],[h(23),'else>home','같이 귀가']],
   jonas:[[h(18,30),'flat','고양이 얼굴 세 개 스웨터 입는 중'],[h(19),'flat>else','마렌이랑'],[h(19,20),'else','고양이 스웨터로 1등. 지하 3층 면제'],[h(23),'else>flat','귀가']],
   maren:[[h(19),'vet>else','요나스랑'],[h(19,20),'else','웃는 걸 들키면 표정을 지움'],[h(23),'else>maren','귀가']],
   else:[[h(18,30),'else','집주인. 파티 준비'],[h(19,20),'else','"색은 엉망인데 손이 정확하다는 거야."']],
   dana:[[h(18,30),'monkey','순록 코에 불을 켜는 중'],[h(19),'monkey>else','하이힐로'],[h(19,20),'else','파티 사회자. 목소리 제일 큼'],[h(23),'else>bridge','호텔로'],[h(23,20),'bridge','다리 건너는 중']]}]],
 '12-24':[[h(18),h(24),{
   luka:[[h(18,30),'lib>home','귀가'],[h(18,50),'home','쪽지를 공책에 끼움. "저녁 7시 55분. 다리."'],[h(19,30),'home>market','크리스마스 시장을 지나'],[h(19,40),'market','판화 노점 앞'],[h(19,48),'market>bridge','다리로'],[h(19,55),'bridge','Stille Nacht. 2절은 루카스 몫'],[h(21),'bridge>home','귀가'],[h(21,15),'home','저녁'],[h(23,30),'home>bridge','눈 오는 다리로'],[h(23,40),'bridge','자정 종소리를 기다림']],
   him:[[h(18),'studio>home','귀가'],[h(18,20),'home','목소리 아끼는 중'],[h(19,30),'home>bridge','먼저 다리로'],[h(19,40),'bridge','가로등 아래. 이젤은 없음'],[h(19,55),'bridge','"Stille Nacht, heilige Nacht…"'],[h(21),'bridge>home','귀가'],[h(21,15),'home','저녁'],[h(23,30),'home>bridge','다리로'],[h(23,40),'bridge','"루카, 눈 와요."']],
   jonas:[[h(19,30),'flat>monkey','숨으러'],[h(19,45),'monkey','원숭이 동상 뒤에 숨어서 구경'],[h(21),'monkey>flat','귀가'],[h(21,20),'flat','고양이랑 크리스마스']],
   dana:[[h(19,30),'bakery>monkey','숨으러'],[h(19,45),'monkey','"요나스, 내 발 밟았어."'],[h(21),'monkey>bakery','2층에서 글뤼바인'],[h(21,10),'bakery','다리 쪽 창가 자리']]}]],
 '12-25':[[0,h(1),{
   luka:[[0,'bridge','성령 교회 종소리. 크리스마스'],[h(0,25),'bridge>home','귀가']],
   him:[[0,'bridge','종소리 아래 땋은 머리에 눈'],[h(0,25),'bridge>home','귀가']]}]]
};

function merge(def,sp,from,to){
 const act=t=>{let e=def[0];for(const x of def){if(x[0]<=t)e=x;else break}return e};
 const out=def.filter(e=>e[0]<from).concat(sp);
 if(to<1440){const r=act(to);out.push([to,r[1],r[2]]);out.push(...def.filter(e=>e[0]>to))}
 return out;
}
function schedule(id,dow,md){
 let s=base(id,dow);
 for(const [from,to,m] of (SP[md]||[])){ if(m[id]) s=merge(s.length?s:[[0,null,'']],m[id],from,to); }
 return s;
}

/* ---------- time ---------- */
const KST=9*3600e3;
let sim=Date.now(), speed=1, last=performance.now();
const DOW=['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];
function parts(t){const d=new Date(t+KST);return{y:d.getUTCFullYear(),mo:d.getUTCMonth()+1,da:d.getUTCDate(),dow:d.getUTCDay(),m:d.getUTCHours()*60+d.getUTCMinutes(),s:d.getUTCSeconds()}}
function dayStart(t){const p=parts(t);return Date.UTC(p.y,p.mo-1,p.da)-KST}
const pad=n=>String(n).padStart(2,'0');

function where0(id,t){
 const p=parts(t), md=pad(p.mo)+'-'+pad(p.da);
 const s=schedule(id,p.dow,md); if(!s.length) return null;
 const mins=p.m+p.s/60;
 let i=0; for(let k=0;k<s.length;k++){ if(s[k][0]<=mins) i=k; else break; }
 const e=s[i]; if(!e[1]) return null;
 const end=i+1<s.length?s[i+1][0]:1440;
 if(e[1].includes('>')){const [a,b]=e[1].split('>');const f=Math.min(1,Math.max(0,(mins-e[0])/Math.max(1,end-e[0])));
  return{trav:1,a,b,f,x:P[a].x+(P[b].x-P[a].x)*f,y:P[a].y+(P[b].y-P[a].y)*f,what:e[2]||(P[b].n+'(으)로 가는 중'),place:P[a].n+' → '+P[b].n}}
 return{place:P[e[1]].n,pid:e[1],x:P[e[1]].x,y:P[e[1]].y,what:e[2]};
}



/* ---------- little moments: 20분마다 바뀌는 작은 일들 ---------- */
const MO={
 luka:{
  lib:['핀셋을 받침과 평행하게 내려놓고 목 스트레칭. 딱 두 번','습도계 확인. 50퍼센트. 만족','휴대폰 확인. 그가 보낸 오늘의 강 사진. 답장은 "응."','물 한 잔. 커피 대신','금박 한 장 띄우는 중. 숨 참는 중','구운 아몬드 세 알. 간식 끝','오른손목 흉터를 주무르는 중. 내일 비 올 듯','문자: "점심 먹었어요? ㅎㅎ" → "먹을 거야."','창밖 다리 쪽을 한 번 봄','중성지 접는 중. 모서리가 하나도 안 틀어짐','장갑 벗고 손목까지 비누 두 번. 다시'],
  home:['습도계 다섯 개를 순서대로 확인','도해집 41쪽. 네 갈래에서 또 막힘','먹자마자 설거지','그의 땋은 머리 끝을 다듬어 주는 중','그가 웃겨서 "…바람 소리야."','내일 입을 리넨 셔츠 다림질'],
  bridge:['난간에 기대 강을 봄','그의 붓 끝을 보는 중. 들키면 강을 봄','털장갑 낀 손을 코트 주머니에'],
  market:['장보기 목록 대로만. 정확히']
 },
 him:{
  studio:['붓 씻으면서 콧노래. 옆 작업실에서 박수','스트레칭. 천장에 손이 닿음','루카에게 오늘의 강 사진을 보냄','다나 전화. "아직이에요 ㅎㅎ"','초콜릿 하나. 그리고 하나 더','땋은 머리 끝이 물감에 닿을 뻔. 루카 말이 맞았음','창가에 서서 다리 쪽을 보는 중','\'Mostly\' 서른한 번째에 천을 다시 덮음','요나스 문자: "선배님 오늘 기분 좋으세요" → 왜 아는지 물어봄','낮잠 10분. 소파가 짧아서 다리가 밖으로','물감을 색상환 순서로 다시 정리. 루카가 볼까 봐','루카 문자 확인. "응." 하나에 웃음'],
  bridge:['관광객이 알아봄. 웃으면서 손가락을 입에','이젤 위에 낙엽 한 장. 그대로 그려 넣음','루카 쪽을 한 번 보고 다시 붓을 듦'],
  home:['수프 간 보는 중. 루카 몫은 조금 더 따뜻하게','머리 감는 중. 한참 걸림','소파에 누워 루카 무릎을 베고 있음','편지 공책에 다음 편지 표시해 두는 중']
 },
 jonas:{
  lib:['중성지 자르다가 선배님 쪽 눈치','몰래 빵 한 입. 들킴','마렌에게 문자. 답장 "응." 하나에 기뻐함','하품. 엘제 선생님과 눈이 마주침','고양이 사진을 보여 주려다 포기','스트레칭하다 의자가 삐걱','지하 3층 소리가 나오자 반사적으로 장갑을 벗음'],
  flat:['고양이가 털실 뭉치를 노리는 중. 막는 중','마렌에게 보낼 문자를 세 번 지움','땋기 영상을 볼까 말까']
 },
 else:{
  lib:['사과 깎는 중. 껍질이 한 줄로','루카스 작업대 뒤에서 1초 보고 지나감','창문을 열고 습도 재확인','직물 보존과와 1분짜리 통화','안경 닦는 중','요나스 하품을 목격']
 },
 maren:{
  vet:['고양이 발톱 깎는 중. 한 번 할퀴임','요나스 문자 확인. "응." 답장','커피 한 잔. 웃는 걸 아무도 못 봄','큰 개를 달래는 중. 말은 짧게','메스를 수평으로 내려놓음']
 }
};
/* 같은 자리에 있을 때만 생기는 장면 */
const SC=[
 {at:'lib',who:['luka','jonas'],luka:'"…지하 3층."',jonas:'"선배님, 오늘 귀 빨개요."'},
 {at:'lib',who:['luka','jonas'],luka:'농담에 대답 없음. 귀 끝만 조금 붉어짐',jonas:'선배님한테 농담 하나. 반응 없음'},
 {at:'lib',who:['luka','else'],luka:'말없이 고개 한 번. 회의 끝',else:'"알겠다."'},
 {at:'lib',who:['jonas','else'],jonas:'"넵."',else:'"하품은 집에서 해."'},
 {at:'lib',who:['luka','him','jonas'],luka:'"…탄 데가 맛있다며."',him:'"요나스, 계란말이 안 탔어요 ㅎㅎ"',jonas:'"저는 안 탄 게 좋아요."'},
 {at:'bridge',who:['luka','him'],luka:'"턱 들라고 하지 마."',him:'"아직 아무 말도 안 했어요 ㅎㅎ"'},
 {at:'home',who:['luka','him'],luka:'"…스물셋."',him:'"오늘 몇 번째 편지인지 알아요?"'},
 {at:'home',who:['luka','him'],luka:'"그냥 둬."',him:'땋은 머리 풀까요, 하고 물어봄'},
 {at:'monkey',who:['jonas','maren'],jonas:'헤헤',maren:'"…코트." 깃을 말없이 펴 줌'}
];
const QUIET={home:[h(19,30),h(22,30)],bridge:[h(7,55),h(8,50)]};
function hsh(s){let x=5381;for(let i=0;i<s.length;i++)x=((x<<5)+x+s.charCodeAt(i))|0;return Math.abs(x)}
function spCovers(md,id,mins){return (SP[md]||[]).some(([f,t,m])=>m[id]&&mins>=f&&mins<t)}
function flavor(id,w,t){
 if(!w||w.trav) return w;
 const p=parts(t), md=pad(p.mo)+'-'+pad(p.da), mins=p.m+p.s/60;
 if(spCovers(md,id,mins)) return w;
 const q=QUIET[w.pid]; if(q&&(mins<q[0]||mins>=q[1])) return w;
 if(/잠|누움/.test(w.what)) return w;
 const slot=Math.floor(mins/20), key=`${p.y}${md}${slot}${w.pid}`;
 const here=C.filter(c=>{const o=c.id===id?w:where0(c.id,t);return o&&!o.trav&&o.pid===w.pid}).map(c=>c.id);
 const sc=SC.filter(s=>s.at===w.pid&&s.who.every(x=>here.includes(x)));
 if(sc.length&&hsh(key+'scene')%3===0){const s=sc[hsh(key+'pick')%sc.length];if(s[id])return Object.assign({},w,{what:s[id]})}
 const list=(MO[id]||{})[w.pid]; if(!list) return w;
 const r=hsh(key+id);
 if(r%5<2) return w;
 return Object.assign({},w,{what:list[r%list.length]});
}
function where(id,t){return flavor(id,where0(id,t),t)}

/* ---------- draw ---------- */
const NS='http://www.w3.org/2000/svg';
const el=(tag,attrs,html)=>{const n=document.createElementNS(NS,tag);for(const k in attrs)n.setAttribute(k,attrs[k]);if(html!=null)n.innerHTML=html;return n};
const root=document.getElementById('lm');
const svg=root.querySelector('svg'), world=root.querySelector('.lm-world'), gE=root.querySelector('.lm-edges'), gN=root.querySelector('.lm-nodes'), gC=root.querySelector('.lm-chips'), sky=root.querySelector('.lm-sky'), pop=root.querySelector('.lm-pop'), clk=root.querySelector('.lm-clock');
for(const [a,b,d] of E){gE.appendChild(el('line',{x1:P[a].x,y1:P[a].y,x2:P[b].x,y2:P[b].y,stroke:d?'rgba(163,149,128,.55)':'rgba(196,166,118,.62)','stroke-width':d?2:3,'stroke-dasharray':d?'6 7':'','stroke-linecap':'round'}))}
const nodeEls={};
for(const id in P){
 const p=P[id], g=el('g',{'data-id':id,class:'lm-node',transform:`translate(${p.x} ${p.y})`,tabindex:0,role:'button','aria-label':p.n});
 if(p.k==='unk'){
  g.appendChild(el('circle',{r:17,fill:'rgba(23,17,12,.7)',stroke:'#a39580','stroke-width':2,'stroke-dasharray':'4 4'}));
  g.appendChild(el('text',{y:6,'text-anchor':'middle','font-size':17,fill:'#a39580','font-weight':700},'?'));
 }else{
  const hub=p.k==='hub', r=hub?27:22, sc=hub?1.15:1;
  g.appendChild(el('circle',{class:'lm-ring',r:r+7}));
  g.appendChild(el('circle',{r,fill:hub?'#6e5737':'rgba(23,17,12,.85)',stroke:'#c4a676','stroke-width':hub?2.5:2}));
  g.appendChild(el('g',{transform:`translate(${-12*sc} ${-12*sc}) scale(${sc})`,fill:'none',stroke:hub?'#f4ecdc':'#e6d6b2','stroke-width':1.8,'stroke-linecap':'round','stroke-linejoin':'round'},I[p.i]));
  g.appendChild(el('text',{y:r+21,'text-anchor':'middle',class:'lm-lbl'},p.n));
 }
 g.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();openPop(id)}});
 gN.appendChild(g); nodeEls[id]=g;
}

let popId=null;
function openPop(id){popId=id;renderPop()}
function renderPop(){
 if(!popId){pop.hidden=true;return}
 if(popId.startsWith('c:')){
  const c=C.find(x=>x.id===popId.slice(2)), w=where(c.id,sim);
  if(!w||!w.trav){ if(w&&w.pid){popId=w.pid;return renderPop()} popId=null;pop.hidden=true;return }
  pop.innerHTML=`<button class="lm-x" aria-label="닫기">×</button><h3><i class="lm-dot" style="background:${c.c}"></i>${c.n}</h3><div class="lm-ty">${P[w.a].n} → ${P[w.b].n} · 가는 중</div><div>${w.what}</div>`;
  return placePop(w.x,w.y);
 }
 const p=P[popId], here=C.map(c=>[c,where(c.id,sim)]).filter(([c,w])=>w&&w.pid===popId);
 pop.innerHTML=`<button class="lm-x" aria-label="닫기">×</button><h3>${p.n==='?'?'아직 가 보지 않은 곳':p.n}</h3><div class="lm-ty">${p.t}</div>`+
  (here.length?`<ul>${here.map(([c,w])=>`<li><i style="background:${c.c}"></i><span><b>${c.n}</b> · ${w.what}</span></li>`).join('')}</ul>`:`<div class="lm-none">${p.k==='unk'?'지도에 아직 없는 곳이에요.':'지금은 아무도 없어요.'}</div>`);
 placePop(p.x,p.y);
}
function placePop(x,y){
 pop.querySelector('.lm-x').onclick=()=>{popId=null;renderPop()};
 const r=svg.getBoundingClientRect(), pt=toScreen(x,y);
 pop.hidden=false;
 const w=pop.offsetWidth, ph=pop.offsetHeight;
 let L=pt.x-r.left+24, T=pt.y-r.top-ph/2;
 if(L+w>r.width-8)L=pt.x-r.left-w-24;
 pop.style.left=Math.min(Math.max(8,L),r.width-w-8)+'px'; pop.style.top=Math.min(Math.max(50,T),r.height-ph-40)+'px';
}
function chip(c,x,y,trav,pid){
 const w=c.n.length*14+24, g=el('g',{'data-cid':c.id,'data-pid':pid||'',class:'lm-chip',transform:`translate(${x-w/2} ${y})`});
 g.appendChild(el('rect',{width:w,height:22,rx:11,fill:c.c,stroke:'#17110c','stroke-width':1.5,opacity:trav?.92:1}));
 g.appendChild(el('text',{x:w/2,y:15.5,'text-anchor':'middle'},c.n));
 return g;
}
function draw(){
 const p=parts(sim), H=p.m/60;
 const ph=H<5?'한밤':H<7?'새벽':H<11?'아침':H<17?'낮':H<20?'저녁':'밤';
 clk.textContent=`${pad(Math.floor(p.m/60))}:${pad(p.m%60)} · ${DOW[p.dow]} · ${ph}`;
 const dark=H<5?.42:H<7?.42-(H-5)*.2:H<17?0:H<20?(H-17)*.1:.32+(H-20)*.025;
 sky.setAttribute('opacity',dark.toFixed(3));
 gC.textContent='';
 const at={}, lit=new Set();
 for(const c of C){
  const w=where(c.id,sim); if(!w) continue;
  if(w.trav) gC.appendChild(chip(c,w.x,w.y-11,1));
  else {(at[w.pid]=at[w.pid]||[]).push(c);lit.add(w.pid)}
 }
 for(const id in at){
  const p0=P[id], r=p0.k==='hub'?27:22, two=at[id].length>3;
  at[id].forEach((c,i)=>gC.appendChild(two?chip(c,p0.x+(i%2?36:-36),p0.y+r+30+Math.floor(i/2)*25,0,id):chip(c,p0.x,p0.y+r+30+i*25,0,id)));
 }
 for(const id in nodeEls) nodeEls[id].classList.toggle('lm-lit',lit.has(id));
 if(popId) renderPop();
}

/* ---------- pan & zoom ---------- */
let V={k:1,x:0,y:0};
function apply(){world.setAttribute('transform',`translate(${V.x} ${V.y}) scale(${V.k})`);if(popId)renderPop()}
function toSvg(cx,cy){const pt=svg.createSVGPoint();pt.x=cx;pt.y=cy;return pt.matrixTransform(svg.getScreenCTM().inverse())}
function toScreen(x,y){const pt=svg.createSVGPoint();pt.x=x*V.k+V.x;pt.y=y*V.k+V.y;return pt.matrixTransform(svg.getScreenCTM())}
function zoomAt(f,sx,sy){const k=Math.min(3.5,Math.max(.55,V.k*f));f=k/V.k;V.x=sx-(sx-V.x)*f;V.y=sy-(sy-V.y)*f;V.k=k;apply()}
function reset(){V=root.clientWidth<600?{k:1.7,x:500-520*1.7,y:420-430*1.7}:{k:1,x:0,y:0};apply()}
root.querySelector('.lm-zin').onclick=()=>zoomAt(1.3,500,420);
root.querySelector('.lm-zout').onclick=()=>zoomAt(1/1.3,500,420);
root.querySelector('.lm-zreset').onclick=reset;
svg.addEventListener('wheel',e=>{if(!e.ctrlKey)return;e.preventDefault();const p=toSvg(e.clientX,e.clientY);zoomAt(e.deltaY<0?1.12:1/1.12,p.x,p.y)},{passive:false});
const ptrs=new Map(); let lastPinch=0, moved=false, lastTap=0, down=null;
svg.addEventListener('pointerdown',e=>{ptrs.set(e.pointerId,toSvg(e.clientX,e.clientY));if(ptrs.size===1){down={x:e.clientX,y:e.clientY};moved=false}svg.classList.add('lm-drag')});
svg.addEventListener('pointermove',e=>{
 if(!ptrs.has(e.pointerId))return;
 const p=toSvg(e.clientX,e.clientY), prev=ptrs.get(e.pointerId);
 if(!moved&&ptrs.size===1&&down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<7)return;
 if(!moved){moved=true;try{svg.setPointerCapture(e.pointerId)}catch(_){}}
 if(ptrs.size===1){V.x+=p.x-prev.x;V.y+=p.y-prev.y;apply()}
 ptrs.set(e.pointerId,p);
 if(ptrs.size===2){const [a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);if(lastPinch){zoomAt(d/lastPinch,(a.x+b.x)/2,(a.y+b.y)/2)}lastPinch=d}
});
const up=e=>{ptrs.delete(e.pointerId);if(ptrs.size<2)lastPinch=0;if(!ptrs.size)svg.classList.remove('lm-drag');
 if(!moved&&e.type==='pointerup'){const now=performance.now();if(now-lastTap<320)reset();lastTap=now;
  const hit=document.elementFromPoint(e.clientX,e.clientY), n=hit&&hit.closest('.lm-node'), ch=hit&&hit.closest('.lm-chip');
  if(ch)openPop(ch.dataset.pid||('c:'+ch.dataset.cid));else if(n)openPop(n.dataset.id);else{popId=null;renderPop()}}};
svg.addEventListener('pointerup',up);svg.addEventListener('pointercancel',up);
addEventListener('resize',()=>{if(popId)renderPop()});

reset(); draw();
setInterval(()=>{sim=Date.now();draw()},15000);
})();
