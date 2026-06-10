const GROUP_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrOrx9JCZmqS8XhlDz2ueR2ewAaPBGFwrfg_LLccxcW_pqREW8OiHzHupgn8RSpz1HHCia6RFZ0d-t/pub?gid=0&single=true&output=csv";
const FIRST_PLACE_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrOrx9JCZmqS8XhlDz2ueR2ewAaPBGFwrfg_LLccxcW_pqREW8OiHzHupgn8RSpz1HHCia6RFZ0d-t/pub?gid=1076669321&single=true&output=csv";
const SECOND_PLACE_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrOrx9JCZmqS8XhlDz2ueR2ewAaPBGFwrfg_LLccxcW_pqREW8OiHzHupgn8RSpz1HHCia6RFZ0d-t/pub?gid=557909970&single=true&output=csv";


let selectedOutcome = "first";

const container = document.getElementById("days");

function toKey(dateStr) {
  const parts = (dateStr || "").trim().split("/");
  if (parts.length !== 3) return "";
  const [d, m, y] = parts;
  return `${y}-${m}-${d}`;
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${
    String(d.getMonth() + 1).padStart(2, "0")
  }-${
    String(d.getDate()).padStart(2, "0")
  }`;
}

async function fetchSheet(url) {
  const res = await fetch(url);
  const text = await res.text();

  return text
    .trim()
    .split("\n")
    .slice(1)
    .map(r => r.split(","))
    .filter(c => c[0] && c[0].trim())
    .map(c => ({
      day: c[0]?.trim(),
      date: c[1]?.trim(),
      weekday: c[2]?.trim(),
      accommodation: c[3]?.trim(),
      travel: c[4]?.trim(),
      activities: c[5]?.trim(),
      destination: c[6]?.trim()
    }));
}

async function loadAll() {
  const group = await fetchSheet(GROUP_URL);

  const url =
    selectedOutcome === "first"
      ? FIRST_PLACE_URL
      : SECOND_PLACE_URL;

  const outcome = await fetchSheet(url);

  render([...group, ...outcome]);
}

function render(itinerary) {
  container.innerHTML = "";

  const today = getTodayKey();

  itinerary.forEach(item => {
    const isToday = toKey(item.date) === today;

    const card = document.createElement("div");
    card.className = "card" + (isToday ? " today" : "");

    card.innerHTML = `
      <div class="card-header">
        <div>
          <div class="day-title">${item.day}</div>
          <div>${item.weekday || ""} ${item.date || ""}</div>
        </div>
        <div>›</div>
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

        ${item.destination ? `
          <div class="map-link">
            🗺️ <span>View location</span>
          </div>
        ` : ""}

      </div>
    `;

    card.querySelector(".card-header").addEventListener("click", () => {
      // close all other cards
      document.querySelectorAll(".card").forEach(c => {
        if (c !== card) c.classList.remove("open");
      });

      // toggle current card
      card.classList.toggle("open");
    });

    const mapLink = card.querySelector(".map-link");

    if (mapLink) {
      mapLink.addEventListener("click", () => {
        window.open(
          `https://maps.apple.com/?q=${encodeURIComponent(item.destination)}`,
          "_blank"
        );
      });
    }

    container.appendChild(card);
  });
}

loadAll();