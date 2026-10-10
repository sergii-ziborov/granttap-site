import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
const out = new URL("../../public/blog/", import.meta.url);
await mkdir(out, { recursive: true });
const ink="#ece8e1", muted="#aaa99f", orange="#fa743c", green="#b4cf8b";
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(x,y,s,size=30,color=ink,weight=400)=>`<text x="${x}" y="${y}" fill="${color}" font-family="Helvetica,Arial,sans-serif" font-size="${size}" font-weight="${weight}">${esc(s)}</text>`;
const rect=(x,y,w,h,fill="#25292a",stroke="#424849")=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="${fill}" stroke="${stroke}"/>`;
const line=(x,y,x2,y2,color=muted)=>`<path d="M${x} ${y} L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="3"/>`;
const dot=(x,y,r,color)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
const header=(title,sub)=>text(72,81,"GRANTTAP / FIELD NOTES",21,orange,700)+text(72,153,title,50,ink,700)+text(72,202,sub,25,muted);
const footer=(label)=>line(72,806,1368,806,"#424849")+text(72,851,label,20,muted)+text(1200,851,"10 OCT 2026",18,orange);
async function save(name,content){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900" viewBox="0 0 1440 900"><rect width="1440" height="900" fill="#151a1b"/>${content}</svg>`;
 await writeFile(new URL(`granttap-research-${name}.webp`,out),await sharp(Buffer.from(svg)).webp({quality:90}).toBuffer());
}
function card(x,y,n,title,detail,color=orange){return rect(x,y,370,145)+dot(x+35,y+35,16,color)+text(x+28,y+42,n,18,"#151a1b",700)+text(x+30,y+86,title,30,ink,700)+text(x+30,y+122,detail,22,muted);}
await save('cortex-cover',header('Evidence that travels once','Source → citations → a bounded model context')+
 [0,1,2].map(i=>rect(100+i*35,310+i*40,420,280)+text(130+i*35,360+i*40,`source ${i+1}`,24,muted)+line(130+i*35,395+i*40,440+i*35,395+i*40,orange)+line(130+i*35,435+i*40,380+i*35,435+i*40)).join('')+
 line(630,505,840,505,orange)+text(680,478,'CORTEX',24,orange,700)+rect(890,325,420,335)+text(925,395,'CITED PACKET',32,ink,700)+text(925,460,'[source.0] exact evidence',23,green)+text(925,515,'[source.1] see source.0',23,muted)+text(925,570,'[source.2] see source.0',23,muted)+footer('Concept illustration · repeated evidence retains a source trail'));
await save('cortex-infographic',header('56.2% less repeated context','Controlled Engine experiment · compiler token estimates')+
 text(100,318,'THREE REPEATED READINGS',23,muted,700)+rect(100,350,1180,94,"#383c3d")+text(130,411,'12,567 candidate tokens',36,ink,700)+rect(100,478,517,94,orange,orange)+text(130,539,'5,506 delivered',36,"#151a1b",700)+
 card(100,620,'1','9 / 9 items','No evidence item omitted',green)+card(505,620,'2','325 lines','Repeated lines replaced')+card(910,620,'3','0.3% control','One reading: 4,189 → 4,176')+footer('Mechanism test on GrantTap source · not whole-session savings or provider billing'));
await save('cortex-flow',header('Budget the whole response','Coordination stays visible; packet delivery must earn its space')+
 card(90,330,'1','Scope','Task, source, visibility')+line(460,405,510,405,orange)+card(510,330,'2','Compile','Rank, cite, deduplicate')+line(880,405,930,405,orange)+card(930,330,'3','Compare','Complete serialized answer')+
 rect(270,575,900,135)+text(305,622,'SMALLER + ALL VISIBLE FACTS COVERED?',30,green,700)+text(305,667,'Yes: cited representation     Otherwise: compact facts + expand',23,muted)+footer('Algorithmic selection · no classifier model call required'));
await save('mesh-cover',header('One Task. Several Executions.','Preserve the work when the conversation changes')+
 dot(720,485,107,orange)+text(671,496,'TASK',39,"#151a1b",700)+[[-400,-70,'CODEX'],[370,-70,'CLAUDE'],[-330,210,'MAC A'],[330,210,'MAC B']].map(([dx,dy,label])=>line(720,485,720+dx,485+dy,muted)+rect(720+dx-120,485+dy-42,240,90)+text(720+dx-80,485+dy+14,label,29,ink,700)).join('')+footer('Concept illustration · provider sessions stay distinct; Task identity persists'));
await save('mesh-infographic',header('Make previous work reusable','Claims, memory and handoff carry relevant facts forward')+
 card(90,285,'1','Observe','Supported native activity')+line(460,360,510,360,orange)+card(510,285,'2','Attribute','Task + repository + source')+line(880,360,930,360,orange)+card(930,285,'3','Reuse','Compact context + capsule')+
 rect(90,490,585,230)+text(125,543,'CLAIMS',28,orange,700)+text(125,591,'Who owns this path?',30,ink,700)+text(125,642,'Checkout, owner, expiry',24,muted)+rect(720,490,585,230)+text(755,543,'MEMORY',28,green,700)+text(755,591,'What was already tried?',30,ink,700)+text(755,642,'Attempts, decisions, visibility',24,muted)+footer('Implemented mechanisms · actual avoided work depends on the Task'));
await save('mesh-flow',header('Continue without losing the trail','Handoff preserves the objective and checks the destination')+
 card(90,305,'1','Execution A','Observed work + remaining goal')+line(460,380,510,380,orange)+card(510,305,'2','Task capsule','Revision + claims + decisions')+line(880,380,930,380,orange)+card(930,305,'3','Execution B','Another model or computer')+
 rect(300,575,840,140)+text(338,625,'DESTINATION READINESS',29,green,700)+text(338,672,'Online · access · repository · conflict checks · policy',24,muted)+footer('A capsule supplies context · it does not transfer an arbitrary filesystem'));
await save('governance-cover',header('A decision before the tool runs','Policy on the computer; a decision point on the phone')+
 rect(115,345,365,240)+text(148,403,'PROPOSED TOOL',28,muted,700)+text(148,461,'Write / Shell / MCP',30,ink,700)+text(148,526,'Identified invocation',23,muted)+line(480,465,610,465,orange)+dot(740,465,120,orange)+text(675,455,'LOCAL',34,"#151a1b",700)+text(665,504,'POLICY',34,"#151a1b",700)+line(860,465,990,465,orange)+rect(995,345,325,240)+text(1030,410,'ALLOW',30,green,700)+text(1030,475,'ASK',30,orange,700)+text(1030,540,'DENY',30,ink,700)+footer('Concept illustration · supported native hooks enforce the action boundary'));
await save('governance-infographic',header('Restrictions survive a model change','Account deny retains priority; enforcement is local')+
 card(90,285,'1','Identify','Provider + invocation + scope')+line(460,360,510,360,orange)+card(510,285,'2','Evaluate','Account / Project / Task')+line(880,360,930,360,orange)+card(930,285,'3','Enforce','Supported native hook')+
 rect(130,495,1180,225)+text(170,550,'VERIFIED WITH THE ACTUAL ENGINE',27,green,700)+text(170,599,'Account deny + Project allow + Task allow → DENY',29,ink,700)+text(170,649,'Claude + Codex writes refused before execution',26,muted)+text(170,693,'Stored policy still applied after daemon restart',26,muted)+footer('Isolated test runtime · no user repository write or global approval change'));
await save('governance-flow',header('Three facts. Three different questions.','Presence, permission and observed use have separate evidence')+
 card(90,365,'1','Available','Is this capability installed?')+card(510,365,'2','Governed','May this action run here?')+card(930,365,'3','Observed','Did the invocation occur?',green)+
 text(195,646,'AVAILABLE ≠ ALLOWED ≠ USED',46,orange,700)+footer('Unknown stays unknown · a selected tool does not count as usage'));
