import { useEffect, useRef } from "react"
import gsap from "gsap"
import Link from "next/link"

export default function MenuBar({ visible }) {
  const ref = useRef()

  useEffect(() => {
    if (visible) {
      gsap.to(ref.current, { opacity: 1, duration: 1.5, ease: "power2.inOut" })
    }
  }, [visible])

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "30vw",
        height: "100vh",
        background: "rgba(0,0,0,0.9)",
        color: "#fff",
        padding: "4vh 3vw",
        opacity: 0, 
        borderTopRightRadius: "100px",   
        borderBottomRightRadius: "100px", 
        overflow: "hidden",
        WebkitMaskImage: "radial-gradient(ellipse 100% 60% at left center, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "cover",

        maskImage: "radial-gradient(ellipse 100% 80% at left center, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 95%)",
        maskRepeat: "no-repeat",
        maskSize: "cover",
      }}
    >
      <h1 style={{ fontFamily: "sans-serif", marginBottom: "10vw" }}>
        <span style={{ color: "#fff" }}>Seat</span>
        <span style={{ color: "#00bcd4" }}>In</span>
      </h1>

      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "1.8vw" }}>
        <li style={{ margin: "7vh 0" }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none"}}>홈</Link>
          </li>
        <li style={{ margin: "7vh 0" }}>
          <Link href="/reservation" style={{ color: "inherit", textDecoration: "none"}}>경기 예매</Link>
        </li>
        <li style={{ margin: "7vh 0" }}>
          <Link href="/login" style={{ color: "inherit", textDecoration: "none"}}>로그인</Link>
        </li>
      </ul>
    </div>
    </div>
  )
}
