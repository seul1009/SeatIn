import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../styles/home.module.css";
import Logo from "../components/Logo";

const banners = ["/images/banner1.png", "/images/banner2.png", "/images/banner3.png"];
const categories = ["전체", "축구", "야구", "농구", "해외축구"];

export default function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [activeCategory, setActiveCategory] = useState("축구");
  const [matches, setMatches] = useState([]);

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/match/")
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch((err) => console.error("데이터 불러오기 실패:", err));
  }, []);

  const filteredMatches =
    activeCategory === "전체"
      ? matches
      : matches.filter((match) => match.category === activeCategory);


  return (
    <main className={styles["home-container"]}>
      {/* 상단 네비게이션 */}
      <header className={styles.navbar}>
        <Logo />

        <div className={styles["search-bar"]}>
          <input type="text" placeholder="공연, 경기, 지역 검색" />
        </div>

        <nav className={styles["nav-links"]}>
          <Link href="/login">로그인</Link>
          <Link href="/signup">회원가입</Link>
          <Link href="/help">고객센터</Link>
        </nav>
      </header>

      {/* 배너 */}
      <section className={styles["banner-section"]}>
        <Image src={banners[currentBanner]} alt="배너" fill className={styles["banner-image"]} />
        <button onClick={prevBanner} className={`${styles["banner-btn"]} ${styles.left}`}>
          <ChevronLeft />
        </button>
        <button onClick={nextBanner} className={`${styles["banner-btn"]} ${styles.right}`}>
          <ChevronRight />
        </button>
      </section>

      {/* 카테고리 */}
      <section className={styles["category-section"]}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`${styles["category-btn"]} ${activeCategory === cat ? styles.active : ""}`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* 경기 목록 */}
      <section className={styles["match-list"]}>
        <h1>경기 목록</h1>
        <div className={styles["match-grid"]}>
          {filteredMatches.length > 0 ? (
            filteredMatches.map((match) => (
              <div key={match.id} className={styles["match-card"]}>
                <img src={match.poster} alt={match.title} />
                <div className={styles.info}>
                  <p>{match.title}</p>
                  <p>{match.category}</p>
                  <p>{match.location}</p>
                  <p>{match.date}</p>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.loading}>데이터를 불러오는 중입니다...</p>
          )}
        </div>
      </section>
    </main>
  );
}
