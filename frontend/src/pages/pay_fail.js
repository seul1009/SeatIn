import { useRouter } from "next/router";

export default function PayFailPage() {
  const router = useRouter();
  const { message, code } = router.query;

  return (
    <div>
      <h1>결제 실패</h1>
      <p>에러 코드: {code}</p>
      <p>메시지: {message}</p>
    </div>
  );
}
