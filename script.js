const REQUIRED_HIRES = 6;

const jobs = [
  {
    id: "restaurant",
    title: "Restaurant",
    budget: 90,
    preferredDegrees: ["Culinary Arts", "Hospitality", "Business Administration"],
    neutralDegrees: ["Music", "Fine Arts", "Education", "High School Graduate", "No Degree"],
    badDegrees: ["Aerospace Engineering", "Data Science", "Physics"],
    requiredSkills: ["cooking", "customer service", "cashier", "host", "logistics"],
    immigrantBonus: true,
    description: `You are hiring for a busy restaurant. Hire ${REQUIRED_HIRES} workers.`
  },
  {
    id: "elementary-school",
    title: "Elementary School",
    budget: 180,
    preferredDegrees: ["Education", "Psychology", "English", "History"],
    neutralDegrees: ["Music", "Fine Arts", "Mathematics", "High School Graduate"],
    badDegrees: ["Aerospace Engineering", "Mechanical Engineering", "Computer Science", "Software Engineering"],
    requiredSkills: ["teaching", "childcare", "communication", "writing"],
    immigrantBonus: true,
    description: `You are hiring for an elementary school. Hire ${REQUIRED_HIRES} workers.`
  },
  {
    id: "big-tech",
    title: "Big Tech Company",
    budget: 300,
    preferredDegrees: ["Computer Science", "Software Engineering", "Data Science", "Information Technology"],
    neutralDegrees: ["Mathematics", "Business Administration", "Physics", "High School Graduate"],
    badDegrees: ["Music", "Fine Arts", "Culinary Arts", "History", "Education"],
    requiredSkills: ["coding", "data", "debugging", "IT support"],
    immigrantBonus: true,
    description: `You are hiring for a tech company. Hire ${REQUIRED_HIRES} workers.`
  },
  {
    id: "hospital",
    title: "Hospital",
    budget: 320,
    preferredDegrees: ["Nursing", "Biology", "Medicine", "Psychology"],
    neutralDegrees: ["Business Administration", "Mathematics", "High School Graduate"],
    badDegrees: ["Music", "Fine Arts", "Culinary Arts"],
    requiredSkills: ["caregiving", "analysis", "communication", "logistics"],
    immigrantBonus: true,
    description: `You are hiring for a hospital. Hire ${REQUIRED_HIRES} workers.`
  },
  {
    id: "logistics-warehouse",
    title: "Logistics Warehouse",
    budget: 160,
    preferredDegrees: ["Logistics", "Business Administration", "Mechanical Engineering"],
    neutralDegrees: ["Mathematics", "Physics", "High School Graduate", "No Degree"],
    badDegrees: ["Music", "Fine Arts", "Culinary Arts", "Psychology"],
    requiredSkills: ["logistics", "warehouse", "forklift", "driver"],
    immigrantBonus: true,
    description: `You are hiring for a warehouse. Hire ${REQUIRED_HIRES} workers.`
  }
];

const roundOrder = [
  "restaurant",
  "elementary-school",
  "big-tech",
  "hospital",
  "logistics-warehouse",
  "final"
];

let currentRound = 0;

const degreePool = [
  "High School Student","High School Graduate","No Degree",
  "Computer Science","Software Engineering","Data Science","Information Technology",
  "Mathematics","Business Administration","Physics","Music","Fine Arts","Culinary Arts",
  "History","Education","Psychology","Nursing","Biology","Mechanical Engineering",
  "Aerospace Engineering","Logistics"
];

const skillPool = [
  "coding","data","debugging","IT support","teaching","childcare","communication",
  "writing","cooking","customer service","cashier","host","logistics","warehouse",
  "forklift","driver","analysis","caregiving","marketing","social media"
];

const traitPool = [
  "reliable","creative","slow learner","bilingual","perfectionist",
  "disorganized","team‑player","independent"
];

const immigrantTraitPool = [
  "bilingual","high stamina","precision worker","fast learner","adaptable","team‑player"
];

let uniqueFirstNames = [
  "Maria","Jamal","Luis","Aisha","Chen","Sofia","Ahmed","Emily","Carlos","Hana",
  "Igor","Grace","Nadia","Omar","Lina","Victor","Mei","Ravi","Fatima","Jonas",
  "Elena","Marcus","Priya","Diego","Tariq","Yuna","Samir","Helena","Arjun","Mila",
  "Noah","Isabella","Ethan","Ava","Liam","Olivia","Mason","Emma","Logan","Chloe",
  "Leo","Zara","Kai","Maya","Jasper","Layla","Felix","Nora","Caleb","Ruby",
  "Soren","Amira","Kian","Selena","Dante","Amina","Hiro","Lucia","Mateo","Ivy",
  "Rowan","Elise","Kara","Silas","Reina","Tobias","Ari","Niko","Sage","Kira",
  "Jonah","Ariel","Mira","Zane","Aiden","Nova","Rosa","Elias","Khalid","Tessa",
  "Harper","Jace","Mariam","Ezra","Skye","Reed","Margo","Sana","Dahlia","Rayan"
];

const backupNames = [...uniqueFirstNames];

let currentJob = null;
let candidates = [];
let hiredIds = new Set();

const jobTitleEl = document.getElementById("job-title");
const budgetAmountEl = document.getElementById("budget-amount");
const hireCountEl = document.getElementById("hire-count");
const hireCountInlineEl = document.getElementById("hire-count-inline");
const jobDescriptionEl = document.getElementById("job-description");
const candidateListEl = document.getElementById("candidate-list");
const hiredDropzoneEl = document.getElementById("hired-dropzone");
const budgetRemainingEl = document.getElementById("budget-remaining");
const fitScoreEl = document.getElementById("fit-score");
const totalScoreEl = document.getElementById("total-score");
const resetBtn = document.getElementById("reset-btn");
const checkBtn = document.getElementById("check-btn");

function randInt(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
function randChoice(a){return a[randInt(0,a.length-1)];}

function generateName(){
  if(uniqueFirstNames.length===0) uniqueFirstNames=[...backupNames];
  const first=uniqueFirstNames.shift();
  const last=randChoice(["R.","T.","G.","K.","L.","P.","D.","S.","M.","Y.","V.","B.","H.","O.","C.","N.","Z.","Q.","J.","F."]);
  return `${first} ${last}`;
}

function pickRoundJob(){
  const id = roundOrder[currentRound];
  if(id==="final") currentJob = randChoice(jobs);
  else currentJob = jobs.find(j=>j.id===id);

  jobTitleEl.textContent = currentJob.title;
  budgetAmountEl.textContent = `$${currentJob.budget}/hr`;
  hireCountEl.textContent = REQUIRED_HIRES;
  hireCountInlineEl.textContent = REQUIRED_HIRES;
  jobDescriptionEl.textContent = currentJob.description;
}

function getBasePay(degree,skills){
  if(degree==="High School Student")return randInt(12,16);
  if(degree==="High School Graduate")return randInt(14,20);
  if(degree==="No Degree")return randInt(12,18);
  if(["Computer Science","Software Engineering","Data Science","Information Technology"].includes(degree))return randInt(40,70);
  if(["Nursing","Biology","Psychology","Medicine"].includes(degree))return randInt(35,65);
  if(["Education","History","English"].includes(degree))return randInt(22,38);
  if(skills.includes("warehouse")||skills.includes("forklift")||degree==="Logistics")return randInt(18,32);
  if(degree==="Culinary Arts"||skills.includes("cooking"))return randInt(15,24);
  if(["Music","Fine Arts"].includes(degree))return randInt(15,25);
  return randInt(18,30);
}

function adjustForImmigrant(base,imm,degree,skills){
  if(!imm)return base;
  let p=base;
  if(["Computer Science","Engineering","Medicine"].includes(degree))p-=randInt(4,10);
  if(skills.includes("communication")||skills.includes("customer service"))p-=randInt(2,5);
  p-=randInt(1,4);
  return Math.max(p,12);
}

function isRelevantForJob(c,j){
  if(j.id==="elementary-school" && ["Aerospace Engineering","Mechanical Engineering","Computer Science","Software Engineering","Data Science"].includes(c.degree))return false;
  if(j.id==="big-tech" && ["Culinary Arts","Fine Arts","Music","History","Education"].includes(c.degree))return false;
  if(j.id==="restaurant" && ["Aerospace Engineering","Physics","Computer Science","Software Engineering"].includes(c.degree))return false;
  if(j.id==="hospital" && ["Fine Arts","Music","Culinary Arts"].includes(c.degree))return false;
  if(j.id==="logistics-warehouse" && ["Music","Fine Arts","Psychology"].includes(c.degree))return false;
  return true;
}

function generateCandidates(){
  candidates=[];
  hiredIds=new Set();
  let tries=0;

  while(candidates.length<60 && tries<300){
    tries++;

    const immigrant = Math.random() < 0.45;
    const degree = immigrant
      ? randChoice(["High School Graduate","No Degree","Computer Science","Software Engineering","Data Science","Information Technology","Mechanical Engineering","Biology","Nursing","Logistics","Culinary Arts","Business Administration"])
      : randChoice(degreePool);

    const skills=[];
    for(let i=0;i<randInt(2,4);i++){
      const s=randChoice(skillPool);
      if(!skills.includes(s))skills.push(s);
    }

    let reliability = randInt(3,10);
    if(immigrant) reliability = Math.min(reliability+1,10);

    const pay = adjustForImmigrant(getBasePay(degree,skills),immigrant,degree,skills);
    const trait = immigrant ? randChoice(immigrantTraitPool) : randChoice(traitPool);

    const c = {
      id:`c${tries}`,
      name:generateName(),
      degree,
      skills,
      immigrant,
      reliability,
      pay,
      trait
    };

    if(isRelevantForJob(c,currentJob)) candidates.push(c);
  }
}

function createCandidateCard(c,inHired){
  const card=document.createElement("div");
  card.className="candidate-card";
  card.draggable=!inHired;
  card.dataset.id=c.id;

  card.innerHTML=`
    <div class="candidate-header">
      <span>${c.name}</span>
      <span class="candidate-pay">$${c.pay}/hr</span>
    </div>
    <div class="candidate-meta">
      Degree: (${c.degree}) • Reliability: ${c.reliability}/10 • Trait: ${c.trait}
    </div>
    <div class="candidate-tags">
      <span class="tag degree">${c.degree}</span>
      ${c.immigrant?`<span class="tag immigrant">Immigrant</span>`:""}
      ${c.skills.map(s=>`<span class="tag skill">${s}</span>`).join("")}
    </div>
  `;

  if(!inHired){
    card.addEventListener("dragstart",e=>{
      card.classList.add("dragging");
      e.dataTransfer.setData("text/plain",c.id);
    });
    card.addEventListener("dragend",()=>card.classList.remove("dragging"));
  }

  return card;
}

function renderCandidates(){
  candidateListEl.innerHTML="";
  candidates.forEach(c=>{
    if(!hiredIds.has(c.id)) candidateListEl.appendChild(createCandidateCard(c,false));
  });
}

function renderHired(){
  hiredDropzoneEl.innerHTML="";
  hiredDropzoneEl.classList.toggle("empty",hiredIds.size===0);
  candidates.forEach(c=>{
    if(hiredIds.has(c.id)) hiredDropzoneEl.appendChild(createCandidateCard(c,true));
  });
}

candidateListEl.addEventListener("dragover",e=>e.preventDefault());
candidateListEl.addEventListener("drop",e=>{
  const id=e.dataTransfer.getData("text/plain");
  if(!id)return;
  hiredIds.delete(id);
  renderCandidates();
  renderHired();
  updateScores();
});

hiredDropzoneEl.addEventListener("dragover",e=>e.preventDefault());
hiredDropzoneEl.addEventListener("drop",e=>{
  const id=e.dataTransfer.getData("text/plain");
  if(!id)return;
  hiredIds.add(id);
  renderCandidates();
  renderHired();
  updateScores();
});

function computeFitScore(c){
  let s=0;
  if(currentJob.preferredDegrees.includes(c.degree))s+=3;
  else if(currentJob.neutralDegrees.includes(c.degree))s+=1;
  else if(currentJob.badDegrees.includes(c.degree))s-=3;

  const matches=c.skills.filter(x=>currentJob.requiredSkills.includes(x)).length;
  if(matches>=2)s+=3;
  else if(matches===1)s+=1;
  else s-=2;

  if(c.reliability>=8)s+=2;
  else if(c.reliability<=5)s-=2;

  if(currentJob.immigrantBonus && c.immigrant)s+=1;

  return s;
}

function updateScores(){
  const hired=candidates.filter(c=>hiredIds.has(c.id));
  const totalPay=hired.reduce((a,c)=>a+c.pay,0);
  const remaining=currentJob.budget-totalPay;

  budgetRemainingEl.textContent=`$${remaining}/hr`;

  let fit=hired.reduce((a,c)=>a+computeFitScore(c),0);
  if(hired.length!==REQUIRED_HIRES) fit-=Math.abs(hired.length-REQUIRED_HIRES)*5;

  fitScoreEl.textContent=fit;

  let budgetScore = remaining>=0
    ? Math.round((remaining/currentJob.budget)*100)
    : Math.round((remaining/currentJob.budget)*50);

  totalScoreEl.textContent = fit + budgetScore;
}

checkBtn.addEventListener("click",()=>{
  const hired=candidates.filter(c=>hiredIds.has(c.id));
  if(hired.length!==REQUIRED_HIRES){
    alert(`You must hire exactly ${REQUIRED_HIRES}.`);
    return;
  }

  alert("Round complete!");
  currentRound++;
  startGame();
});

resetBtn.addEventListener("click",()=>{
  currentRound=0;
  startGame();
});

function startGame(){
  if(currentRound>=roundOrder.length){
    alert("You completed all rounds!");
    return;
  }

  alert(`Round ${currentRound+1}: ${roundOrder[currentRound].replace("-", " ")}`);
  pickRoundJob();
  generateCandidates();
  renderCandidates();
  renderHired();
  updateScores();
}

startGame();
