import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Login.module.css";
import localFont from "next/font/local";
import Link from "next/link";
import Head from "next/head";

const giants = localFont({
  src: [
    { path: "../fonts/Giants-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Giants-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-giants",
});

const nanum = localFont({
  src: [
    { path: "../fonts/NanumSquareNeo-bRg.ttf", weight: "400", style: "normal" },
    { path: "../fonts/NanumSquareNeo-cBd.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-nanum",
});

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // 로그인 성공
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        alert("로그인 성공!");
        router.push("/");
      } else {
        // 백엔드에서 보낸 메시지 확인
        if (data.detail === "이메일 인증을 완료해야 로그인할 수 있습니다.") {
          alert("이메일 인증을 먼저 완료해주세요!");
        } else {
          alert("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
      }
    } catch (err) {
      console.error("서버 오류:", err);
      alert("서버 연결에 문제가 발생했습니다.");
    }
  };

  return (
    <>
      <Head>
        <title>SeatIn 로그인</title>
      </Head>
      <div className={styles.loginpage}>
        <h1 className={`${styles.logo} ${giants.variable}`}>
          Seat<span className={styles.logoHighlight}>In</span>
        </h1>
        <div className={`${styles.container} ${giants.variable} ${nanum.variable}`}>
          <div className={styles.box}>
            <div className={styles.loginLeft}>
              <h2 className={`${styles.title} ${giants.className}`}>로그인</h2>

              <input
                type="email"
                placeholder="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <a href="#" className={styles.findPw}>
                비밀번호 찾기
              </a>

              <button
                onClick={handleLogin}
                className={`${styles.loginBtn} ${giants.className}`}
              >
                로그인
              </button>
            </div>

            <div className={styles.loginRight}>
              <h2 className={`${styles.welcome} ${giants.className}`}>안녕하세요!</h2>
              <p className={nanum.className}>아직 회원이 아니신가요?</p>
              <Link href="/signup">
                <button className={`${styles.signupBtn} ${giants.className}`}>
                  회원가입
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
