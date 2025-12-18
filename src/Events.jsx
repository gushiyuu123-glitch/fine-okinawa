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

  return (
    <section id="events">
      <div className="wrap">
        <h2 className="section-title">次回パーティー</h2>

        <div id="eventGrid">
          {events.length === 0 && (
            <div className="party-card party-card--empty fade-up">
              <div className="party-card-inner">
                <p className="party-empty-main">現在受付中のイベントはありません</p>
                <p className="party-empty-sub">次回のお知らせをお待ちください。</p>
              </div>
            </div>
          )}

          {events.map((ev) => (
            <div key={ev.id} className="party-card fade-up">
              <div className="party-card-inner">
                {/* タイトル + ステータス */}
                <div className="party-card-header">
                  <h3 className="party-title">{ev.title}</h3>

                  <span
                    className={
                      `status-badge ` +
                      (ev.status === "受付中"
                        ? "status-badge--open"
                        : ev.status === "満席"
                        ? "status-badge--full"
                        : "status-badge--pending")
                    }>
                    {ev.status}
                  </span>
                </div>

                {/* 単発日付 */}
                {ev.date && (
                  <ul className="party-date-list">
                    <li className="party-date-item">
                      <span className="party-date-icon">🕒</span>
                      <span className="party-date-text">{ev.date}</span>
                    </li>
                  </ul>
                )}

                {/* 複数日付 */}
                {ev.multipleDates?.length > 0 && (
                  <ul className="party-date-list">
                    {ev.multipleDates.map((d, i) => (
                      <li key={i} className="party-date-item">
                        <span className="party-date-icon">🕒</span>
                        <span className="party-date-text">{d}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* 年齢 */}
                {ev.ages && (
                  <div className="party-meta">
                    <p className="party-ages">
                      <span>対象年代</span> {ev.ages}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
