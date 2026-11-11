const $ = s => document.querySelector(s);
const STORAGE_KEY = "aicarmechanic.garage.v1";
let garage = [];
try { garage = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch {}
let chosenPhoto = "";

const causes = {
"Engine warning light":["Read and record stored and pending OBD-II codes with a compatible scan tool.","Check the fuel cap seal and visible intake hoses if safe to do so.","A flashing engine light can indicate a damaging misfire: stop driving and seek help."],
"Engine will not start":["Note whether the engine cranks, clicks or is completely silent.","Check battery condition and terminals for looseness or corrosion.","If it cranks normally, fuel, ignition or engine-management faults may be involved."],
"Overheating":["Stop safely and switch the engine off; allow it to cool fully.","Never remove a hot coolant cap.","When cold, check coolant level and visible leaks. Possible causes include fan, thermostat, pump or radiator faults."],
"Brake noise or vibration":["Avoid driving if braking performance is reduced.","Possible causes include worn pads, damaged discs, debris or seized components.","Have the complete braking system inspected promptly."],
"Battery / charging problem":["Check battery terminals for looseness or corrosion.","A battery and charging-system test can distinguish battery, alternator and wiring faults.","Never disconnect the battery while the engine is running."],
"Suspension knocking":["Possible causes include drop links, bushes, ball joints, top mounts or loose components.","Check tyres and visible suspension parts for damage.","Have steering and suspension joints inspected before continued use."],
"Gearbox slipping":["Avoid hard acceleration and towing.","Check for warning messages and visible fluid leaks.","Causes depend on transmission type; obtain a diagnostic scan and specialist inspection."],
"Fluid leak":["Identify the fluid and location without touching hot or hazardous components.","Check fluid levels only using the vehicle's specified procedure.","Brake-fluid leaks mean the vehicle must not be driven."]
};

const guides = [
{title:"Check engine oil level",level:"Beginner",time:"5–10 min",tools:["Clean lint-free cloth","Vehicle handbook"],steps:["Park on level ground and follow the handbook's engine-temperature instructions.","Switch off the engine and wait the specified time.","Remove and wipe the dipstick, reinsert fully, then remove again.","Confirm the level is between the minimum and maximum marks.","If low, add only the specified oil in small amounts and recheck."],warning:"Do not overfill. If the oil-pressure warning is on, stop the engine and do not continue driving."},
{title:"Inspect a tyre",level:"Beginner",time:"5 min",tools:["Tyre-pressure gauge","Tread-depth gauge"],steps:["Check each tyre when cold where possible.","Look for cuts, bulges, exposed cords and embedded objects.","Measure pressure against the vehicle placard or handbook.","Measure tread across the main grooves and check the full circumference.","Use a tyre professional if damage or uneven wear is found."],warning:"Do not drive on a bulging, cord-exposed or rapidly deflating tyre."},
{title:"Read an OBD-II fault code",level:"Intermediate",time:"10–20 min",tools:["Compatible OBD-II scan tool","Vehicle handbook"],steps:["Locate the diagnostic connector using the handbook.","Connect the scan tool as instructed by its manufacturer.","Record stored, pending and freeze-frame codes before clearing anything.","Look up the exact code alongside vehicle-specific service information.","Repair and retest; a code identifies a condition or circuit, not automatically a failed part."],warning:"Do not clear codes before recording them. Some faults need professional diagnostic equipment."},
{title:"Safe pre-drive visual check",level:"Beginner",time:"5–10 min",tools:["Tyre pressure gauge","Torch"],steps:["Check tyres for visible damage and correct pressures.","Check lights, mirrors, windows and wipers.","Look underneath for fresh fluid leaks without crawling under the vehicle.","Check that warning lights behave as described in the handbook.","Investigate any new noise, smell or warning before driving."],warning:"Never get underneath a vehicle supported only by a jack."}
];

function saveGarage(){localStorage.setItem(STORAGE_KEY,JSON.stringify(garage));renderGarage();}
function renderGarage(){
 const host=$("#garage-list"); host.innerHTML="";
 if(!garage.length){host.innerHTML='<div class="panel muted">No vehicles saved yet. Add one from the Identify tab.</div>';return;}
 garage.forEach(v=>{
  const card=document.createElement("article");card.className="vehicle-card";
  const title=document.createElement("h3");title.textContent=[v.year,v.make,v.model].filter(Boolean).join(" ")||"Vehicle";
  const del=document.createElement("button");del.className="delete";del.textContent="Delete";del.onclick=()=>{garage=garage.filter(x=>x.id!==v.id);saveGarage();};
  card.append(del,title);
  [v.engine,v.vin?"VIN / registration: "+v.vin:"",v.notes].filter(Boolean).forEach(t=>{const p=document.createElement("p");p.textContent=t;card.append(p);});
  host.append(card);
 });
}
function renderGuides(){
 const host=$("#guides");host.innerHTML="";
 guides.forEach(g=>{
  const card=document.createElement("article");card.className="guide";
  const btn=document.createElement("button");btn.innerHTML=`<h3>${g.title}</h3><span class="meta">${g.level} · ${g.time} · Tap to open</span>`;
  const detail=document.createElement("div");detail.className="guide-detail";
  const tools=document.createElement("p");tools.innerHTML="<strong>Tools:</strong> "+g.tools.join(", ");
  const ol=document.createElement("ol");g.steps.forEach(s=>{const li=document.createElement("li");li.textContent=s;ol.append(li);});
  const warning=document.createElement("p");warning.innerHTML="<strong>Safety:</strong> ";warning.append(document.createTextNode(g.warning));
  detail.append(tools,ol,warning);btn.onclick=()=>card.classList.toggle("open");card.append(btn,detail);host.append(card);
 });
}
document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{
 document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b===btn));
 document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===btn.dataset.page));
}));
$("#vehicle-form").addEventListener("submit",e=>{
 e.preventDefault();
 const v={id:crypto.randomUUID(),make:$("#make").value.trim(),model:$("#model").value.trim(),year:$("#year").value.trim(),engine:$("#engine").value.trim(),vin:$("#vin").value.trim(),notes:$("#notes").value.trim()};
 if(!v.make&&!v.model){alert("Please enter at least a make or model.");return;}
 garage.unshift(v);saveGarage();e.target.reset();alert("Vehicle saved on this device.");document.querySelector('[data-page="garage"]').click();
});
$("#photo").addEventListener("change",e=>{
 const f=e.target.files[0];if(!f)return;
 const reader=new FileReader();reader.onload=()=>{$("#preview").src=reader.result;$("#preview").classList.remove("hidden");};reader.readAsDataURL(f);
});
$("#diagnose-btn").onclick=()=>{
 const s=$("#symptom").value, host=$("#diagnosis");host.innerHTML="";
 const card=document.createElement("article");card.className="result-card";
 const h=document.createElement("h3");h.textContent="Possible causes: "+s;
 const p=document.createElement("p");p.className="meta";p.textContent="General first checks only — not a confirmed diagnosis.";
 const ul=document.createElement("ul");(causes[s]||[]).forEach(x=>{const li=document.createElement("li");li.textContent=x;li.style.margin="9px 0";ul.append(li);});
 const note=document.createElement("p");note.className="small muted";note.textContent="Your notes: "+($("#symptom-detail").value||"None added");
 card.append(h,p,ul,note);host.append(card);
};
function updateConnection(){const el=$("#connection");el.textContent=navigator.onLine?"● Online":"● Offline ready";el.style.color=navigator.onLine?"#8de0ad":"#ffd08b";}
window.addEventListener("online",updateConnection);window.addEventListener("offline",updateConnection);
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}
updateConnection();renderGarage();renderGuides();