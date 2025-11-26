import { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { useRouter } from "next/router";
import styles from "../styles/Pay.module.css";
import Navbar from "../components/Navbar";

export default function PaymentPage() {
  const router = useRouter();
  const { matchId, seat, section } = router.query;
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const seatLabel = seat || "좌석 정보가 없습니다.";
  const sectionLabel = section ? `섹션 ${section}` : null;

  useEffect(() => {
    if (!matchId) return;
    fetch(`http://localhost:8000/api/match/${matchId}/`)
      .then((res) => res.json())
      .then((data) => setMatch(data))
      .catch((err) => console.error(err));
  }, [matchId]);

  const handlePayment = async () => {
    if (!match) return alert("경기 정보를 불러오는 중입니다.");

    try {
      setLoading(true);
      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY
      );

      const orderId = "order_" + new Date().getTime();
      const amount = 15000;

      await tossPayments.requestPayment("카드", {
        amount,
        orderId,
        orderName: `${match.title}${seat ? ` - ${seat}` : ""}`,
        successUrl: `http://localhost:3000/pay_success?matchId=${match.id}${
          seat ? `&seat=${encodeURIComponent(seat)}` : ""
        }${section ? `&section=${encodeURIComponent(section)}` : ""}`,
        failUrl: "http://localhost:3000/pay_fail",
      });
    } catch (e) {
      console.error("결제 요청 실패:", e);
      alert("결제 요청 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!match) {
    return (
      <>
        <Navbar />
        <div className={styles.page}>
          <div className={styles.loadingCard}>경기 정보를 불러오는 중...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.shell}>
          <header className={styles.header}>
            <div>
              <p className={styles.kicker}>Match Booking</p>
              <h1 className={styles.title}>예매 내용 확인 후 결제해주세요</h1>
            </div>
            <p className={styles.badge}>{match.category}</p>
          </header>

          <div className={styles.grid}>
            <section className={styles.matchCard}>
              <div className={styles.logoRow}>
                <img
                  src={match.poster1_url || `http://127.0.0.1:8000${match.poster1}`}
                  alt="팀 로고"
                  className={styles.teamLogo}
                />
                <span className={styles.vs}>VS</span>
                <img
                  src={match.poster2_url || `http://127.0.0.1:8000${match.poster2}`}
                  alt="팀 로고"
                  className={styles.teamLogo}
                />
              </div>

              <div className={styles.matchMeta}>
                <h2>{match.title}</h2>
                <p className={styles.metaPrimary}>{new Date(match.date).toLocaleString("ko-KR", {
                  timeZone: "Asia/Seoul",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}</p>
                <p className={styles.metaSecondary}>{match.location}</p>
              </div>

              <div className={styles.detailList}>
                <div className={styles.detailItem}>
                  <span>좌석</span>
                  <strong>{sectionLabel ? `${sectionLabel} ` : ""}{seatLabel}</strong>
                </div>
                <div className={styles.detailItem}>
                  <span>인원</span>
                  <strong>1명</strong>
                </div>
              </div>
            </section>

            <section className={styles.paymentCard}>
              <div className={styles.paymentHeader}>
                <p className={styles.kicker}>Payment</p>
                <h3>결제 정보</h3>
                <p className={styles.helpText}>카드 결제 시 안전하게 Toss Payments로 연결됩니다.</p>
              </div>

              <div className={styles.summaryRow}>
                <span>티켓 금액</span>
                <strong>15,000원</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>수수료</span>
                <strong>0원</strong>
              </div>
              <div className={styles.totalRow}>
                <span>총 결제 금액</span>
                <strong>15,000원</strong>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className={styles.payButton}
              >
                {loading ? "결제 진행 중..." : "Toss로 결제하기"}
              </button>

              <p className={styles.secureText}>• 결제 완료 후 마이페이지 &gt; 예매내역에서 확인할 수 있습니다.</p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
