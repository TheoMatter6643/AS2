// Number of hires required
const REQUIRED_HIRES = 6;

// Job definitions
const jobs = [
  {
    id: "big-tech",
    title: "Big Tech Company",
    budget: 90,
    preferredDegrees: ["Computer Science", "Software Engineering", "Data Science", "Information Technology"],
    neutralDegrees: ["Mathematics", "Business Administration", "Physics"],
    badDegrees: ["Music", "Fine Arts", "Culinary Arts", "History", "Education"],
    requiredSkills: ["coding", "data", "debugging", "IT support"],
    immigrantBonus: true,
    description: `
      You are hiring for a large tech company. You need strong technical skills:
      coding, data, debugging, and IT support. Degrees in CS, Software Engineering,
      Data Science, or IT are ideal. Creative arts degrees are a poor fit here.
      Stay under budget while hiring ${REQUIRED_HIRES} solid candidates.
    `
  },
  {
    id: "elementary-school",
    title: "Elementary School",
    budget: 80,
    preferredDegrees: ["Education", "Psychology", "English", "History"],
    neutralDegrees: ["Music", "Fine Arts", "Mathematics"],
    badDegrees: ["Aerospace Engineering", "Mechanical Engineering", "Computer Science"],
    requiredSkills: ["teaching", "childcare", "communication", "writing"],
    immigrantBonus: true,
    description: `
      You are hiring for an elementary school. You need patient, communicative people
      with teaching or childcare skills. Degrees in Education, Psychology, English,
      or History are ideal. Highly specialized technical degrees are often a poor fit.
      Stay under budget while hiring ${REQUIRED_HIRES} solid candidates.
    `
  },
  {
    id: "restaurant",
    title: "Restaurant",
    budget: 70,
    preferredDegrees: ["Culinary Arts", "Hospitality", "Business Administration"],
    neutralDegrees: ["Music", "Fine Arts", "Education"],
    badDegrees: ["Aerospace Engineering", "Data Science", "Physics"],
    requiredSkills: ["cooking", "customer service", "cashier", "host", "logistics"],
    immigrantBonus: true,
    description: `
      You are hiring for a busy restaurant. You need people who can cook, serve,
      handle customers, and keep things moving. Culinary, hospitality, or business
      degrees are helpful but not required. Highly specialized technical degrees
      may be a poor fit. Stay under budget while hiring ${REQUIRED_HIRES} solid candidates.
    `
  },
  {
    id: "hospital",
    title: "Hospital",
    budget: 95,
    preferredDegrees: ["Nursing", "Biology", "Medicine", "Psychology"],
    neutralDegrees: ["Business Administration", "Mathematics"],
    badDegrees: ["Music", "Fine Arts", "Culinary Arts"],
    requiredSkills: ["caregiving", "analysis", "communication", "logistics"],
    immigrantBonus: true,
    description: `
      You are hiring for a hospital. You need reliable, detail-oriented people with
      caregiving, analysis, and communication skills. Degrees in Nursing, Biology,
      Medicine, or Psychology are ideal. Pure arts degrees are usually a poor fit.
      Stay under budget while hiring ${REQUIRED_HIRES} solid candidates.
    `
  },
  {
    id: "logistics-warehouse",
    title: "Logistics Warehouse",
    budget: 75,
    preferredDegrees: ["Logistics", "Business Administration", "Mechanical Engineering"],
    neutralDegrees: ["Mathematics", "Physics"],
    badDegrees: ["Music", "Fine Arts", "Culinary Arts"],
    requiredSkills: ["logistics", "warehouse", "forklift", "driver"],
    immigrantBonus: true,
    description: `
      You are hiring for a logistics warehouse. You need people who can move goods,
      manage inventory, and operate equipment. Logistics, business, or mechanical
      backgrounds are helpful. Pure arts degrees are a poor fit. Stay under budget
      while hiring ${REQUIRED_HIRES} solid candidates.
    `
  }
];

// Degree, skill, and trait pools
const degreePool = [
  "Computer Science", "Software Engineering", "Data Science", "Information Technology",
  "Mathematics", "Business Administration", "Physics", "Music", "Fine Arts",
  "Culinary Arts", "History", "Education", "Psychology", "Nursing", "Biology",
  "Mechanical Engineering", "Aerospace Engineering", "Logistics"
];

const skillPool = [
  "coding", "data", "debugging", "IT support", "teaching", "childcare",
  "communication", "writing", "cooking", "customer service", "cashier",
  "host", "logistics", "warehouse", "forklift", "driver", "analysis",
  "caregiving", "marketing", "social media"
];

const traitPool = [
  "reliable", "creative", "slow learner", "bilingual", "perfectionist",
  "disorganized", "team‑player", "independent"
];

const immigrantTraitPool = [
  "bilingual", "high stamina", "precision worker", "fast learner",
  "adaptable", "team‑player"
];

// Game state
let currentJob = null;
let candidates = [];
let hiredIds = new Set();

// DOM references
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

// Helpers
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randChoice(arr) { return arr[randInt(0, arr.length - 1)]; }

// Pick a random job
function pickRandomJob() {
  currentJob = randChoice(jobs);
  jobTitleEl.textContent = currentJob.title;
  budgetAmountEl.textContent = `$${currentJob.budget}/hr`;
  hireCountEl.textContent = REQUIRED_HIRES;
  hireCountInlineEl.textContent = REQUIRED_HIRES;
  jobDescriptionEl.textContent = currentJob.description.trim();
}

// Base salary by degree/skills
function getBasePay(degree, skills) {
  if (["Computer Science", "Software Engineering", "Data Science", "Information Technology"].includes(degree))
    return randInt(35, 60);
  if (["Nursing", "Biology", "Psychology", "Medicine"].includes(degree))
    return randInt(28, 55);
  if (["Education", "History", "English"].includes(degree))
    return randInt(20, 35);
  if (skills.includes("warehouse") || skills.includes("forklift") || degree === "Logistics")
    return randInt(18, 30);
  if (degree === "Culinary Arts" || skills.includes("cooking"))
    return randInt(14, 22);
  if (["Music", "Fine Arts"].includes(degree))
    return randInt(15, 25);
  return randInt(18, 30);
}

// Immigrant salary adjustments
function adjustForImmigrant(basePay, immigrant, degree, skills) {
  if (!immigrant) return basePay;

  let pay = basePay;
  if (["Computer Science", "Engineering", "Medicine"].includes(degree))
    pay -= randInt(4, 10);
  if (skills.includes("communication") || skills.includes("customer service"))
    pay -= randInt(2, 5);
  pay -= randInt(1, 4);

  return Math.max(pay, 12);
}

// Generate candidates
function generateCandidates(count = 24) {
  candidates = [];
  hiredIds = new Set();

  for (let i = 0; i < count; i++) {
    const immigrant = Math.random() < 0.45;

    // Immigrant degree bias
    const immigrantDegreePool = [
      "Computer Science", "Software Engineering", "Data Science",
      "Information Technology", "Mechanical Engineering",
      "Aerospace Engineering", "Biology", "Nursing",
      "Logistics", "Culinary Arts", "Business Administration"
    ];

    const degree = immigrant ? randChoice(immigrantDegreePool) : randChoice(degreePool);

    // Skills
    const skills = [];
    const numSkills = randInt(2, 4);
    for (let j = 0; j < numSkills; j++) {
      const skill = randChoice(skillPool);
      if (!skills.includes(skill)) skills.push(skill);
    }

    // Reliability
    let reliability = randInt(3, 10);
    if (immigrant) reliability = Math.min(reliability + 1, 10);

    // Salary
    const basePay = getBasePay(degree, skills);
    const pay = adjustForImmigrant(basePay, immigrant, degree, skills);

    // Traits
    const trait = immigrant ? randChoice(immigrantTraitPool) : randChoice(traitPool);

    candidates.push({
      id: `c${i + 1}`,
      name: generateName(i),
      degree,
      skills,
      immigrant,
      reliability,
      pay,
      trait
    });
  }
}

// Random name generator
function generateName() {
  const first = ["Maria", "Jamal", "Luis", "Aisha", "Chen", "Sofia", "Ahmed", "Emily", "Carlos", "Hana", "Igor", "Grace", "Nadia", "Omar", "Lina", "Victor", "Mei", "Ravi", "Fatima", "Jonas"];
  const last = ["R.", "T.", "G.", "K.", "L.", "P.", "D.", "S.", "M.", "Y.", "V.", "B.", "H.", "O.", "C.", "N.", "Z.", "Q.", "J.", "F."];
  return `${randChoice(first)} ${randChoice(last)}`;
}

// Render candidate pool
function renderCandidates() {
  candidateListEl.innerHTML = "";
  candidates.forEach(c => {
    if (!hiredIds.has(c.id)) {
      candidateListEl.appendChild(createCandidateCard(c, false));
    }
  });
}

// Render hired list
function renderHired() {
  hiredDropzoneEl.innerHTML = "";
  hiredDropzoneEl.classList.toggle("empty", hiredIds.size === 0);
  candidates.forEach(c => {
    if (hiredIds.has(c.id)) {
      hiredDropzoneEl.appendChild(createCandidateCard(c, true));
    }
  });
}

// Create candidate card
function createCandidateCard(candidate, inHired) {
  const card = document.createElement("div");
  card.className = "candidate-card";
  card.draggable = !inHired;
  card.dataset.id = candidate.id;

  card.innerHTML = `
    <div class="candidate-header">
      <span>${candidate.name}</span>
      <span class="candidate-pay">$${candidate.pay}/hr</span>
    </div>
    <div class="candidate-meta">
      Degree: (${candidate.degree}) • Reliability: ${candidate.reliability}/10 • Trait: ${candidate.trait}
    </div>
    <div class="candidate-tags">
      <span class="tag degree">${candidate.degree}</span>
      ${candidate.immigrant ? `<span class="tag immigrant">Immigrant</span>` : ""}
      ${candidate.skills.map(s => `<span class="tag skill">${s}</span>`).join("")}
    </div>
  `;

  if (!inHired) {
    card.addEventListener("dragstart", (e) => {
      card.classList.add("dragging");
      e.dataTransfer.setData("text/plain", candidate.id);
    });
    card.addEventListener("dragend", () => card.classList.remove("dragging"));
  }

  return card;
}

// Drag back to candidate pool
candidateListEl.addEventListener("dragover", (e) => e.preventDefault());
candidateListEl.addEventListener("drop", (e) => {
  const id = e.dataTransfer.getData("text/plain");
  if (!id) return;
  hiredIds.delete(id);
  renderCandidates();
  renderHired();
  updateScores();
});

// Drag into hired zone
hiredDropzoneEl.addEventListener("dragover", (e) => e.preventDefault());
hiredDropzoneEl.addEventListener("drop", (e) => {
  const id = e.dataTransfer.getData("text/plain");
  if (!id) return;
  hiredIds.add(id);
  renderCandidates();
  renderHired();
  updateScores();
});

// Fit scoring
function computeFitScoreForCandidate(candidate) {
  let score = 0;

  if (currentJob.preferredDegrees.includes(candidate.degree)) score += 3;
  else if (currentJob.neutralDegrees.includes(candidate.degree)) score += 1;
  else if (currentJob.badDegrees.includes(candidate.degree)) score -= 3;

  const skillMatches = candidate.skills.filter(s => currentJob.requiredSkills.includes(s)).length;
  if (skillMatches >= 2) score += 3;
  else if (skillMatches === 1) score += 1;
  else score -= 2;

  if (candidate.reliability >= 8) score += 2;
  else if (candidate.reliability <= 5) score -= 2;

  if (currentJob.immigrantBonus && candidate.immigrant) score += 1;

  if (candidate.degree === "Aerospace Engineering" && currentJob.id === "restaurant") score -= 3;
  if (candidate.degree === "Culinary Arts" && currentJob.id === "big-tech") score -= 3;

  return score;
}

// Update scores
function updateScores() {
  const hired = candidates.filter(c => hiredIds.has(c.id));
  const totalPay = hired.reduce((sum, c) => sum + c.pay, 0);
  const remainingBudget = currentJob.budget - totalPay;

  budgetRemainingEl.textContent = `$${remainingBudget}/hr`;

  let fitScore = hired.reduce((sum, c) => sum + computeFitScoreForCandidate(c), 0);

  if (hired.length !== REQUIRED_HIRES)
    fitScore -= Math.abs(hired.length - REQUIRED_HIRES) * 5;

  fitScoreEl.textContent = fitScore;

  let budgetScore = remainingBudget > 0
    ? Math.round((remainingBudget / currentJob.budget) * 100)
    : Math.round((remainingBudget / currentJob.budget) * 50);

  totalScoreEl.textContent = fitScore + budgetScore;
}

// Buttons
resetBtn.addEventListener("click", startGame);

checkBtn.addEventListener("click", () => {
  const hired = candidates.filter(c => hiredIds.has(c.id));
  const remaining = budgetRemainingEl.textContent;
  const fit = fitScoreEl.textContent;
  const total = totalScoreEl.textContent;

  let msg = `You hired ${hired.length} candidates.\nRemaining budget: ${remaining}.\nFit score: ${fit}.\nTotal score: ${total}.`;

  if (hired.length < REQUIRED_HIRES)
    msg += `\n\nYou hired fewer than ${REQUIRED_HIRES}.`;
  else if (hired.length > REQUIRED_HIRES)
    msg += `\n\nYou hired more than ${REQUIRED_HIRES}.`;
  else
    msg += `\n\nNice! You hired exactly ${REQUIRED_HIRES}.`;

  alert(msg);
});

// Start game
function startGame() {
  pickRandomJob();
  generateCandidates(24);
  renderCandidates();
  renderHired();
  updateScores();
}

startGame();
