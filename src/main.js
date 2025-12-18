// =========================
//  FINE Okinawa — Simple Events
// =========================

const SERVICE_ID = "fineokinawa";
const API_KEY = window.MICROCMS_KEY;

document.addEventListener("DOMContentLoaded", () => {
  loadEvents();
});

// 日付フォーマット（大人向け）
function formatDateJP(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;

  const youbi = ["日","月","火","水","木","金","土"];
  return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日（${youbi[date.getDay()]}）`;
}

// イベント取得
async function loadEvents() {
  try {
    const res = await fetch(`https://${SERVICE_ID}.microcms.io/api/v1/events`, {
      headers: { "X-MICROCMS-API-KEY": API_KEY }
    });

    const json = await res.json();
    renderEvents(json.contents);
  } catch (err) {
    console.error(err);
    renderEvents([]);
  }
}

// 表示処理（超シンプル）
function renderEvents(events) {
  const container = document.getElementById("eventGrid");
  container.innerHTML = "";

  if (!events.length) {
    container.innerHTML = `<p>現在予定されているパーティーはありません。</p>`;
    return;
  }

  events.forEach(ev => {
    const card = document.createElement("div");
    card.className = "event-card fade-up";

    card.innerHTML = `
      <h3 class="event-title">${ev.title}</h3>
      <p class="event-date">🕒 ${formatDateJP(ev.date)}</p>
      <div class="event-body">
        ${ev.body || ""}
      </div>
    `;

    container.appendChild(card);
  });
}
