/****************************************************
 * CONFIG
 ****************************************************/

const REQUIRED_HIRES = 6;
let companyName = "";
let permanentlyHired = new Set();
let currentRound = 0;
let totalImmigrantHires = 0;
let roundScores = [];
let roundStats = [];
let gameStartTime = null;
let globalCandidateId = 0;

const roundOrder = [
  "restaurant",
  "elementary-school",
  "big-tech",
  "hospital",
  "delivery-company",
  "final" // hardest: no immigrants, restaurant, higher wages
];

/****************************************************
 * INDUSTRY-SPECIFIC FACT POOLS
 ****************************************************/

const industryFacts = {
  "restaurant": [
    "Immigrants make up a large share of restaurant workers in the U.S.",
    "Many restaurants rely on immigrant workers to stay open during busy seasons.",
    "Immigrant cooks and servers often fill roles that are hard to staff.",
    "Food service is one of the industries most reliant on immigrant labor.",
    "Immigrant workers help keep restaurants running in many cities and towns."
  ],
  "elementary-school": [
    "Immigrant educators help fill teacher shortages in some districts.",
    "Bilingual teachers, including immigrants, support multilingual classrooms.",
    "Immigrant staff often work in support roles that keep schools running.",
    "Growing immigrant communities can help keep schools from closing.",
    "Some school districts recruit teachers from abroad to fill open positions."
  ],
  "big-tech": [
    "Immigrants are heavily represented in software engineering and data science.",
    "Many tech companies rely on immigrant workers for specialized skills.",
    "Immigrant-founded tech companies employ large numbers of workers.",
    "Immigrants make up a significant share of advanced STEM degree holders.",
    "High-skill visas often bring tech workers into the U.S. labor market."
  ],
  "hospital": [
    "Immigrant doctors and nurses help address healthcare worker shortages.",
    "Many hospitals rely on immigrant staff for patient care.",
    "Immigrant health workers often serve in underserved communities.",
    "Some rural hospitals depend on immigrant physicians to stay open.",
    "Immigrant nurses and aides support long-term care facilities."
  ],
  "delivery-company": [
    "Immigrant workers are common in delivery and transportation jobs.",
    "Many delivery routes are staffed by immigrant drivers.",
    "Immigrant workers help keep goods moving through cities.",
    "Transportation and delivery jobs often rely on immigrant labor.",
    "Immigrant workers support the logistics behind online shopping."
  ],
  "final": [
    "When immigrant workers are unavailable, staffing gaps become harder to fill.",
    "Labor shortages can worsen quickly if immigrant workers are removed.",
    "Immigrant workers often fill roles that would otherwise stay vacant.",
    "Policy changes can suddenly reduce access to immigrant labor.",
    "Industries that rely on immigrants can struggle when that labor disappears."
  ]
};

/****************************************************
 * JOB DEFINITIONS
 ****************************************************/

const jobs = [
  {
    id: "restaurant",
    title: "Restaurant",
    budget: 140,
    preferredDegrees: ["Culinary Arts", "Hospitality", "Business Administration"],
    neutralDegrees: ["Music", "Fine Arts", "Education", "High School Graduate", "No Degree"],
    badDegrees: ["Aerospace Engineering", "Data Science", "Physics"],
    requiredSkills: ["cooking", "customer service", "cashier", "host", "logistics"],
    immigrantBonus: true,
    description: `You are hiring for COMPANY_NAME. Hire ${REQUIRED_HIRES} workers.`
  },
  {
    id: "elementary-school",
    title: "Elementary School",
    budget: 180,
    preferredDegrees: ["Education", "Psychology", "English", "History", "Music"],
    neutralDegrees: ["Fine Arts", "Mathematics", "High School Graduate"],
    badDegrees: ["Aerospace Engineering", "Mechanical Engineering", "Computer Science", "Software Engineering"],
    requiredSkills: ["teaching", "childcare", "communication", "writing"],
    immigrantBonus: true,
    description: `You are hiring for COMPANY_NAME. Hire ${REQUIRED_HIRES} workers.`
  },
  {
    id: "big-tech",
    title: "Tech Company",
    budget: 300,
    preferredDegrees: ["Computer Science", "Software Engineering", "Data Science", "Information Technology", "Mechanical Engineering"],
    neutralDegrees: ["Mathematics", "Business Administration", "Physics", "High School Graduate"],
    badDegrees: ["Music", "Fine Arts", "Culinary Arts", "History", "Education"],
    requiredSkills: ["coding", "data", "debugging", "IT support"],
    immigrantBonus: true,
    description: `You are hiring for COMPANY_NAME. Hire ${REQUIRED_HIRES} workers.`
  },
  {
    id: "hospital",
    title: "Hospital",
    budget: 320,
    preferredDegrees: ["Nursing", "Biology", "Medicine", "Doctor", "Psychology"],
    neutralDegrees: ["Business Administration", "Mathematics"],
    badDegrees: ["Music", "Fine Arts", "Culinary Arts", "No Degree", "High School Graduate", "High School Student"],
    requiredSkills: ["caregiving", "analysis", "communication", "logistics"],
    immigrantBonus: true,
    description: `You are hiring for COMPANY_NAME. Hire ${REQUIRED_HIRES} workers.`
  },
  {
    id: "delivery-company",
    title: "Delivery Company",
    budget: 160,
    preferredDegrees: ["Logistics", "Business Administration", "Mechanical Engineering"],
    neutralDegrees: ["Mathematics", "Physics", "High School Graduate", "No Degree"],
    badDegrees: ["Music", "Fine Arts", "Culinary Arts", "Psychology"],
    requiredSkills: ["logistics", "driver", "warehouse", "communication"],
    immigrantBonus: true,
    description: `You are hiring for COMPANY_NAME. Hire ${REQUIRED_HIRES} workers.`
  }
];

/****************************************************
 * POOLS
 ****************************************************/

const degreePool = [
  "High School Student","High School Graduate","No Degree",
  "Computer Science","Software Engineering","Data Science","Information Technology",
  "Mathematics","Business Administration","Physics","Music","Fine Arts","Culinary Arts",
  "History","Education","Psychology","Nursing","Biology","Mechanical Engineering",
  "Aerospace Engineering","Logistics","Medicine","Doctor"
];

const skillPool = [
  "coding","data","debugging","IT support","teaching","childcare","communication",
  "writing","cooking","customer service","cashier","host","logistics","warehouse",
  "driver","analysis","caregiving","marketing","social media"
];

const goodTraits = [
  "reliable","creative","bilingual","perfectionist","team‑player","adaptable","fast learner","precision worker"
];

const badTraits = [
  "slow learner","disorganized","impatient","easily distracted","inflexible"
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

/****************************************************
 * DOM
 ****************************************************/

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

/****************************************************
 * UTILS
 ****************************************************/

function randInt(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
function randChoice(a){return a[randInt(0,a.length-1)];}

function generateName(){
  if(uniqueFirstNames.length===0) uniqueFirstNames=[...backupNames];
  const first=uniqueFirstNames.shift();
  const last=randChoice(["R.","T.","G.","K.","L.","P.","D.","S.","M.","Y.","V.","B.","H.","O.","C.","N.","Z.","Q.","J.","F."]);
  return `${first} ${last}`;
}

/****************************************************
 * STATE
 ****************************************************/

let currentJob = null;
let candidates = [];
let hiredIds = new Set();

/****************************************************
 * PAY + RELEVANCE
 ****************************************************/

function getBasePay(degree,skills){
  if(degree==="High School Student")return randInt(12,16);
  if(degree==="High School Graduate")return randInt(14,20);
  if(degree==="No Degree")return randInt(12,18);
  if(["Computer Science","Software Engineering","Data Science","Information Technology"].includes(degree))return randInt(40,70);
  if(["Nursing","Biology","Psychology","Medicine","Doctor"].includes(degree))return randInt(35,65);
  if(["Education","History","English","Music"].includes(degree))return randInt(22,38);
  if(skills.includes("warehouse")||degree==="Logistics")return randInt(18,32);
  if(degree==="Culinary Arts"||skills.includes("cooking"))return randInt(15,24);
  if(["Music","Fine Arts"].includes(degree))return randInt(15,25);
  return randInt(18,30);
}

function adjustForImmigrant(base,imm){
  if(!imm)return base;
  return Math.max(base - randInt(1,4), 12);
}

function isRelevantForJob(c,j){
  if(j.id==="elementary-school" && ["Aerospace Engineering","Mechanical Engineering","Computer Science","Software Engineering","Data Science"].includes(c.degree))return false;
  if(j.id==="big-tech" && ["Culinary Arts","Fine Arts","Music","History","Education"].includes(c.degree))return false;
  if(j.id==="restaurant" && ["Aerospace Engineering","Physics","Computer Science","Software Engineering","Doctor","Medicine","Nursing"].includes(c.degree))return false;
  if(j.id==="hospital" && ["Fine Arts","Music","Culinary Arts"].includes(c.degree))return false;
  if(j.id==="delivery-company" && ["Music","Fine Arts","Psychology"].includes(c.degree))return false;
  return true;
}

/****************************************************
 * CANDIDATE GENERATION
 ****************************************************/

function generateCandidates(){
  candidates=[];
  hiredIds=new Set();
  let tries=0;

  const immigrantsAllowed = roundOrder[currentRound] !== "final";

  while(candidates.length<50 && tries<400){
    tries++;

    const immigrant = immigrantsAllowed && Math.random() < 0.45;

    let degree;
    if(currentJob.id === "elementary-school"){
      degree = immigrant
        ? randChoice(["Education","Psychology","English","History","Music","High School Graduate"])
        : randChoice(["Education","Psychology","English","History","Music","Fine Arts","High School Graduate"]);
    } else if(currentJob.id === "hospital"){
      degree = immigrant
        ? randChoice(["Nursing","Biology","Medicine","Doctor","Psychology"])
        : randChoice(["Nursing","Biology","Medicine","Doctor","Psychology","Business Administration"]);
    } else if(currentJob.id === "delivery-company"){
      degree = immigrant
        ? randChoice(["Logistics","Business Administration","Mechanical Engineering","High School Graduate","No Degree"])
        : randChoice(["Logistics","Business Administration","Mechanical Engineering","High School Graduate","No Degree","Mathematics"]);
    } else if(currentJob.id === "restaurant"){
      degree = immigrant
        ? randChoice(["Culinary Arts","Hospitality","Business Administration","High School Graduate","No Degree"])
        : randChoice(["Culinary Arts","Hospitality","Business Administration","High School Graduate","No Degree","Fine Arts"]);
    } else if(currentJob.id === "big-tech"){
      degree = immigrant
        ? randChoice(["Computer Science","Software Engineering","Data Science","Information Technology","Mathematics"])
        : randChoice(["Computer Science","Software Engineering","Data Science","Information Technology","Mathematics","Mechanical Engineering"]);
    } else {
      degree = immigrant
        ? randChoice(["High School Graduate","No Degree","Computer Science","Software Engineering","Data Science","Information Technology","Mechanical Engineering","Biology","Nursing","Logistics","Culinary Arts","Business Administration"])
        : randChoice(degreePool);
    }

    const skills=[];
    const skillCount = randInt(2,4);
    for(let i=0;i<skillCount;i++){
      let s;
      if(currentJob.id==="elementary-school"){
        s = randChoice(["teaching","childcare","communication","writing","communication","teaching"]);
      } else if(currentJob.id==="hospital"){
        s = randChoice(["caregiving","analysis","communication","logistics","caregiving"]);
      } else if(currentJob.id==="delivery-company"){
        s = randChoice(["logistics","driver","warehouse","communication"]);
      } else if(currentJob.id==="restaurant"){
        s = randChoice(["cooking","customer service","cashier","host","logistics"]);
      } else if(currentJob.id==="big-tech"){
        s = randChoice(["coding","data","debugging","IT support","communication"]);
      } else {
        s = randChoice(skillPool);
      }
      if(!skills.includes(s))skills.push(s);
    }

    let reliability = randInt(3,10);
    if(immigrant) reliability = Math.min(reliability+1,10);

    let pay = adjustForImmigrant(getBasePay(degree,skills),immigrant);

    // Final round: wages higher due to shortage
    if(roundOrder[currentRound] === "final"){
      pay = Math.round(pay * 1.5);
    }

    const goodTrait = randChoice(goodTraits);
    let badTrait = randChoice(badTraits);
    if(badTrait === goodTrait){
      badTrait = randChoice(badTraits);
    }

    const c = {
      id:`c${globalCandidateId++}`,
      name:generateName(),
      degree,
      skills,
      immigrant,
      reliability,
      pay,
      goodTrait,
      badTrait
    };

    if(permanentlyHired.has(c.id)) continue;
    if(!isRelevantForJob(c,currentJob)) continue;

    candidates.push(c);
  }
}

/****************************************************
 * RENDERING
 ****************************************************/

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
      Degree: (${c.degree}) • Reliability: ${c.reliability}/10
    </div>
    <div class="candidate-tags">
      <span class="tag degree">${c.degree}</span>
      ${c.immigrant?`<span class="tag immigrant">Immigrant</span>`:""}
      <span class="tag good">${c.goodTrait}</span>
      <span class="tag bad">${c.badTrait}</span>
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

/****************************************************
 * DRAG & DROP
 ****************************************************/

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

/****************************************************
 * SCORING
 ****************************************************/

function computeFitScore(c){
  let s=0;

  // Degree relevance
  if(currentJob.preferredDegrees.includes(c.degree)) s+=5;
  else if(currentJob.neutralDegrees.includes(c.degree)) s+=2;
  else if(currentJob.badDegrees.includes(c.degree)) s-=5;

  // Strong penalty if degree is not preferred or neutral
  if(
    !currentJob.preferredDegrees.includes(c.degree) &&
    !currentJob.neutralDegrees.includes(c.degree)
  ){
    s-=4;
  }

  // Extra strong penalty for hospital with no/low degree
  if(
    currentJob.id==="hospital" &&
    (c.degree==="No Degree" || c.degree==="High School Graduate" || c.degree==="High School Student")
  ){
    s-=8;
  }

  // Skills
  const matches=c.skills.filter(x=>currentJob.requiredSkills.includes(x)).length;
  if(matches>=2)s+=4;
  else if(matches===1)s+=2;
  else s-=2;

  // Reliability: low reliability hurts, but can be offset
  if(c.reliability>=8)s+=2;
  else if(c.reliability<=5)s-=2;

  // Traits: good adds a bit, bad subtracts a bit
  if(goodTraits.includes(c.goodTrait)) s+=2;
  if(badTraits.includes(c.badTrait)) s-=2;

  // Immigrant structural bonus (shortage-filling)
  if(currentJob.immigrantBonus && c.immigrant && roundOrder[currentRound] !== "final") s+=1;

  return s;
}

function updateScores(){
  const hired=candidates.filter(c=>hiredIds.has(c.id));
  const totalPay=hired.reduce((a,c)=>a+c.pay,0);
  const remaining=currentJob.budget-totalPay;

  budgetRemainingEl.textContent=`$${remaining}/hr`;

  let fit=hired.reduce((a,c)=>a+computeFitScore(c),0);

  // No hire-count penalty here; only enforced on check
  fitScoreEl.textContent=fit;

  let budgetScore = remaining>=0
    ? Math.round((remaining/currentJob.budget)*100)
    : Math.round((remaining/currentJob.budget)*50);

  const total = fit + budgetScore;
  totalScoreEl.textContent = total;
}

/****************************************************
 * FACT POPUP
 ****************************************************/

function showIndustryFacts(roundIndex){
  const id = roundOrder[roundIndex];
  const facts = industryFacts[id];
  const chosen = [];

  while(chosen.length < 3 && chosen.length < facts.length){
    const f = randChoice(facts);
    if(!chosen.includes(f)) chosen.push(f);
  }

  alert("Workforce Facts:\n\n" + chosen.map(f => "• " + f).join("\n"));
}

/****************************************************
 * FINAL SUMMARY
 ****************************************************/

function showFinalSummary(){
  const totalHired = permanentlyHired.size;
  const totalScore = roundScores.reduce((a,b)=>a+b,0);

  const totalMs = Date.now() - gameStartTime;
  const totalSeconds = Math.round(totalMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  let summary = "Final Summary\n\n";
  summary += `Total workers hired: ${totalHired}\n`;
  summary += `Immigrant workers hired: ${totalImmigrantHires}\n`;
  summary += `Total score across all rounds: ${totalScore}\n`;
  summary += `Total time played: ${minutes}m ${seconds}s\n\n`;
  summary += "Business Results:\n";

  roundStats.forEach((r, idx) => {
    summary += `\nRound ${idx+1}: ${r.jobTitle} (${r.companyName})\n`;
    summary += `  Round score: ${r.roundScore}\n`;
    summary += `  Immigrant hires this round: ${r.immigrantHires}\n`;
  });

  summary += "\nIn earlier rounds, immigrant workers helped fill key gaps.\n";
  summary += "In the final round, when immigrant applicants were unavailable and wages rose, staffing became much harder.\n";

  alert(summary);
}

/****************************************************
 * ROUND COMPLETION
 ****************************************************/

checkBtn.addEventListener("click",()=>{
  const hired=candidates.filter(c=>hiredIds.has(c.id));
  if(hired.length!==REQUIRED_HIRES){
    alert(`You must hire exactly ${REQUIRED_HIRES}.`);
    return;
  }

  hired.forEach(c=>{
    permanentlyHired.add(c.id);
    if(c.immigrant) totalImmigrantHires++;
  });

  const roundTotal = parseInt(totalScoreEl.textContent,10) || 0;
  roundScores.push(roundTotal);

  const immigrantHiresThisRound = hired.filter(c=>c.immigrant).length;
  roundStats.push({
    jobTitle: currentJob.title,
    companyName,
    roundScore: roundTotal,
    immigrantHires: immigrantHiresThisRound
  });

  showIndustryFacts(currentRound);

  currentRound++;
  startGame();
});

/****************************************************
 * RESET
 ****************************************************/

resetBtn.addEventListener("click",()=>{
  currentRound=0;
  permanentlyHired.clear();
  hiredIds=new Set();
  totalImmigrantHires=0;
  roundScores=[];
  roundStats=[];
  globalCandidateId=0;
  gameStartTime = Date.now();
  startGame();
});

/****************************************************
 * GAME LOOP
 ****************************************************/

function startGame() {
  if (!gameStartTime) {
    gameStartTime = Date.now();
  }

  if (currentRound >= roundOrder.length) {
    showFinalSummary();
    return;
  }

  const roundId = roundOrder[currentRound];

  // Final round: restaurant, no immigrants, higher wages
  if (roundId === "final") {
    currentJob = jobs.find(j => j.id === "restaurant");
  } else {
    currentJob = jobs.find(j => j.id === roundId);
  }

  const typeName = currentJob.title;

  // Show round first
  if (roundId === "final") {
    alert(`Round ${currentRound + 1}: ${typeName} (Immigrant Applicants Unavailable, Wages Higher)`);
    alert(
      "Policy Change and Labor Shortage:\n\n" +
      "In this final round, immigrant applicants are temporarily unavailable.\n" +
      "This reflects how policy or visa changes can suddenly remove a key part of the workforce.\n" +
      "Because of the shortage, wages are higher, but your budget has not fully kept up.\n" +
      "You will now see how much harder it is to staff this industry without immigrant workers."
    );
  } else {
    alert(`Round ${currentRound + 1}: ${typeName}`);
  }

  // Then ask for company name
  companyName = prompt(`What is your ${typeName}'s name?`) || "Your Company";

  jobTitleEl.textContent = currentJob.title;
  hireCountEl.textContent = REQUIRED_HIRES;
  hireCountInlineEl.textContent = REQUIRED_HIRES;

  // Adjust budget for final round (slightly tighter)
  if (roundId === "final") {
    const reducedBudget = Math.round(currentJob.budget * 0.9);
    currentJob = { ...currentJob, budget: reducedBudget };
  }

  budgetAmountEl.textContent = `$${currentJob.budget}/hr`;
  jobDescriptionEl.textContent = currentJob.description.replace("COMPANY_NAME", companyName);

  generateCandidates();
  renderCandidates();
  renderHired();
  updateScores();
}

/****************************************************
 * START
 ****************************************************/

startGame();
