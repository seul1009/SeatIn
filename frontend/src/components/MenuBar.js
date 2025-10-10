import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import gsap from "gsap";
import Link from "next/link";
import Logo from "../components/Logo";

export default function MenuBar({ visible }) {
  const ref = useRef();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token); // 있으면 true, 없으면 false
  }, []);

  // ✅ 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다!");
    router.push("/login");
  };

  // ✅ 애니메이션
  useEffect(() => {
    if (visible) {
      gsap.to(ref.current, { opacity: 1, duration: 1.5, ease: "power2.inOut" });
    }
  }, [visible]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "20vw",
        height: "100vh",
        background: "#fff",
        color: "#000",
        padding: "4vh 3vw",
        opacity: 0,
        borderTopRightRadius: "100px",
        borderBottomRightRadius: "100px",
        overflow: "hidden",
        WebkitMaskImage:
          "radial-gradient(ellipse 100% 60% at left center, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "cover",
        maskImage:
          "radial-gradient(ellipse 100% 80% at left center, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 95%)",
        maskRepeat: "no-repeat",
        maskSize: "cover",
      }}
    >
      <Logo/>

      <div style={{ flex: 1, display: "flex", alignItems: "center"}}>
        <ul
          style={{
            listStyle: "none",
            display: "flex", 
            flexDirection: "column",  // 세로로 정렬
            gap: "20px",
            paddingTop: 30,
            fontSize: "20px",
          }}
        >
          <li style={{ margin: "7vh 0" }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              홈
            </Link>
          </li>
          <li style={{ margin: "7vh 0" }}>
            <Link
              href="/reservation"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              경기 예매
            </Link>
          </li>

          {!isLoggedIn ? (
            // ✅ 로그인 안 했을 때
            <li style={{ margin: "7vh 0" }}>
              <Link
                href="/login"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                로그인
              </Link>
            </li>
          ) : (
            // ✅ 로그인 했을 때
            <>
              <li style={{ margin: "7vh 0" }}>
                <Link
                  href="/mypage"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  마이페이지
                </Link>
              </li>
              <li
                onClick={handleLogout}
                style={{
                  margin: "7vh 0",
                  cursor: "pointer",
                  color: "#f76c6c",
                  textDecoration: "none",
                }}
              >
                로그아웃
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
