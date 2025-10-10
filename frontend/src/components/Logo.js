import Link from "next/link";

const logoStyle = {
  textDecoration: "none",
  fontSize: "2.3rem",
  fontWeight: "700",
  color: "#1e40af", 
  fontFamily: "sans-serif",
};

const spanStyle = {
  color: "#f97316", 
};

export default function Logo() {
  return (
    <Link href="/" style={logoStyle}>
      Seat<span style={spanStyle}>In</span>
    </Link>
  );
}