import Link from "next/link";
import Head from "next/head";

export default function CheckEmailPage() {
  return (
    <>
      <Head>
        <title>SeatIn 이메일 인증 확인</title>
      </Head>
      <div style={{ textAlign: "center", marginTop: "150px" }}>
        <h1>📩 이메일 인증이 필요합니다</h1>
        <p>가입하신 이메일로 인증 메일을 보냈습니다.</p>
        <p>메일함을 확인하고 인증 링크를 클릭해주세요.</p>
        <p style={{ marginTop: "20px", color: "gray" }}>
          혹시 메일이 보이지 않나요? 스팸함을 확인하거나 잠시 후 다시 시도해주세요.
        </p>

        <Link href="/">
          <button style={{
            marginTop: "30px",
            padding: "10px 20px",
            backgroundColor: "#59CAD2",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}>
            홈으로 돌아가기
          </button>
        </Link>
      </div>
    </>

  );
}
