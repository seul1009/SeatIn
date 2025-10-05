import { loadTossPayments } from "@tosspayments/payment-sdk";
import { useState } from "react";
import styles from "../styles/Pay.module.css";

export default function PayPage() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY
      );

      if (!tossPayments || typeof tossPayments.requestPayment !== "function") {
        throw new Error("TossPayments SDK 로드 실패!");
      }

      await tossPayments.requestPayment("카드", {
        amount: 1000,
        orderId: "order_" + new Date().getTime(),
        orderName: "SeatIn 티켓",
        successUrl: "http://localhost:3000/pay_success",
        failUrl: "http://localhost:3000/pay_fail",
      });
    } catch (error) {
      console.error("결제 요청 실패:", error);
      alert("결제를 진행할 수 없습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>SeatIn</h1>
        <p className={styles.subtitle}>
          선택하신 경기 좌석 결제를 진행해 주세요.
        </p>

        <div className={styles.orderBox}>
          <p className={styles.orderTitle}>주문 정보</p>
          <p className={styles.orderItem}>경기명: <b>2025 축구 경기</b></p>
          <p className={styles.orderItem}>좌석: A구역 12열 5번</p>
          <p className={styles.orderItem}>금액: <b>1,000원</b></p>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={styles.payButton}
        >
          {loading ? "결제 진행 중..." : "Toss로 결제하기"}
        </button>

        <p className={styles.notice}>
          결제는 TossPayments를 통해 안전하게 진행됩니다.
        </p>
      </div>
    </div>
  );
}
