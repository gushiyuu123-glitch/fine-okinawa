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

        <div className="event-grid">
          {events.map((ev) => (
            <div key={ev.id} className="card fade-up">
              <h3>{ev.title}</h3>

              {/* ▼ 単発開催日 */}
              {ev.date && (
                <p>
                  <strong>{ev.date}</strong>
                </p>
              )}

              {/* ▼ 複数開催日 */}
              {ev.multipleDates?.map((d, i) => (
                <p key={i}>
                  <strong>{d}</strong>
                </p>
              ))}

              {/* ▼ ステータス */}
              <p>（{ev.status}）</p>

              {/* ▼ 対象年齢（空なら表示しない） */}
              {ev.ages && (
                <p>
                  <small>対象年代：{ev.ages}</small>
                </p>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 40,
            textAlign: "center",
            color: "var(--sub)",
          }}
        >
          <p>参加費｜男性 5,000円 ／ 女性 1,000円（ドリンク付き）</p>
          <p>場所｜浦添ショッピングセンター近く（無料駐車場完備）</p>
          <p>前回・前々回とも 8対8 前後でゆったり開催</p>
        </div>
      </div>
    </section>
  );
}
