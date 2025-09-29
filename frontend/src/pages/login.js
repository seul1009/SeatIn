import styles from '../styles/Login.module.css';
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

export default function LoginPage() {
    return (
        <div className={styles.loginpage}>
            {/* 좌측 상단 로고 */}
            <h1 className={`${styles.logo} ${giants.variable}`}>
                Seat<span className={styles.logoHighlight}>In</span>
            </h1>
            <div className={`${styles.container} ${giants.variable} ${nanum.variable}`}>
                
                <div className={styles.box}>
                    {/* 좌측 로그인 박스 */}
                    <div className={styles.loginLeft}>
                        <h2 className={`${styles.title} ${giants.className}`}>로그인</h2>
                        <div className={styles.socials}>
                            <img src="/google.png" alt="google" />
                            <img src="/kakao.png" alt="kakao" />
                            <img src="/naver.png" alt="naver" />
                        </div>
                        <input type="email" placeholder="email" className={styles.input} />
                        <input type="password" placeholder="password" className={styles.input} />
                        <a href="#" className={styles.findPw}>비밀번호 찾기</a>
                        <button className={`${styles.loginBtn} ${giants.className}`}>로그인</button>
                    </div>

                    {/* 우측 회원가입 박스 */}
                    <div className={styles.loginRight}>
                        <h2 className={`${styles.welcome} ${giants.className}`}>안녕하세요!</h2>
                        <p className={nanum.className}>아직 회원이 아니신가요?</p>
                        <button className={`${styles.signupBtn} ${giants.className}`}>회원가입</button>
                    </div>
                </div>
            </div>
        </div>

    );
}