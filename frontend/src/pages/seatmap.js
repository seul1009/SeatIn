import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import StadiumScene from "../components/StadiumScene";
import Navbar from "../components/Navbar";
import styles from "../styles/SeatMap.module.css";  

export default function SeatMap() {
  const router = useRouter();
  const { matchId } = router.query;
  const [sections, setSections] = useState(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]);
  const [seats, setSeats] = useState([]);
  const [currentSection, setCurrentSection] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showView, setShowView] = useState(false);
  const [mapSize, setMapSize] = useState({ width: 1000, height: 600 });
  const [match, setMatch] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (!mapRef.current) return;
      const { width, height } = mapRef.current.getBoundingClientRect();
      setMapSize({ width, height });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const { width, height } = mapRef.current.getBoundingClientRect();
    setMapSize({ width, height });
  }, [currentSection, seats.length]);

  const fetchSeats = async (section) => {
    try {
      const res = await fetch(`http://localhost:8000/api/seats/?section=${section}`);
      if (!res.ok) throw new Error("좌석 데이터를 불러오지 못했습니다.");
      const data = await res.json();
      setSeats(data);
      setCurrentSection(section);
    } catch (err) {
      console.error("좌석 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    if (!matchId) return;
    fetch(`http://localhost:8000/api/match/${matchId}/`)
      .then((res) => res.json())
      .then((data) => setMatch(data))
      .catch(() => {});
  }, [matchId]);

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
    setShowView(true);
  };

  const handleCloseView = () => {
    setShowView(false);
    setSelectedSeat(null);
  };

  const { width: mapWidth, height: mapHeight } = mapSize;
  const seatPaddingX = 40; // 좌우 여백
  const seatPaddingY = 40; // 상하 여백
  const seatScaleX = 1;  
  const seatScaleY = 0.75; 

  const minX = seats.length ? Math.min(...seats.map((s) => s.x)) : 0;
  const maxX = seats.length ? Math.max(...seats.map((s) => s.x)) : 1;
  const minY = seats.length ? Math.min(...seats.map((s) => s.y)) : 0;
  const maxY = seats.length ? Math.max(...seats.map((s) => s.y)) : 1;


  const toScreenX = (x) => {
    const usableWidth = Math.max(mapWidth - seatPaddingX * 2, 0);
    const baseX = seatPaddingX + ((x - minX) / (maxX - minX || 1)) * usableWidth;
    const centerX = mapWidth / 2;
    return centerX + (baseX - centerX) * seatScaleX; // seatScale 적용
  };

  const toScreenY = (y) => {
    const usableHeight = Math.max(mapHeight - seatPaddingY * 2, 0);
    const baseY = seatPaddingY + ((y - minY) / (maxY - minY || 1)) * usableHeight;
    const centerY = mapHeight / 2;
    return centerY + (baseY - centerY) * seatScaleY; // seatScale 적용
  };


  const seatLabel = useMemo(
    () => selectedSeat?.seat_id || selectedSeat?.name || selectedSeat?.id,
    [selectedSeat]
  );

  const handleGoPayment = () => {
    if (!matchId || !seatLabel) return;
    const params = new URLSearchParams({ matchId, seat: seatLabel });
    if (currentSection) params.append("section", currentSection);
    router.push(`/pay?${params.toString()}`);
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <header className={styles.heroBar}>
          <button className={styles.pageBackBtn} onClick={() => router.back()}>
            ← 이전으로
          </button>
          <div className={styles.heroMain}>
            <p className={styles.kicker}>좌석을 선택하세요</p>
            <h1>{match?.title || "관람할 경기를 선택했어요"}</h1>
            <p className={styles.subText}>{match?.location}</p>
          </div>
          <div className={styles.heroMeta}>
            <span>{currentSection ? `섹션 ${currentSection}` : "경기 날짜"}</span>
            <strong>{new Date(match?.date || Date.now()).toLocaleString("ko-KR", {
              timeZone: "Asia/Seoul",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}</strong>
          </div>
        </header>

        {!currentSection && (
          <div className={styles.sectionChooser}>
            <h2 className={styles.title}>구역을 선택하세요</h2>

            <div className={styles.sectionRow}>
              {sections.slice(0, 5).map((sec) => (
                <button
                  key={sec}
                  onClick={() => fetchSeats(sec)}
                  className={styles.sectionBtn}
                >
                  {sec}
                </button>
              ))}
            </div>

            <div className={styles.mapWrapper}>
              <img src="/images/map.png" alt="stadium map" className={styles.mapImage} />
            </div>

            <div className={styles.sectionRow}>
              {sections.slice(5).map((sec) => (
                <button
                  key={sec}
                  onClick={() => fetchSeats(sec)}
                  className={styles.sectionBtn}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentSection && (
          <div className={styles.mapArea} ref={mapRef}>
            <button
              onClick={() => {
                setCurrentSection(null);
                setSeats([]);
                setSelectedSeat(null);
              }}
              className={styles.backBtn}
            >
              ← 다른 구역 선택
            </button>

            <h2 className={styles.guideText}>
              좌석을 선택하면 해당 좌석의 시야를 확인할 수 있습니다.
            </h2>

            {seats.map((seat) => (
              <button
                key={seat.seat_id || seat.id}
                title={seat.seat_id || seat.id}
                onClick={() => handleSeatClick(seat)}
                className={`${styles.seatBtn} ${
                  seatLabel && seatLabel === (seat.seat_id || seat.id)
                    ? styles.selectedSeat
                    : ""
                }`}
                style={{
                  left: `${toScreenX(seat.x)}px`,
                  top: `${toScreenY(seat.y)}px`,
                }}
              />
            ))}

            {showView && (
              <div className={styles.viewModal}>
                <button onClick={handleCloseView} className={styles.closeBtn}>
                  ✕
                </button>
                <StadiumScene selectedSeat={selectedSeat} />
              </div>
            )}
          </div>
        )}

        <div className={styles.actionBar}>
          <div>
            <p className={styles.barLabel}>선택한 좌석</p>
            <strong className={styles.barValue}>
              {seatLabel ? `${currentSection || ""} ${seatLabel}`.trim() : "좌석을 선택해주세요"}
            </strong>
          </div>
          <button
            className={styles.payCta}
            disabled={!seatLabel}
            onClick={handleGoPayment}
          >
            결제 단계로 이동
          </button>
        </div>
      </div>
    </>
  );
}
