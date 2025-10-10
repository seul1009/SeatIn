import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PaySuccessPage() {
  const router = useRouter();
  const { paymentKey, orderId, amount } = router.query;
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (paymentKey) {
      fetch("http://localhost:8000/payments/confirm/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentKey, orderId, amount }),
      })
        .then(res => res.json())
        .then(data => setResponse(data));
    }
  }, [paymentKey]);

  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <link
          rel="icon"
          href="https://static.toss.im/icons/png/4x/icon-toss-logo.png"
        />
        <title>토스페이먼츠 샘플 프로젝트</title>
      </head>

      <body>
        <div
          className="box_section"
          style={{
            width: "600px",
            margin: "100px auto",
            fontFamily: "Pretendard, sans-serif",
            textAlign: "center",
          }}
        >
          <img
            width="100"
            src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
            alt="check"
          />
          <h2>결제를 완료했어요</h2>

          <div
            style={{
              marginTop: 50,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <b>결제금액</b>
            <span>{amount} 원</span>
          </div>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <b>주문번호</b>
            <span>{orderId}</span>
          </div>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "space-between",
              wordBreak: "break-all",
            }}
          >
            <b>PaymentKey</b>
            <span>{paymentKey}</span>
          </div>

          <div style={{ marginTop: 30, display: "flex", gap: "10px" }}>
            <button
              style={{
                backgroundColor: "#0064FF",
                color: "white",
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
              onClick={() =>
                (window.location.href =
                  "https://docs.tosspayments.com/guides/payment/integration")
              }
            >
              연동 문서
            </button>
            <button
              style={{
                backgroundColor: "#E8F3FF",
                color: "#1B64DA",
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
              onClick={() =>
                (window.location.href = "https://discord.gg/A4fRFXQhRu")
              }
            >
              실시간 문의
            </button>
          </div>

          {response && (
            <div
              className="box_section"
              style={{
                width: 600,
                marginTop: 50,
                textAlign: "left",
                wordBreak: "break-all",
              }}
            >
              <b>Response Data :</b>
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
