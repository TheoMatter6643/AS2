const TOTAL_BUDGET = 120;
let budgetRemaining = TOTAL_BUDGET;

const placements = {}; // slot → workerId

const workers = [
  {
    id: "w1",
    name: "Maria R.",
    pay: 18,
    education: "hs",
    immigrant: true,
    skills: ["customer service", "bilingual"],
    preference: "service",
    reliability: 8
  },
  {
    id: "w2",
    name: "Jamal T.",
    pay: 25,
    education: "college",
    immigrant: false,
    skills: ["data entry", "scheduling"],
    preference: "white",
    reliability: 9
  },
  {
    id: "w3",
    name: "Luis G.",
    pay: 20,
    education: "nohs",
    immigrant: true,
    skills: ["construction", "logistics"],
    preference: "blue",
    reliability: 7
  },
  {
    id: "w4",
    name: "Aisha K.",
    pay: 22,
    education: "hs",
    immigrant: true,
    skills: ["retail", "cashier"],
    preference: "service",
    reliability: 8
  },
  {
    id: "w5",
    name: "Chen L.",
    pay: 28,
    education: "college",
    immigrant: true,
    skills: ["analysis", "excel"],
    preference: "white",
    reliability: 9
  },
  {
    id: "w6",
    name: "Sofia P.",
    pay: 16,
    education: "hs",
    immigrant: false,
    skills: ["host", "barista"],
    preference: "service",
    reliability: 7
  },
  {
    id: "w7",
    name: "Ahmed D.",
    pay: 19,
    education: "nohs",
    immigrant: true,
    skills: ["warehouse", "forklift"],
    preference: "blue",
    reliability: 7
  },
  {
    id: "w8",
    name: "Emily S.",
    pay: 24,
    education: "college",
    immigrant: false,
    skills: ["HR", "communication"],
    preference: "white",
    reliability: 8
  },
  {
    id: "w9",
    name: "Carlos M.",
    pay: 17,
    education: "hs",
    immigrant: true,
    skills: ["dishwasher", "prep cook"],
    preference: "service",
    reliability: 6
  },
  {
    id: "w10",
    name: "Hana Y.",
    pay: 21,
    education: "college",
    immigrant: true,
    skills: ["IT support", "troubleshooting"],
    preference: "white",
    reliability: 8
  },
  {
    id: "w11",
    name: "Igor V.",
    pay: 19,
    education: "hs",
    immigrant: true,
    skills: ["driver", "delivery"],
    preference: "blue",
    reliability: 7
  },
  {
    id: "w12",
    name: "Grace B.",
    pay: 23,
    education: "college",
    immigrant: false,
    skills: ["marketing", "social media"],
    preference: "white",
    reliability: 8
  }
];

const workerListEl = document.getElementById("worker-list");
const budgetRemainingEl = document.getElementById("budget-remaining");
const totalScoreEl = document.getElementById("total-score");
const budgetStatusEl = document.getElementById("budget-status");

function createWorkerCard(worker) {
  const card = document.createElement("div");
  card.className = "worker-card";
  card.draggable = true;
  card.dataset.workerId = worker.id;

  card.innerHTML = `
    <div class="worker-header">
      <span>${worker.name}</span>
      <span class="worker-pay">$${worker.pay}/hr</span>
    </div>
    <div class="worker-meta">
      Prefers: ${worker.preference} • Reliability: ${worker.reliability}/10
    </div>
    <div class="worker-tags">
      <span class="tag education-${worker.education}">
        ${worker.education === "nohs" ? "No HS" : worker.education === "hs" ? "HS" : "College"}
      </span>
      ${worker.immigrant ? `<span class="tag immigrant">Immigrant</span>` : ""}
      ${worker.skills.map(s => `<span class="tag">${s}</span>`).join("")}
    </div>
  `;

  card.addEventListener("dragstart", (e) => {
    card.classList.add("dragging");
    e.dataTransfer.setData("text/plain", worker.id);
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
  });

  return card;
}

function renderWorkers() {
  workerListEl.innerHTML = "";
  workers.forEach(worker => {
    if (!Object.values(placements).includes(worker.id)) {
      workerListEl.appendChild(createWorkerCard(worker));
    }
  });
}

const slots = document.querySelectorAll(".slot");

slots.forEach(slot => {
  slot.addEventListener("dragover", (e) => e.preventDefault());

  slot.addEventListener("drop", (e) => {
    e.preventDefault();
    const workerId = e.dataTransfer.getData("text/plain");
    const slotId = slot.dataset.slot;

    placements[slotId] = workerId;
    updateSlots();
    updateBudget();
    updateScores();
  });
});

function updateSlots() {
  slots.forEach(slot => {
    const slotId = slot.dataset.slot;
    const workerId = placements[slotId];

    slot.innerHTML = "";
    if (workerId) {
      const worker = workers.find(w => w.id === workerId);
      const card = createWorkerCard(worker);
      card.draggable = false;
      slot.classList.add("filled");
      slot.appendChild(card);
    } else {
      slot.classList.remove("filled");
      slot.textContent = "Drop worker";
    }
  });

  renderWorkers();
}

function updateBudget() {
  const used = Object.values(placements)
    .map(id => workers.find(w => w.id === id))
    .reduce((sum, w) => sum + (w ? w.pay : 0), 0);

  budgetRemaining = TOTAL_BUDGET - used;
  budgetRemainingEl.textContent = `$${budgetRemaining}/hr`;

  if (budgetRemaining < 0) {
    budgetStatusEl.textContent = "Over Budget";
    budgetStatusEl.className = "highlight-budget-bad";
  } else {
    budgetStatusEl.textContent = "OK";
    budgetStatusEl.className = "highlight-budget-ok";
  }
}

function scoreWorkerForBoard(worker, board) {
  let score = 0;

  score += Math.round(worker.reliability / 2);

  if (board === "blue") {
    if (worker.skills.includes("construction") || worker.skills.includes("warehouse") || worker.skills.includes("driver")) {
      score += 2;
    }
    if (worker.immigrant) score += 1;
  }

  if (board === "white") {
    if (worker.education === "college") score += 2;
    if (worker.reliability >= 8) score += 1;
  }

  if (board === "service") {
    if (worker.skills.includes("bilingual") || worker.skills.includes("host") || worker.skills.includes("cashier") || worker.skills.includes("barista")) {
      score += 2;
    }
    if (worker.education === "hs" || worker.education === "nohs") score += 1;
    if (worker.immigrant) score += 1;
  }

  if (board === "unemployed") {
    if (worker.reliability <= 7) score += 1;
    if (worker.preference !== board) score += 1;
    if (worker.immigrant) score += 1;
  }

  return score;
}

function updateScores() {
  const boards = ["blue", "white", "service", "unemployed"];
  let total = 0;

  boards.forEach(board => {
    const boardSlots = Object.keys(placements).filter(slotId => slotId.startsWith(board));
    let boardScore = 0;

    boardSlots.forEach(slotId => {
      const workerId = placements[slotId];
      const worker = workers.find(w => w.id === workerId);
      if (worker) boardScore += scoreWorkerForBoard(worker, board);
    });

    document.querySelector(`[data-score="${board}"]`).textContent = boardScore;
    total += boardScore;
  });

  totalScoreEl.textContent = total;
}

document.getElementById("reset-btn").addEventListener("click", () => {
  Object.keys(placements).forEach(k => delete placements[k]);
  updateSlots();
  updateBudget();
  updateScores();
});

document.getElementById("check-btn").addEventListener("click", () => {
  const filledSlots = Object.keys(placements).length;

  let message = `You placed ${filledSlots} workers.\nTotal score: ${totalScoreEl.textContent}.\nBudget remaining: $${budgetRemaining}/hr.`;

  if (budgetRemaining < 0) {
    message += "\n\nYou are over budget!";
  } else if (filledSlots < 12) {
    message += "\n\nYou still have empty slots.";
  } else {
    message += "\n\nNice! You built a full workforce.";
  }

  alert(message);
});

updateBudget();
updateScores();
