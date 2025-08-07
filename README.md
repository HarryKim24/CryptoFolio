# CryptoFolio

<div align="center">
  암호화폐 차트 조회, 트렌드 분석, 포트폴리오 관리를 지원하는 웹 서비스입니다.
  <br /><br />
    
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-blue?logo=tailwindcss)](https://tailwindcss.com/)
  [![Deploy-Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://crypto-folio-harrykim24.vercel.app/)
</div>

<p align="center">
  <img src="https://github.com/HarryKim24/CryptoFolio/raw/main/docs/videos/main.gif" width="800">
</p>

> - 자세한 내용은 아래 **프로젝트 문서 페이지**에서 확인하실 수 있습니다.  
> 👉 [Notion 문서](https://tl9434.notion.site/CryptoFolio-229857f733818008bc5ff076fcc8a16f?pvs=74)

---

## 🚀 주요 기능

- **홈 페이지**
  - 홈페이지는 전체 서비스를 소개하고 각 기능 페이지로 이동을 안내하는 역할을 합니다.
  - 섹션 별로 각 기능의 핵심을 간략히 확인할 수 있도록 구성했습니다.
  - 섹션별 배경의 부드러운 전환 애니메이션 효과를 연출했습니다.
  <p align="start">
    <img src="https://github.com/HarryKim24/CryptoFolio/raw/main/docs/videos/home.gif" width="600">
  </p>

- **차트 페이지**  
  - 사용자가 선택한 암호화폐의 실시간 시세와 차트를 확인할 수 있습니다. 
  - 한글 초성 검색 기능 등을 지원하며 원하는 종목을 쉽고 빠르게 탐색할 수 있도록 구성했습니다.
  <p align="start">
    <img src="https://github.com/HarryKim24/CryptoFolio/raw/main/docs/videos/chart.gif" width="600">
  </p>

- **트렌드 페이지**  
  - 시장 전반의 주요 지표와 트렌드를 한눈에 살펴볼 수 있습니다.
  - 실시간 환율, 비트코인 가격 추이, 급등 코인 랭킹, 알트코인 거래량 데이터를 시각적으로 제공합니다.
  <p align="start">
    <img src="https://github.com/HarryKim24/CryptoFolio/raw/main/docs/videos/trends.gif" width="600">
  </p>

- **포트폴리오 페이지**  
  - 나만의 암호화폐 투자 기록을 관리하고 분석할 수 있도록 구성했습니다.
  - 실제 거래 내역을 등록하고, 투자 금액·수익률·보유 비중을 직관적으로 확인해 투자 전략 수립을 지원합니다.
  <p align="start">
    <img src="https://github.com/HarryKim24/CryptoFolio/raw/main/docs/videos/portfolio.gif" width="600">
  </p>

- **세팅 페이지**  
  - 사용자의 계정 정보를 관리할 수 있는 페이지입니다.
  - 사용자 프로필 확인 및 수정 (이름, 비밀번호 변경), 회원탈퇴 기능을 자원합니다.
  <p align="start">
    <img src="https://github.com/HarryKim24/CryptoFolio/raw/main/docs/videos/settings.gif" width="600">
  </p>

- **로그인/회원가입 페이지**  
  - CryptoFolio의 사용자 인증을 위한 페이지입니다.
  - 이메일과 비밀번호를 기반으로 안전하게 로그인하고, 신규 사용자는 간편하게 계정을 생성할 수 있도록 구성했습니다.
  <p align="start">
    <img src="https://github.com/HarryKim24/CryptoFolio/raw/main/docs/videos/auth.gif" width="600">
  </p>

---

## 🛠️ 기술 스택

| 구분 | 사용 기술 |
|------|-----------|
| **Frontend** | [Next.js 15](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/) |
| **Auth** | [NextAuth.js](https://next-auth.js.org/), [bcrypt.js](https://www.npmjs.com/package/bcryptjs) |
| **API 통신** | REST API, [Axios](https://axios-http.com/) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas/database), [Mongoose](https://mongoosejs.com/) |
| **상태 관리** | React Context + Provider 패턴 |
| **차트 라이브러리** | [Chart.js](https://www.chartjs.org/), [react-chartjs-2](https://github.com/reactchartjs/react-chartjs-2), [ApexCharts](https://apexcharts.com/), [react-apexcharts](https://github.com/apexcharts/react-apexcharts) |
| **애니메이션** | [Framer Motion](https://www.framer.com/motion/), [GSAP](https://greensock.com/gsap/) |
| **날짜 유틸** | [date-fns](https://date-fns.org/) |
| **캘린더** | [React Datepicker](https://reactdatepicker.com/) |
| **아이콘** | [Lucide React](https://lucide.dev/), [Heroicons](https://heroicons.com/) |
| **배포** | [Vercel](https://vercel.com/) |

---

## 📂 폴더 구조 (src)

```bash
src/
├── api/                    # 클라이언트 API 호출 함수
├── app/                    # Next.js App Router 디렉토리
│   ├── api/                # 서버 API 라우트
│   ├── (home)/             # 메인 홈페이지
│   ├── (auth)/             # 로그인 및 회원가입 페이지
│   ├── chart/              # 암호화폐 시세 및 차트 페이지
│   ├── trends/             # 트렌드 데이터 분석 페이지
│   ├── portfolio/          # 사용자 포트폴리오 관리 페이지
│   ├── settings/           # 계정 정보 설정 페이지
│
├── components/             # UI 컴포넌트 모음
├── context/                # 전역 상태 관리 (React Context)
├── hooks/                  # 커스텀 훅
├── lib/                    # 서버 비즈니스 로직 및 인프라 유틸
├── utils/                  # 클라이언트 유틸 함수 및 데이터 처리
├── types/                  # 타입스크립트 타입 정의

```

## 👤 제작자

| 이름        | GitHub                                       | 이메일                                         |
| --------- | -------------------------------------------- | ------------------------------------------- |
| Harry Kim | [@HarryKim24](https://github.com/HarryKim24) | [tl9434@naver.com](mailto:tl9434@naver.com) |
