const $ = s => document.querySelector(s);
const STORAGE_KEY = "aicarmechanic.garage.v1";
const SELECTED_VEHICLE_KEY = "aicarmechanic.repairVehicle.v1";
// Set this to your deployed Cloudflare Worker URL in config.js.
const REPAIR_API_URL = window.REPAIR_API_URL || "";
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

function saveGarage(){
 localStorage.setItem(STORAGE_KEY,JSON.stringify(garage));
 if(!garage.some(v=>v.id===localStorage.getItem(SELECTED_VEHICLE_KEY)))localStorage.removeItem(SELECTED_VEHICLE_KEY);
 renderGarage();renderRepairVehicleOptions();
}
function vehicleLabel(v){return [v.year,v.make,v.model,v.engine].filter(Boolean).join(" · ")||"Vehicle";}
function renderRepairVehicleOptions(){
 const select=$("#repair-vehicle");if(!select)return;
 const previous=localStorage.getItem(SELECTED_VEHICLE_KEY)||select.value;
 select.innerHTML="";
 const first=document.createElement("option");first.value="";first.textContent=garage.length?"Choose a vehicle…":"No vehicles in My Garage yet";select.append(first);
 garage.forEach(v=>{const o=document.createElement("option");o.value=v.id;o.textContent=vehicleLabel(v);select.append(o);});
 if(garage.some(v=>v.id===previous))select.value=previous;
}
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
function showRepairMessage(message,isError=false){
 const host=$("#repair-results");host.innerHTML="";
 const card=document.createElement("article");card.className="result-card";
 const p=document.createElement("p");p.textContent=message;if(isError)p.style.color="#ffb5aa";card.append(p);host.append(card);
}
function renderAIAnswer(answer,vehicle,question){
 const host=$("#repair-results");host.innerHTML="";
 const card=document.createElement("article");card.className="result-card";
 const h=document.createElement("h3");h.textContent="AI repair guide · "+vehicleLabel(vehicle);
 const q=document.createElement("p");q.className="meta";q.textContent="Your request: "+question;
 const body=document.createElement("div");body.className="ai-answer";
 // Render plain text safely; preserve headings, lists and paragraphs without injecting HTML.
 answer.split(/\n{2,}/).forEach(block=>{
  const trimmed=block.trim();if(!trimmed)return;
  if(/^#{1,3}\s/.test(trimmed)){const heading=document.createElement("h4");heading.textContent=trimmed.replace(/^#{1,3}\s*/,"");body.append(heading);}
  else if(trimmed.split("\n").every(line=>/^\s*(?:[-*•]|\d+[.)])\s+/.test(line))){
   const ordered=/^\s*\d+[.)]/.test(trimmed);const list=document.createElement(ordered?"ol":"ul");
   trimmed.split("\n").forEach(line=>{const li=document.createElement("li");li.textContent=line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/,"");list.append(li);});body.append(list);
  } else {const para=document.createElement("p");para.textContent=trimmed.replace(/^\*\*(.*?)\*\*$/s,"$1");body.append(para);}
 });
 card.append(h,q,body);host.append(card);
}
async function runRepairSearch(){
 const vehicleId=$("#repair-vehicle").value,question=$("#repair-query").value.trim(),button=$("#repair-search-btn");
 if(!vehicleId){alert("Please select a vehicle from My Garage first.");$("#repair-vehicle").focus();return;}
 if(!question){alert("Please describe the repair you want help with.");$("#repair-query").focus();return;}
 if(!REPAIR_API_URL){showRepairMessage("The AI service has not been connected yet. Deploy the Cloudflare Worker and add its URL to config.js, following SETUP-AI.txt.",true);return;}
 const vehicle=garage.find(v=>v.id===vehicleId);if(!vehicle){alert("That vehicle is no longer in My Garage. Please choose it again.");renderRepairVehicleOptions();return;}
 localStorage.setItem(SELECTED_VEHICLE_KEY,vehicleId);
 button.disabled=true;button.textContent="Generating your repair guide…";showRepairMessage("The AI mechanic is preparing guidance for your selected vehicle…");
 try{
  const response=await fetch(REPAIR_API_URL.replace(/\/$/,"")+"/repair",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({vehicle:{year:vehicle.year,make:vehicle.make,model:vehicle.model,engine:vehicle.engine},question})});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(data.error||"The repair service returned an error ("+response.status+").");
  if(!data.answer)throw new Error("The AI service returned an empty answer. Please try again.");
  renderAIAnswer(data.answer,vehicle,question);
 }catch(error){showRepairMessage(error.message||"Could not contact the AI repair service. Check your internet connection and try again.",true);}
 finally{button.disabled=false;button.textContent="Ask AI for a repair guide";}
}
$("#repair-vehicle").addEventListener("change",e=>{if(e.target.value)localStorage.setItem(SELECTED_VEHICLE_KEY,e.target.value);else localStorage.removeItem(SELECTED_VEHICLE_KEY);});
$("#repair-search-btn").addEventListener("click",runRepairSearch);
function updateConnection(){const el=$("#connection");el.textContent=navigator.onLine?"● Online":"● Offline ready";el.style.color=navigator.onLine?"#8de0ad":"#ffd08b";}
window.addEventListener("online",updateConnection);window.addEventListener("offline",updateConnection);
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}
updateConnection();renderGarage();renderRepairVehicleOptions();renderGuides();