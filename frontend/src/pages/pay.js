import { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { useRouter } from "next/router";
import styles from "../styles/Pay.module.css";

export default function PaymentPage() {
  const router = useRouter();
  const { matchId } = router.query; 
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(false);

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
        orderName: match.title,
        successUrl: `http://localhost:3000/pay_success?orderId=${orderId}&amount=${amount}&method=toss`,
        failUrl: "http://localhost:3000/pay_fail",
      });
    } catch (e) {
      console.error("결제 요청 실패:", e);
      alert("결제 요청 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!match) return <div className={styles.loading}>경기 정보를 불러오는 중...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>경기 결제 확인</h1>
        <p className={styles.subtitle}>
          아래 경기 정보를 확인 후 결제를 진행하세요.
        </p>

        <div className={styles.infoBox}>
          <p><b>경기명:</b> {match.title}</p>
          <p><b>카테고리:</b> {match.category}</p>
          <p><b>일시:</b> {new Date(match.date).toLocaleString()}</p>
          <p><b>장소:</b> {match.location}</p>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={styles.payButton}
        >
          {loading ? "결제 진행 중..." : "Toss로 결제하기"}
        </button>
      </div>
    </div>
  );
}
