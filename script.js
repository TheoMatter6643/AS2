// core config
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
  "space-company",
  "final"
];

// industry facts
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
  "space-company": [
    "Immigrant engineers and scientists play a major role in space and aerospace industries.",
    "Many space companies rely on immigrant workers for advanced STEM roles.",
    "Immigrant workers help staff both high-skill engineering and mid-skill technical positions.",
    "Global collaboration and immigrant talent are common in space exploration.",
    "Immigrant workers contribute to innovation in rocket and spacecraft design."
  ],
  "final": [
    "When immigrant workers are unavailable, staffing gaps become harder to fill.",
    "Labor shortages can worsen quickly if immigrant workers are removed.",
    "Immigrant workers often fill roles that would otherwise stay vacant.",
    "Policy changes can suddenly reduce access to immigrant labor.",
    "Industries that rely on immigrants can struggle when that labor disappears."
  ]
};

// job definitions
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
    difficultyMultiplier: 1.0,
    reliabilityMin: 4,
    reliabilityMax: 10,
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
    difficultyMultiplier: 1.2,
    reliabilityMin: 5,
    reliabilityMax: 10,
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
    difficultyMultiplier: 1.1,
    reliabilityMin: 6,
    reliabilityMax: 10,
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
    difficultyMultiplier: 1.3,
    reliabilityMin: 6,
    reliabilityMax: 10,
    description: `You are hiring for COMPANY_NAME. Hire ${REQUIRED_HIRES} workers.`
  },
  {
    id: "space-company",
    title: "Space Company",
    budget: 350,
    preferredDegrees: [
      "Aerospace Engineering",
      "Mechanical Engineering",
      "Electrical Engineering",
      "Computer Science",
      "Software Engineering",
      "Physics",
      "Mathematics",
      "Materials Science"
    ],
    neutralDegrees: ["Business Administration", "Logistics", "Industrial Engineering", "High School Graduate"],
    badDegrees: ["Culinary Arts", "Fine Arts", "Music", "Psychology", "Education", "History", "No Degree"],
    requiredSkills: ["analysis", "machinery", "precision", "electronics", "coding", "safety", "logistics"],
    immigrantBonus: true,
    difficultyMultiplier: 1.5,
    reliabilityMin: 7,
    reliabilityMax: 10,
    description: `You are hiring for COMPANY_NAME, a rocket and spacecraft company. Hire ${REQUIRED_HIRES} workers.`
  }
];

// pools
const degreePool = [
  "High School Student","High School Graduate","No Degree",
  "Computer Science","Software Engineering","Data Science","Information Technology",
  "Mathematics","Business Administration","Physics","Music","Fine Arts","Culinary Arts",
  "History","Education","Psychology","Nursing","Biology","Mechanical Engineering",
  "Aerospace Engineering","Logistics","Medicine","Doctor","Industrial Engineering","Materials Science","Electrical Engineering"
];

const skillPool = [
  "coding","data","debugging","IT support","teaching","childcare","communication",
  "writing","cooking","customer service","cashier","host","logistics","warehouse",
  "driver","analysis","caregiving","marketing","social media","machinery","precision","electronics","safety"
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

// dom
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

// utils
function randInt(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
function randChoice(a){return a[randInt(0,a.length-1)];}
function generateName(){
  if(uniqueFirstNames.length===0) uniqueFirstNames=[...backupNames];
  const first=uniqueFirstNames.shift();
  const last=randChoice(["R.","T.","G.","K.","L.","P.","D.","S.","M.","Y.","V.","B.","H.","O.","C.","N.","Z.","Q.","J.","F."]);
  return `${first} ${last}`;
}

// state
let currentJob = null;
let candidates = [];
let hiredIds = new Set();

// pay + relevance
function getBasePay(degree,skills){
  if(degree==="High School Student")return randInt(12,16);
  if(degree==="High School Graduate")return randInt(14,20);
  if(degree==="No Degree")return randInt(12,18);
  if(["Computer Science","Software Engineering","Data Science","Information Technology"].includes(degree))return randInt(40,70);
  if(["Nursing","Biology","Psychology","Medicine","Doctor"].includes(degree))return randInt(35,65);
  if(["Education","History","English","Music"].includes(degree))return randInt(22,38);
  if(["Mechanical Engineering","Aerospace Engineering","Industrial Engineering","Materials Science","Electrical Engineering"].includes(degree))return randInt(35,70);
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
  if(j.id==="space-company" && ["Culinary Arts","Fine Arts","Music","Psychology","Education","History"].includes(c.degree))return false;
  return true;
}

// irrelevant candidate generator
function generateIrrelevantCandidate(job){
  const immigrantAllowed = roundOrder[currentRound] !== "final";
  const immigrant = immigrantAllowed && Math.random() < 0.45;

  let wrongDegree = randChoice(degreePool);
  if(job.id === "restaurant") wrongDegree = randChoice(["Aerospace Engineering","Mechanical Engineering","Physics","Computer Science"]);
  else if(job.id === "space-company") wrongDegree = randChoice(["Culinary Arts","Fine Arts","Music","Psychology","Education","History"]);
  else if(job.id === "hospital") wrongDegree = randChoice(["Culinary Arts","Fine Arts","Music"]);
  else if(job.id === "elementary-school") wrongDegree = randChoice(["Aerospace Engineering","Mechanical Engineering","Computer Science"]);
  else if(job.id === "big-tech") wrongDegree = randChoice(["Culinary Arts","Fine Arts","Music","Education"]);

  const skills = [];
  const skillCount = randInt(1,3);
  for(let i=0;i<skillCount;i++){
    const s = randChoice(skillPool);
    if(!skills.includes(s)) skills.push(s);
  }

  let reliability = randInt(job.reliabilityMin, job.reliabilityMax);
  if(immigrant) reliability = Math.min(reliability+1,10);

  let pay = adjustForImmigrant(getBasePay(wrongDegree,skills),immigrant);
  if(Math.random() < 0.05) pay = pay * randInt(2,4);

  const goodTrait = randChoice(goodTraits);
  let badTrait = randChoice(badTraits);
  if(badTrait === goodTrait) badTrait = randChoice(badTraits);

  return {
    id:`c${globalCandidateId++}`,
    name:generateName(),
    degree:wrongDegree,
    skills,
    immigrant,
    reliability,
    pay,
    goodTrait,
    badTrait
  };
}

// candidate generation
function generateCandidates(){
  candidates=[];
  hiredIds=new Set();
  let tries=0;

  const immigrantsAllowed = roundOrder[currentRound] !== "final";

  while(candidates.length<40 && tries<400){
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
    } else if(currentJob.id === "restaurant"){
      degree = immigrant
        ? randChoice(["Culinary Arts","Hospitality","Business Administration","High School Graduate","No Degree"])
        : randChoice(["Culinary Arts","Hospitality","Business Administration","High School Graduate","No Degree","Fine Arts"]);
    } else if(currentJob.id === "big-tech"){
      degree = immigrant
        ? randChoice(["Computer Science","Software Engineering","Data Science","Information Technology","Mathematics"])
        : randChoice(["Computer Science","Software Engineering","Data Science","Information Technology","Mathematics","Mechanical Engineering"]);
    } else if(currentJob.id === "space-company"){
      degree = immigrant
        ? randChoice(["Aerospace Engineering","Mechanical Engineering","Electrical Engineering","Computer Science","Software Engineering","Physics","Mathematics","Materials Science"])
        : randChoice(["Aerospace Engineering","Mechanical Engineering","Electrical Engineering","Computer Science","Software Engineering","Physics","Mathematics","Materials Science","Industrial Engineering","Business Administration","Logistics","High School Graduate"]);
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
        s = randChoice(["teaching","childcare","communication","writing"]);
      } else if(currentJob.id==="hospital"){
        s = randChoice(["caregiving","analysis","communication","logistics"]);
      } else if(currentJob.id==="restaurant"){
        s = randChoice(["cooking","customer service","cashier","host","logistics"]);
      } else if(currentJob.id==="big-tech"){
        s = randChoice(["coding","data","debugging","IT support","communication"]);
      } else if(currentJob.id==="space-company"){
        s = randChoice(["analysis","machinery","precision","electronics","coding","safety","logistics","communication"]);
      } else {
        s = randChoice(skillPool);
      }
      if(!skills.includes(s))skills.push(s);
    }

    let reliability = randInt(currentJob.reliabilityMin, currentJob.reliabilityMax);
    if(immigrant) reliability = Math.min(reliability+1,10);

    let pay = adjustForImmigrant(getBasePay(degree,skills),immigrant);
    if(Math.random() < 0.05) pay = pay * randInt(2,4);

    const goodTrait = randChoice(goodTraits);
    let badTrait = randChoice(badTraits);