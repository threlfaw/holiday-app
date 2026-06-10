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
      activities: cols[5]?.trim(),
      destination: cols[6]?.trim()
    }));
}

function render(itinerary) {
  container.innerHTML = "";

  const now = new Date();
  const today =
    `${now.getFullYear()}-${
      String(now.getMonth() + 1).padStart(2, "0")
    }-${
      String(now.getDate()).padStart(2, "0")
    }`;

  itinerary.forEach(item => {

    const isToday = toKey(item.date) === today;

    const card = document.createElement("div");
    card.className = "card" + (isToday ? " today" : "");

    card.innerHTML = `
      <div class="card-header">
        <div>
          <div class="day-title">${item.day}</div>
          <div class="date-line">${item.weekday || ""} • ${item.date || ""}</div>
        </div>
        <div class="chevron">›</div>
      </div>

      <div class="card-content">

        <p><strong>🏠 Accommodation</strong><br>${item.accommodation || ""}</p>

        <p><strong>✈️ Travel</strong><br>${item.travel || ""}</p>

        <p><strong>🎯 Activities</strong></p>

        <div class="activities">
          ${(item.activities || "")
            .split(";")
            .map(a => a.trim())
            .filter(Boolean)
            .map(a => `<div class="activity-pill">📍 ${a}</div>`)
            .join("")}
        </div>

      </div>

      ${item.destination ? `
      <a
        class="map-button"
        href="https://maps.apple.com/?q=${encodeURIComponent(item.destination)}"
        target="_blank"
      >
        🗺️ Open in Maps
      </a>
  ` : ""}

    `;

    card.querySelector(".card-header").addEventListener("click", () => {
      card.classList.toggle("open");
    });

    container.appendChild(card);
  });

  setTimeout(() => {
  const todayCard = document.querySelector(".card.today");

  if (todayCard) {
      todayCard.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, 300);

  setTimeout(() => {
  const el = document.querySelector(".card.today");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}, 200);
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

loadAll();

function toKey(dateStr) {
  if (!dateStr) return "";

  const [d, m, y] = dateStr.trim().split("/");
  return `${y}-${m}-${d}`;
}