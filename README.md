# Weather Lab

React와 Vite를 사용하여 만드는 날씨 정보 웹 애플리케이션 연습 프로젝트입니다.

## 프로젝트 목표

- React 컴포넌트 분리 연습
- Props를 이용한 데이터 전달
- State Lifting 연습
- 날씨 API 연동
- 로딩 및 오류 상태 처리
- 반응형 웹 화면 구현

## 기술 스택

- React
- Vite
- JavaScript
- CSS
- Git
- GitHub

## 현재 학습 내용

- SearchBar 입력 상태를 부모 컴포넌트에서 관리
- HomePage에서 도시 상태 관리
- WeatherCard에 도시 정보 전달
- ForecastList에 도시 정보 전달

## 실행 방법

프로젝트 패키지를 설치합니다.

```bash
npm install
```

개발 서버를 실행합니다.

```bash
npm run dev
```

## 브랜치 전략

- `main`: 완성되고 안정적인 코드
- `develop`: 현재 개발 중인 코드
- `feature/*`: 기능별 작업 코드

## 프로젝트 폴더 구조

```text
weather-lab
├─ public
├─ src
│  ├─ components
│  ├─ pages
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css
├─ README.md
├─ package.json
└─ vite.config.js
```