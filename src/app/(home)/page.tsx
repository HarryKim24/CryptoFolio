export default function Home() {
  return (
    <div className="min-h-[200vh] px-6 py-20">
      <h1 className="text-3xl font-bold mb-6">CryptoFolio Home</h1>
      <p className="mb-4">스크롤 테스트를 위한 더미 콘텐츠입니다.</p>

      {[...Array(50)].map((_, i) => (
        <p key={i} className="mb-2">
          🚀 테스트 라인 #{i + 1} - CryptoFolio는 암호화폐 자산 관리를 돕습니다.
        </p>
      ))}
    </div>
  );
}
