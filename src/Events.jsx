// src/components/Events.jsx
import { useEffect, useState } from "react";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          "https://fineokinawa.microcms.io/api/v1/events",
          {
            headers: {
              "X-MICROCMS-API-KEY": import.meta.env.VITE_MICROCMS_KEY,
            },
          }
        );

        const json = await res.json();
        setEvents(json.contents);
      } catch (e) {
        console.error("イベント取得エラー:", e);
      }
    };

    fetchEvents();
  }, []);

  // ---- 日付を日本形式に整える ----
  const formatDateJP = (raw) => {
    if (!raw) return "";
    const d = new Date(raw);
    if (isNaN(d)) return raw;

    const youbi = ["日","月","火","水","木","金","土"];
    return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日（${
      youbi[d.getDay()]
    }）`;
  };

  return (
    <section id="events">
      <div className="wrap">
        <h2 className="section-title">次回パーティー</h2>

        <div id="eventGrid">
          {/* イベント0件 */}
          {events.length === 0 && (
            <div className="party-card party-card--empty fade-up">
              <div className="party-card-inner">
                <p className="party-empty-main">現在受付中のイベントはありません</p>
                <p className="party-empty-sub">次回のお知らせをお待ちください。</p>
              </div>
            </div>
          )}

          {/* イベント一覧 */}
          {events.map((ev) => (
            <div key={ev.id} className="party-card fade-up">
              <div className="party-card-inner">
                {/* タイトル */}
                <h3 className="party-title">{ev.title}</h3>

                {/* 開催日 */}
                {ev.date && (
                  <p className="party-date">
                    🕒 {formatDateJP(ev.date)}
                  </p>
                )}

                {/* 本文（HTML） */}
                {ev.body && (
                  <div
                    className="party-body"
                    dangerouslySetInnerHTML={{ __html: ev.body }}
                  ></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
