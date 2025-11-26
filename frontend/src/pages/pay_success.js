import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/PaySuccess.module.css";
import Navbar from "../components/Navbar";

export default function PaySuccessPage() {
  const router = useRouter();
  const { paymentKey, orderId, amount, matchId, seat, section } = router.query;
  const [response, setResponse] = useState(null);
  const [matchTitle, setMatchTitle] = useState("");
  
  useEffect(() => {
    if (paymentKey) {
      fetch("http://localhost:8000/api/payments/confirm/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("access")}`,
         },
        body: JSON.stringify({ paymentKey, orderId, amount, matchId }),
      })
        .then((res) => res.json())
        .then((data) => setResponse(data))
        .catch((err) => console.error(err));
    }
  }, [paymentKey]);

  useEffect(() => {
    if (!matchId) return;
    fetch(`http://localhost:8000/api/match/${matchId}/`)
      .then((res) => res.json())
      .then((data) => setMatchTitle(data?.title || ""))
      .catch(() => {});
  }, [matchId]);

  useEffect(() => {
  console.log("💡 router.query:", router.query);
}, [router.query]);


  const formattedDate = new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <>
      <Navbar />
      <main className={styles.container}>
        <div className={styles.card}>
          <div className={styles.hero}>
            <img
              width="110"
              src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
              alt="success"
              className={styles.icon}
            />
            <div>
              <p className={styles.kicker}>Payment Complete</p>
              <h1>결제가 완료되었습니다</h1>
              <p className={styles.sub}>예매 내역은 마이페이지에서 언제든 확인할 수 있어요.</p>
            </div>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoRow}>
              <span>경기명</span>
              <strong>{matchTitle || matchId || "-"}</strong>
            </div>
          <div className={styles.infoRow}>
            <span>결제 금액</span>
            <strong>{Number(amount || 0).toLocaleString()} 원</strong>
          </div>
          <div className={styles.infoRow}>
            <span>좌석</span>
            <strong>{section ? `${section} ` : ""}{seat || "-"}</strong>
          </div>
            <div className={styles.infoRow}>
              <span>결제 일시</span>
              <strong>{formattedDate}</strong>
            </div>
            <div className={styles.infoRow}>
              <span>주문 번호</span>
              <strong>{orderId}</strong>
            </div>
            <div className={styles.infoRow}>
              <span>결제 수단</span>
              <strong>{response?.method || "카드"}</strong>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.primary} onClick={() => router.push("/mypage/pay")}>예매 내역 확인</button>
            <button className={styles.secondary} onClick={() => router.push("/home")}>홈으로 돌아가기</button>
          </div>
        </div>
      </main>
    </>
  );
}
