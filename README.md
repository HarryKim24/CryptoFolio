# CryptoFolio

- 암호화폐 차트 조회, 트렌드 분석, 포트폴리오 만들기를 제공하는 웹 사이트입니다.

<p align="center">
  <img src="https://github.com/HarryKim24/CryptoFolio/raw/main/docs/videos/main.gif" width="800">
</p>

> - 아래 링크에서 **웹사이트**를 확인하실 수 있습니다.  
> 👉 https://crypto-folio-harrykim24.vercel.app

> - 자세한 내용은 아래 **프로젝트 문서 페이지**에서 확인하실 수 있습니다.  
> 👉 [Notion 문서](https://tl9434.notion.site/CryptoFolio-229857f733818008bc5ff076fcc8a16f?pvs=74)

---

## 🚀 주요 기능

- **홈 페이지**
  - 서비스와 주요 기능을 소개하고 각 페이지로 이동할 수 있는 링크
  - 섹션별 배경의 부드러운 전환 애니메이션 효과
  <p align="start">
    <img src="https://github.com/HarryKim24/CryptoFolio/raw/main/docs/videos/home.gif" width="600">
  </p>

- **차트 페이지**  
  - 암호화폐 실시간 시세 및 차트, 종목 목록 탐색 기능
  - 한글 초성 검색 기능 지원으로 원하는 종목을 쉽고 빠르게 검색
  <p align="start">
    <img src="https://github.com/HarryKim24/CryptoFolio/raw/main/docs/videos/chart.gif" width="600">
  </p>

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
- **State Management**: React Context + Provider
- **Charts**: Chart.js, react-chartjs-2, chartjs-plugin-zoom, chartjs-chart-financial
- **Animation**: Framer Motion, GSAP
- **Deployment**: Vercel

---

## 📂 폴더 구조 (src/app)
- **(home)**: 메인 홈페이지
- **(auth)**: 로그인 및 회원가입
- **chart/[id]**: 암호화폐 시세 및 차트 페이지
- **trends**: 트렌드 데이터 분석 페이지
- **portfolio**: 사용자 포트폴리오 관리 페이지
- **settings**: 계정 정보 설정 페이지
