// =====================================================
//  FINE Okinawa — microCMS：次回パーティー情報
//  本番用・全部盛り・完全安定版
// =====================================================

// microCMS 設定
const SERVICE_ID = "fineokinawa";
const API_KEY = window.MICROCMS_KEY;
const ENDPOINT = "events";

// DOM 読み込み完了
document.addEventListener("DOMContentLoaded", () => {
  fetchEvents();
});

// =====================================================
// fade-up 適用
// =====================================================
function applyFadeUp() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("show");
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".fade-up").forEach((el) => io.observe(el));
}

// =====================================================
// 日付フォーマット（高級感演出）
// =====================================================
function formatDateJP(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;

  const youbi = ["日", "月", "火", "水", "木", "金", "土"];
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = youbi[date.getDay()];
  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");

  return `${y}年${m}月${d}日（${w}） ${hh}:${mm} 開催`;
}

// =====================================================
// ステータス → バッジ色変換
// =====================================================
function renderStatusBadge(statusRaw) {
  const status = statusRaw || "未設定";

  let badgeClass = "status-badge--pending";
  if (status.includes("受付")) {
    badgeClass = "status-badge--open";
  } else if (status.includes("満席") || status.includes("キャンセル")) {
    badgeClass = "status-badge--full";
  }

  return `<span class="status-badge ${badgeClass}">${status}</span>`;
}

// =====================================================
// microCMS API
// =====================================================
async function fetchEvents() {
  const url = `https://${SERVICE_ID}.microcms.io/api/v1/${ENDPOINT}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-MICROCMS-API-KEY": API_KEY,
      },
    });

    if (!res.ok) throw new Error("microCMS 接続エラー: " + res.status);

    const json = await res.json();
    console.log("イベントデータ:", json);

    if (!json || !Array.isArray(json.contents)) {
      renderEvents([]);
      applyFadeUp();
      return;
    }

    renderEvents(json.contents);
    applyFadeUp();

  } catch (err) {
    console.error("イベント取得エラー:", err);
    renderEvents([]);
    applyFadeUp();
  }
}

// =====================================================
// 描画（本文付き 完全版）
// =====================================================
function renderEvents(events) {
  const container = document.getElementById("eventGrid");
  if (!container) return;
  container.innerHTML = "";

  // ---- 0件 ----
  if (!events || events.length === 0) {
    container.innerHTML = `
      <div class="party-card card fade-up party-card--empty">
        <div class="party-card-inner">
          <p class="party-empty-main">現在、公開中のパーティーはありません。</p>
          <p class="party-empty-sub">次回開催が決まり次第、こちらでご案内いたします。</p>
        </div>
      </div>
    `;
    return;
  }

  // ---- イベントあり ----
  events.forEach((ev) => {
    const card = document.createElement("div");
    card.className = "party-card card fade-up";

    // 日付
    const dates = [];
    if (ev.date) dates.push(ev.date);

    const dateListHTML =
      dates.length > 0
        ? `
      <ul class="party-date-list">
        ${dates
          .map(
            (d) => `
          <li class="party-date-item">
            <span class="party-date-icon">🕒</span>
            <span class="party-date-text">${formatDateJP(d)}</span>
          </li>
        `
          )
          .join("")}
      </ul>
    `
        : `
      <p class="party-date-empty">
        <small>開催日調整中です。</small>
      </p>
    `;

    // 本文（microCMS リッチエディタ）
    const bodyHTML = ev.body
      ? `<div class="party-desc">${ev.body}</div>`
      : "";

    card.innerHTML = `
      <div class="party-card-inner">
        <div class="party-card-header">
          <h3 class="party-title">${ev.title ?? "タイトル未設定"}</h3>
          ${renderStatusBadge(ev.status)}
        </div>

        ${dateListHTML}

        ${bodyHTML}
      </div>
    `;

    container.appendChild(card);
  });
}
