/****************************************************
 * CONFIG
 ****************************************************/

const REQUIRED_HIRES = 6;
let companyName = "";
let permanentlyHired = new Set();
let currentRound = 0;
let totalImmigrantHires = 0;

const roundOrder = [
  "restaurant",
  "elementary-school",
  "big-tech",
  "hospital",
  "logistics-warehouse",
  "final" // hardest: no immigrants, food service (restaurant)
];

/****************************************************
 * INDUSTRY-SPECIFIC FACT POOLS
 ****************************************************/

const industryFacts = {
  "restaurant": [
    "Immigrants make up over 30% of all restaurant workers in the U.S.",
    "Many restaurants rely on immigrant workers to fill early-morning and late-night shifts.",
    "Immigrants help stabilize food service staffing during peak seasons.",
    "Food service is one of the industries most reliant on immigrant labor.",
    "Immigrant workers often keep restaurants open during labor shortages."
  ],
  "elementary-school": [
    "Immigrants help fill teacher shortages in rural and urban districts.",
    "Bilingual immigrant educators support multilingual classrooms.",
    "Immigrant workers often fill essential support roles in schools.",
    "Some districts rely on immigrant teachers recruited from abroad.",
    "Immigrant families contribute to growing school enrollment in many areas."
  ],
  "big-tech": [
    "Over 45% of STEM PhD holders in the U.S. are immigrants.",
    "Immigrants play a major role in software engineering and data science.",
    "Many tech companies rely on immigrant talent for specialized roles.",
    "Immigrant-founded companies employ millions of workers.",
    "Immigrants are heavily represented in high-skill tech roles."
  ],
  "hospital": [
    "Nearly 1 in 4 doctors in the U.S. is an immigrant.",
    "Immigrants are essential in nursing and long-term care roles.",
    "Hospitals rely on immigrant workers to fill critical staffing gaps.",
    "Immigrant health workers support care in underserved communities.",
    "Immigrant doctors and nurses help address physician shortages."
  ],
  "logistics-warehouse": [
    "Immigrants are overrepresented in warehouse and distribution jobs.",
    "Logistics companies rely on immigrant workers during peak demand seasons.",
    "Immigrants help stabilize supply chain labor shortages.",
    "Many delivery and warehouse roles are filled by immigrant workers.",
    "Immigrant workers support the movement of goods across the country."
  ],
  "final": [
    "Without immigrants, many essential industries face severe staffing shortages.",
    "Labor shortages intensify when immigrant workers are unavailable.",
    "Immigrant workers help keep critical services running nationwide.",
    "Removing immigrant workers can expose how fragile some industries are.",
    "Immigrant labor often fills gaps that would otherwise remain unfilled."
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
    preferredDegrees: ["Education", "Psychology", "English", "History"],
    neutralDegrees: ["Music", "Fine Arts", "Mathematics", "High School Graduate"],
    badDegrees: ["Aerospace Engineering", "Mechanical Engineering", "Computer Science", "Software Engineering"],
    requiredSkills: ["teaching", "childcare", "communication", "writing"],
    immigrantBonus: true,
    description: `You are hiring for COMPANY_NAME. Hire ${REQUIRED_HIRES} workers.`
  },
  {
    id: "big-tech",
    title: "Tech Company",
    budget: 300,
    preferredDegrees: ["Computer Science", "Software Engineering", "Data Science", "Information Technology"],
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
    neutralDegrees: ["Business Administration", "Mathematics", "High School Graduate"],
    badDegrees: ["Music", "Fine Arts", "Culinary Arts"],
    requiredSkills: ["caregiving", "analysis", "communication", "logistics"],
    immigrantBonus: true,
    description: `You are hiring for COMPANY_NAME. Hire ${REQUIRED_HIRES} workers.`
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
    description: `You are hiring for COMPANY_NAME. Hire ${REQUIRED_HIRES} workers.`
  }
];

/****************************************************
 * NAME, DEGREE, SKILL, TRAIT POOLS
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

/****************************************************
 * DOM ELEMENTS
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
 * JOB SELECTION
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
  if(["Education","History","English"].includes(degree))return randInt(22,38);
  if(skills.includes("warehouse")||skills.includes("forklift")||degree==="Logistics")return randInt(18,32);
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
  if(j.id==="restaurant" && ["Aerospace Engineering","Physics","Computer Science","Software Engineering"].includes(c.degree))return false;
  if(j.id==="hospital" && ["Fine Arts","Music","Culinary Arts"].includes(c.degree))return false;
  if(j.id==="logistics-warehouse" && ["Music","Fine Arts","Psychology"].includes(c.degree))return false;
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

  while(candidates.length<60 && tries<400){
    tries++;

    const immigrant = immigrantsAllowed && Math.random() < 0.45;

    let degree;
    if(currentJob.id === "elementary-school"){
      degree = immigrant
        ? randChoice(["Education","Psychology","English","History","High School Graduate"])
        : randChoice(["Education","Psychology","English","History","Music","Fine Arts","High School Graduate"]);
    } else if(currentJob.id === "hospital"){
      degree = immigrant
        ? randChoice(["Nursing","Biology","Medicine","Doctor","Psychology","High School Graduate"])
        : randChoice(["Nursing","Biology","Medicine","Doctor","Psychology","Business Administration","High School Graduate"]);
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
      } else {
        s = randChoice(skillPool);
      }
      if(!skills.includes(s))skills.push(s);
    }

    let reliability = randInt(3,10);
    if(immigrant) reliability = Math.min(reliability+1,10);

    const pay = adjustForImmigrant(getBasePay(degree,skills),immigrant);
    const trait = immigrant ? randChoice(immigrantTraitPool) : randChoice(traitPool);

    const c = {
      id:`c${currentRound}-${tries}`,
      name:generateName(),
      degree,
      skills,
      immigrant,
      reliability,
      pay,
      trait
    };

    if(permanentlyHired.has(c.id)) continue;
    if(isRelevantForJob(c,currentJob)) candidates.push(c);
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
  if(currentJob.preferredDegrees.includes(c.degree)) s+=3;
  else if(currentJob.neutralDegrees.includes(c.degree)) s+=1;
  else if(currentJob.badDegrees.includes(c.degree)) s-=3;

  // Strong penalty if degree is irrelevant (not preferred or neutral)
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
    s-=6;
  }

  // Skills
  const matches=c.skills.filter(x=>currentJob.requiredSkills.includes(x)).length;
  if(matches>=2)s+=3;
  else if(matches===1)s+=1;
  else s-=2;

  // Reliability: low reliability hurts, but can be offset by good degree
  if(c.reliability>=8)s+=2;
  else if(c.reliability<=5)s-=2;

  // Immigrant structural bonus (shortage-filling)
  if(currentJob.immigrantBonus && c.immigrant)s+=1;

  return s;
}

function updateScores(){
  const hired=candidates.filter(c=>hiredIds.has(c.id));
  const totalPay=hired.reduce((a,c)=>a+c.pay,0);
  const remaining=currentJob.budget-totalPay;

  budgetRemainingEl.textContent=`$${remaining}/hr`;

  let fit=hired.reduce((a,c)=>a+computeFitScore(c),0);

  // Only penalize wrong count AFTER player starts hiring
  if(hired.length>0 && hired.length!==REQUIRED_HIRES){
    fit-=Math.abs(hired.length-REQUIRED_HIRES)*5;
  }

  fitScoreEl.textContent=fit;

  let budgetScore = remaining>=0
    ? Math.round((remaining/currentJob.budget)*100)
    : Math.round((remaining/currentJob.budget)*50);

  totalScoreEl.textContent = fit + budgetScore;
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

  alert(
    "Final Summary\n\n" +
    `Total workers hired: ${totalHired}\n` +
    `Immigrant workers hired: ${totalImmigrantHires}\n\n` +
    "Across these rounds, immigrant workers helped fill key gaps in multiple industries.\n" +
    "In the final round, when immigrant applicants were unavailable, staffing became much harder.\n\n" +
    "Thank you for playing."
  );
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
  startGame();
});

/****************************************************
 * GAME LOOP
 ****************************************************/

function startGame() {
  if (currentRound >= roundOrder.length) {
    showFinalSummary();
    return;
  }

  const roundId = roundOrder[currentRound];

  // Final round: explicitly restaurant (food service) and no immigrants
  if (roundId === "final") {
    currentJob = jobs.find(j => j.id === "restaurant");
  } else {
    currentJob = jobs.find(j => j.id === roundId);
  }

  const typeName = currentJob.title;

  // Show round first
  if (roundId === "final") {
    alert(`Round ${currentRound + 1}: ${typeName} (Immigrant Applicants Unavailable)`);
    alert(
      "Policy Change:\n\n" +
      "In this final round, immigrant applicants are temporarily unavailable.\n" +
      "This reflects how policy or visa changes can suddenly remove a key part of the workforce.\n" +
      "You will now see how much harder it is to staff this industry without them."
    );
  } else {
    alert(`Round ${currentRound + 1}: ${typeName}`);
  }

  // Then ask for company name
  companyName = prompt(`What is your ${typeName}'s name?`) || "Your Company";

  jobTitleEl.textContent = currentJob.title;
  budgetAmountEl.textContent = `$${currentJob.budget}/hr`;
  hireCountEl.textContent = REQUIRED_HIRES;
  hireCountInlineEl.textContent = REQUIRED_HIRES;
  jobDescriptionEl.textContent = currentJob.description.replace("COMPANY_NAME", companyName);

  // Make final round harder: lower budget a bit
  if (roundId === "final") {
    const reducedBudget = Math.round(currentJob.budget * 0.8);
    currentJob = { ...currentJob, budget: reducedBudget };
    budgetAmountEl.textContent = `$${currentJob.budget}/hr`;
  }

  generateCandidates();
  renderCandidates();
  renderHired();
  updateScores();
}

/****************************************************
 * START
 ****************************************************/

startGame();
