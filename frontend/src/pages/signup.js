import { useState } from "react";
import { useRouter } from "next/router"; 
import styles from '../styles/Signup.module.css';
import localFont from 'next/font/local';
import Link from "next/link";
import Head from "next/head";

const giants = localFont({
  src: [
    { path: '../fonts/Giants-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/Giants-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-giants',
});

const nanum = localFont({
  src: [
    { path: '../fonts/NanumSquareNeo-bRg.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/NanumSquareNeo-cBd.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-nanum',
});

export default function SignupPage() {
  const router = useRouter(); 

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "이름을 입력하세요.";
    if (!emailRegex.test(form.email)) newErrors.email = "올바른 이메일 형식을 입력하세요.";
    if (!form.phone.trim()) newErrors.phone = "전화번호를 입력하세요.";
    if (!passwordRegex.test(form.password)) newErrors.password = "비밀번호는 대소문자, 숫자, 특수문자를 포함해 6자 이상이어야 합니다.";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const res = await fetch("http://localhost:8000/api/users/register/", { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password1: form.password,
            password2: form.confirmPassword,
            username: form.name,
            phone: form.phone,
          }),
        });

        if (res.ok) {
          console.log("✅ 회원가입 성공!");
          alert("회원가입이 완료되었습니다!");
          router.push("/check-email");  
        } else {
          // 서버에서 어떤 에러 메시지를 보냈는지 보기 위해 전체 텍스트 출력
          const text = await res.text();
          console.error("❌ Raw error:", text);
        
          try {
            const data = JSON.parse(text); // JSON으로 변환 시도
            console.error("Parsed error:", data);
          } catch {
            console.error("응답이 JSON이 아닙니다:", text);
          }
        
          alert("회원가입에 실패했습니다. 입력 정보를 확인하세요.");
        }
        
      } catch (err) {
        console.error("서버 요청 오류:", err);
        alert("서버와의 연결에 문제가 발생했습니다.");
      }
    }
  };

  return (
    <>
      <Head>
        <title>SeatIn 회원가입</title>
      </Head>
      <div className={styles.signuppage}>
        <h1 className={`${styles.logo} ${giants.className}`}>
          Seat<span className={styles.logoHighlight}>In</span>
        </h1>

        <div className={`${styles.container} ${giants.variable} ${nanum.variable}`}>
          <div className={styles.box}>
            {/* 좌측 안내 */}
            <div className={styles.left}>
              <h2 className={`${styles.title} ${giants.className}`}>환영합니다!</h2>
              <p className={nanum.className}>회원이신가요?</p>
              <Link href="/login">
                <button className={`${styles.loginBtn} ${giants.className}`}>로그인</button>
              </Link>
            </div>

            {/* 우측 회원가입 박스 */}
            <div className={styles.right}>
              <h2 className={`${styles.subtitle} ${giants.className}`}>계정 생성하기</h2>

              <input name="name" type="text" placeholder="name" value={form.name} onChange={handleChange} className={styles.input} />
              {errors.name && <p className={styles.error}>{errors.name}</p>}

              <input name="email" type="email" placeholder="email" value={form.email} onChange={handleChange} className={styles.input} />
              {errors.email && <p className={styles.error}>{errors.email}</p>}

              <input name="phone" type="tel" placeholder="phone" value={form.phone} onChange={handleChange} className={styles.input} />
              {errors.phone && <p className={styles.error}>{errors.phone}</p>}

              <input name="password" type="password" placeholder="password" value={form.password} onChange={handleChange} className={styles.input} />
              {errors.password && <p className={styles.error}>{errors.password}</p>}

              <input name="confirmPassword" type="password" placeholder="confirm password" value={form.confirmPassword} onChange={handleChange} className={styles.input} />
              {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}

              <button onClick={handleSubmit} className={`${styles.signupBtn} ${giants.className}`}>
                계정 생성
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
