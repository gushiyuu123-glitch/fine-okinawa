// =====================================================
//  FINE Okinawa — microCMS：次回パーティー情報
//  全部盛り・本番用 完全版
// =====================================================

// microCMS 設定
const SERVICE_ID = "fineokinawa";
const API_KEY = window.MICROCMS_KEY;
const ENDPOINT = "events";

// DOM 読み込み完了でスタート
document.addEventListener("DOMContentLoaded", () => {
  fetchEvents();
});

// =====================================================
// ① fade-up を適用する関数（描画後に実行）
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
// ② ノア最適化：日付フォーマット（大人向けラグジュアリー）
// =====================================================
function formatDateJP(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return dateString; // 保険で元の文字列を返す

  const youbi = ["日", "月", "火", "水", "木", "金", "土"];
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const w = youbi[date.getDay()];
  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");

  return `${y}年${m}月${d}日（${w}）${hh}:${mm} 開催`;
}

// =====================================================
// ③ ステータスをバッジにする（受付中 / 満席 / 調整中…）
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
// ④ イベント取得
// =====================================================
async function fetchEvents() {
  const url = `https://${SERVICE_ID}.microcms.io/api/v1/${ENDPOINT}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-MICROCMS-API-KEY": API_KEY,
      },
    });

    if (!res.ok) throw new Error("microCMS 接続エラー（status: " + res.status + ")");

    const json = await res.json();
    console.log("APIレスポンス:", json);

    if (!json || !Array.isArray(json.contents)) {
      console.error("microCMS 形式エラー:", json);
      renderEvents([]);
      applyFadeUp();
      return;
    }

    renderEvents(json.contents);
    applyFadeUp(); // 描画後に fade-up 再適用（超重要）

  } catch (err) {
    console.error("イベント取得エラー:", err);
    renderEvents([]);
    applyFadeUp();
  }
}

// =====================================================
// ⑤ HTML に描画（カードデザイン全部盛り）
// =====================================================
function renderEvents(events) {
  const container = document.getElementById("eventGrid");
  if (!container) return;

  container.innerHTML = "";

  // ---- イベント 0 件のとき ----
  if (!events || events.length === 0) {
    container.innerHTML = `
      <div class="party-card card fade-up party-card--empty">
        <div class="party-card-inner">
          <p class="party-empty-main">現在、公開中のパーティーはありません。</p>
          <p class="party-empty-sub">次回開催が決まり次第、こちらのページでご案内いたします。</p>
        </div>
      </div>
    `;
    return;
  }

  // ---- イベントがあるとき ----
  events.forEach((ev) => {
    const card = document.createElement("div");
    card.className = "party-card card fade-up";

    // 日付を一旦配列にまとめる
    const dates = [];

    if (ev.date) {
      dates.push(ev.date);
    }

    if (Array.isArray(ev.multipleDates)) {
      ev.multipleDates.forEach((d) => {
        if (d?.date) {
          dates.push(d.date);
        }
      });
    }

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
        <small>開催日調整中です。決まり次第こちらに掲載いたします。</small>
      </p>
    `;

    const ages = ev.ages || "指定なし";

    card.innerHTML = `
      <div class="party-card-inner">
        <div class="party-card-header">
          <h3 class="party-title">${ev.title ?? "タイトル未設定"}</h3>
          ${renderStatusBadge(ev.status)}
        </div>

        ${dateListHTML}

        <div class="party-meta">
          <p class="party-ages">
            <span>対象年代</span>
            ${ages}
          </p>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}
