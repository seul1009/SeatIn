import styles from '../styles/Signup.module.css';
import localFont from 'next/font/local';

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
  return (
    <div className={styles.signuppage}>
      {/* 좌측 상단 로고 */}
      <h1 className={`${styles.logo} ${giants.className}`}>
        Seat<span className={styles.logoHighlight}>In</span>
      </h1>

      <div className={`${styles.container} ${giants.variable} ${nanum.variable}`}>
        <div className={styles.box}>
          {/* 좌측 안내 */}
          <div className={styles.left}>
            <h2 className={`${styles.title} ${giants.className}`}>환영합니다!</h2>
            <p className={nanum.className}>회원이신가요?</p>
            <button className={`${styles.loginBtn} ${giants.className}`}>로그인</button>
          </div>

          {/* 우측 회원가입 박스 */}
          <div className={styles.right}>
            <h2 className={`${styles.subtitle} ${giants.className}`}>계정 생성하기</h2>
            <input type="text" placeholder="name" className={styles.input} />
            <input type="email" placeholder="email" className={styles.input} />
            <input type="password" placeholder="password" className={styles.input} />
            <input type="password" placeholder="confirm password" className={styles.input} />
            <button className={`${styles.signupBtn} ${giants.className}`}>계정 생성</button>
          </div>
        </div>
      </div>
    </div>
  );
}
