const GROUP_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrOrx9JCZmqS8XhlDz2ueR2ewAaPBGFwrfg_LLccxcW_pqREW8OiHzHupgn8RSpz1HHCia6RFZ0d-t/pub?gid=0&single=true&output=csv";
const FIRST_PLACE_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrOrx9JCZmqS8XhlDz2ueR2ewAaPBGFwrfg_LLccxcW_pqREW8OiHzHupgn8RSpz1HHCia6RFZ0d-t/pub?gid=1076669321&single=true&output=csv";
const SECOND_PLACE_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrOrx9JCZmqS8XhlDz2ueR2ewAaPBGFwrfg_LLccxcW_pqREW8OiHzHupgn8RSpz1HHCia6RFZ0d-t/pub?gid=557909970&single=true&output=csv";

let selectedOutcome = "first";

const container = document.getElementById("days");

const firstBtn = document.getElementById("firstBtn");
const secondBtn = document.getElementById("secondBtn");

firstBtn.addEventListener("click", () => {
  selectedOutcome = "first";
  setActive();
  loadAll();
});

secondBtn.addEventListener("click", () => {
  selectedOutcome = "second";
  setActive();
  loadAll();
});

function setActive() {
  firstBtn.classList.toggle("active", selectedOutcome === "first");
  secondBtn.classList.toggle("active", selectedOutcome === "second");
}

async function loadAll() {
  const groupData = await fetchSheet(GROUP_URL);

  const outcomeURL =
    selectedOutcome === "first"
      ? FIRST_PLACE_URL
      : SECOND_PLACE_URL;

  const outcomeData = await fetchSheet(outcomeURL);

  render([...groupData, ...outcomeData]);
}

async function fetchSheet(url) {
  const res = await fetch(url);
  const text = await res.text();

  return text
    .trim()
    .split("\n")
    .slice(1)
    .map(row => row.split(","))
    .filter(cols => cols[0] && cols[0].trim() !== "")
    .map(cols => ({
      day: cols[0]?.trim(),
      date: cols[1]?.trim(),
      weekday: cols[2]?.trim(),
      accommodation: cols[3]?.trim(),
      travel: cols[4]?.trim(),
      activities: cols[5]?.trim()
    }));
}

function render(itinerary) {
  container.innerHTML = "";

  itinerary.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-header">
        <div>
          <div class="day-title">${item.day}</div>
          <div class="date-line">
            ${item.weekday || ""} • ${item.date || ""}
          </div>
        </div>
        <div class="chevron">›</div>
      </div>

      <div class="card-content">
        <p>🏠 ${item.accommodation || "Not specified"}</p>
        <p>✈️ ${item.travel || "No travel planned"}</p>

      <p><strong>🎯 Activities</strong></p>

      <ul>
        ${(item.activities || "")
          .split(";")
          .map(a => a.trim())
          .filter(a => a)
          .map(a => `<li>📍 ${a}</li>`)
          .join("")}
      </ul>
    `;

    card.querySelector(".card-header").addEventListener("click", () => {
      card.classList.toggle("open");
    });

    container.appendChild(card);
  });
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

loadAll();