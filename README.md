# CryptoFolio

암호화폐 차트 조회, 트렌드 분석, 포트폴리오 만들기를 제공하는 웹 사이트입니다.

![홈 화면](https://github.com/HarryKim24/CryptoFolio/raw/main/public/homepage.png)

> 📌 자세한 내용은 아래 **프로젝트 문서 페이지**에서 확인하실 수 있습니다.  
> 👉 [📖 Notion 문서](https://tl9434.notion.site/CryptoFolio-229857f733818008bc5ff076fcc8a16f?pvs=74)

---

## 🚀 주요 기능
- **차트 페이지**  
  - 실시간 암호화폐 시세 및 차트 조회 기능 (Upbit API 기반)

- **트렌드 페이지**  
  - 환율 데이터 조회 (freecurrencyapi.com)
  - 비트코인 24시간 차트
  - 오늘의 급등 코인 TOP 10
  - 현재 거래대금이 가장 많은 알트코인 차트

- **포트폴리오 페이지**  
  - 실제 구매/판매한 암호화폐 거래 기록 추가 및 투자금, 수익률 관리

- **세팅 페이지**  
  - 사용자 프로필 확인 및 수정 (이름, 비밀번호 변경), 회원탈퇴 기능

- **로그인/회원가입 페이지**  
  - NextAuth를 이용한 사용자 인증

---

## 🛠️ 기술 스택
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: NextAuth.js
- **API**: REST + Axios
- **Database**: MongoDB, Mongoose (MongoDB Atlas)
- **Charts**: Chart.js, react-chartjs-2, chartjs-plugin-zoom, chartjs-chart-financial
- **Date Handling**: date-fns, react-datepicker
- **Animation**: Framer Motion, GSAP
- **Icons**: Lucide-react, React-icons, @heroicons/react
- **Deployment**: Vercel

---

## 📂 폴더 구조 (src/app)
- **(home)**: 메인 홈페이지
- **(auth)**: 로그인 및 회원가입
- **chart/[id]**: 암호화폐 시세 및 차트 페이지
- **trends**: 트렌드 데이터 분석 페이지
- **portfolio**: 사용자 포트폴리오 관리 페이지
- **settings**: 계정 정보 설정 페이지

---

## 🚀 배포 링크
> 배포된 사이트에서 직접 기능을 확인하실 수 있습니다.  
> 👉 **Live on Vercel**: [https://crypto-folio-harrykim24.vercel.app](https://crypto-folio-harrykim24.vercel.app)
