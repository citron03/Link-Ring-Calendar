# 📅 링크링 캘린더 (Link-Ring Calendar) 프로젝트 기획서 V1.0

## 1. 프로젝트 개요

| 구분 | 내용 |
| :--- | :--- |
| **프로젝트명** | **링크링 캘린더 (Link-Ring Calendar)** |
| **목표** | 웹 브라우저의 첫 화면(대시보드)으로 기능할 수 있도록, **일정 관리, 필수 하이퍼링크, 개인화된 스타일**을 통합 제공하는 맞춤형 웹 캘린더 서비스 구현. |
| **핵심 기능** | 일정 항목에 하이퍼링크 통합, 캘린더 독립형 웹 즐겨찾기(퀵-링크 보드), 다양한 테마 지원. |
| **타겟 사용자** | 웹 브라우저를 통해 일과 정보를 관리하는 모든 사용자. |

---

## 2. 기술 스택 (Tech Stack)

안정성과 확장성을 고려하여 TypeScript 기반의 풀 스택을 채택하고, 데이터 무결성을 위해 PostgreSQL을 사용하며, 표준화된 JWT 인증 방식을 채택합니다.

| 영역 | 기술 스택 | 세부 기술 | 결정 이유 |
| :--- | :--- | :--- | :--- |
| **프론트엔드 (FE)** | **React.js + TypeScript** | Styled-Components (or Emotion) | 안정적인 타입 관리, 컴포넌트 기반 UI, 동적 테마 관리 용이. |
| **백엔드 (BE)** | **Node.js + Express + TypeScript** | Bcrypt, JWT (JSON Web Token) | 단일 언어 생태계 유지, 비동기 처리 효율성 및 안정적인 서버 로직. |
| **데이터베이스 (DB)** | **PostgreSQL** | TypeORM 또는 Prisma (ORM) | 일정 및 사용자 데이터의 **관계 무결성** 확보. |
| **인증 방식** | **JWT** | Access Token / Refresh Token | 서버 부하 최소화 및 보안성, 다중 기기 접근 지원. |

---

## 3. 핵심 기능 상세

### 3.1. 캘린더 및 하이퍼링크 통합

* **일정 CRUD:** 월/주/일 뷰에서 일정 등록, 조회, 수정, 삭제 기능 제공.
* **링크 통합 (Ring):** 일정 등록 시 **필수 URL 필드**를 추가로 입력받아, 캘린더에서 해당 일정을 클릭하면 연결된 URL로 즉시 이동. (예: 회의 일정 $\rightarrow$ 회의 자료 링크)

### 3.2. 퀵-링크 보드 (Quick-Link Board)

* **기능:** 캘린더와 별개로, 자주 사용하는 웹사이트를 등록/관리하는 전용 사이드바/패널.
* **링크 CRUD:** 전용 API를 통해 링크 등록(제목, URL), 조회, 수정, 삭제를 지원.
* **순서 변경:** 드래그 앤 드롭(Drag & Drop)을 통한 링크 목록의 정렬 순서 변경 기능 구현.
* **접근성:** 캘린더 화면 어디서든 **상시 노출**되어 즉각적인 접근을 보장.

### 3.3. 개인화 테마 시스템

사용자 취향에 따라 캘린더의 전체적인 디자인을 변경할 수 있는 시스템 구현.

| 테마명 | 특징 | 적용 전략 |
| :--- | :--- | :--- |
| **클래식 (Classic)** | 미니멀, 고가독성, 업무/학업에 적합한 깔끔한 디자인. | 기본 UI 스타일 (Base Theme) |
| **아니메 (Anime)** | 밝고 활기찬 색감, 만화적인 폰트 및 요소 사용. | 전용 컬러 팔레트 및 폰트 변수 적용 |
| **고딕 (Gothic)** | 어둡고 차분한 톤, 세리프 폰트, 중후한 경계선 디자인. | 배경색, 폰트, 경계선 등의 CSS 변수 재정의 |

---

## 4. 데이터 모델링 (PostgreSQL 스키마 초안)

| 테이블명 | 필드명 | 타입 | 제약 조건/설명 |
| :--- | :--- | :--- | :--- |
| **User** | id | SERIAL | Primary Key |
| | email | VARCHAR | Unique, Not Null |
| | password | VARCHAR | Not Null (Bcrypt Hashed) |
| | nickname | VARCHAR | Not Null |
| | current_theme | VARCHAR | 기본값: 'Classic' |
| **Schedule** | id | SERIAL | Primary Key |
| | user_id | INT | Foreign Key (User.id) |
| | title | VARCHAR | Not Null |
| | content | TEXT | |
| | date | DATE/TIMESTAMP | Not Null |
| | **hyperlink_url** | VARCHAR | 일정과 연결된 핵심 링크 |
| **QuickLink** | id | SERIAL | Primary Key |
| | user_id | INT | Foreign Key (User.id) |
| | title | VARCHAR | Not Null |
| | **url** | VARCHAR | Not Null (퀵-링크 주소) |
| | order_index | INT | 링크 순서 정렬용 |
| | icon_url | VARCHAR | (선택적) 파비콘 주소 |

---

## 5. 개발 로드맵 (Roadmap)

총 13주를 예상하며, 단계별로 기능을 쌓아 올려 안정적인 서비스를 구축합니다.

| 단계 | 주요 작업 내용 | 예상 기간 |
| :--- | :--- | :--- |
| **1단계** | **인프라 & DB 구축:** Node.js/TS 환경, PostgreSQL & ORM 설정, 기본 테이블 스키마 구축. | 3주 |
| **2단계** | **인증 및 퀵-링크 백엔드:** JWT 인증 시스템 (로그인, 회원가입, 토큰 갱신) 구현. 퀵-링크 CRUD API 개발. | 3주 |
| **3단계** | **MVP 프론트엔드:** React UI 구성, **일정 CRUD 및 하이퍼링크 기능** 구현. **퀵-링크 보드 UI** 구현. (클래식 테마 한정) | 4주 |
| **4단계** | **개인화 및 안정화:** **아니메/고딕 테마** 스타일링 완료. 퀵-링크 D&D(순서 변경) 기능 구현. 반응형 개선, 최종 버그 픽스 및 배포. | 3주 |
