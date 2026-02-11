# Word Master

문장과 단어를 등록하고, AI가 자동으로 뜻을 검색해주는 단어장 앱입니다.

## 소개

Word Master는 외국어 학습을 위한 스마트 단어장 앱입니다.

- **문장 등록** - 학습하고 싶은 문장을 등록하면, AI가 자동으로 뜻을 번역합니다.
- **단어 등록** - 문장 속 모르는 단어를 등록하면, AI가 자동으로 뜻을 검색합니다.
- **단어장 조회** - 등록된 문장과 단어의 뜻을 한눈에 확인하고 학습할 수 있습니다.
- **북마크** - 자주 틀리거나 중요한 문장/단어를 북마크하여 집중 학습할 수 있습니다.

## 기술 스택

| 영역      | 기술                    |
| --------- | ----------------------- |
| Framework | Next.js 16 (App Router) |
| Language  | TypeScript              |
| Styling   | Tailwind CSS 4          |
| ORM       | Prisma 7                |
| Database  | PostgreSQL (Supabase)   |
| AI        | AI 기반 자동 뜻 검색    |

## 프로젝트 구조

```
word-master/
└── app/                    # Next.js 앱 루트
    ├── app/                # App Router 페이지
    │   ├── layout.tsx      # 루트 레이아웃
    │   ├── page.tsx        # 메인 페이지
    │   ├── globals.css     # 글로벌 스타일
    │   └── favicon.ico
    ├── generated/prisma/   # Prisma 생성 클라이언트
    ├── prisma/
    │   ├── schema.prisma   # DB 스키마 정의
    │   └── migrations/     # 마이그레이션 파일
    ├── public/             # 정적 파일
    ├── prisma.config.ts    # Prisma 설정
    ├── next.config.ts      # Next.js 설정
    ├── tsconfig.json       # TypeScript 설정
    └── package.json
```

## 데이터 모델

### Sentence (문장)

| 필드          | 타입     | 설명               |
| ------------- | -------- | ------------------ |
| id            | Int      | 고유 ID (자동증가) |
| text          | String   | 문장 원문          |
| definition    | String   | 문장 뜻 (AI 번역)  |
| is_bookmarked | Boolean  | 북마크 여부        |
| create_time   | DateTime | 생성 시간          |
| update_time   | DateTime | 수정 시간          |

### Word (단어)

| 필드          | 타입     | 설명               |
| ------------- | -------- | ------------------ |
| id            | Int      | 고유 ID (자동증가) |
| text          | String   | 단어 원문          |
| definition    | String   | 단어 뜻 (AI 검색)  |
| is_bookmarked | Boolean  | 북마크 여부        |
| sentence_id   | Int      | 소속 문장 ID       |
| create_time   | DateTime | 생성 시간          |
| update_time   | DateTime | 수정 시간          |

## 시작하기

### 사전 요구사항

- **Node.js** 18 이상
- **npm** (또는 yarn, pnpm)
- **PostgreSQL** 데이터베이스 (Supabase 등 클라우드 DB 사용 가능)

### 1. 저장소 클론

```bash
git clone <repository-url>
cd word-master/app
```

### 2. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성합니다.

```bash
cp .env.example .env
```

`.env` 파일을 열고 아래 값을 본인의 환경에 맞게 수정합니다.

```env
# PostgreSQL 연결 문자열
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>"
```

> **Supabase를 사용하는 경우:**
> Supabase 대시보드 > Settings > Database > Connection string (URI) 에서 연결 문자열을 복사하세요.

### 3. 의존성 설치

```bash
npm install
```

### 4. 데이터베이스 마이그레이션

```bash
npx prisma migrate deploy
```

### 5. Prisma 클라이언트 생성

```bash
npx prisma generate
```

### 6. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.

## 스크립트

| 명령어           | 설명                 |
| ---------------- | -------------------- |
| `npm run dev`    | 개발 서버 실행       |
| `npm run build`  | 프로덕션 빌드        |
| `npm run start`  | 프로덕션 서버 실행   |
| `npm run lint`   | ESLint 코드 검사     |
| `npm run pretty` | Prettier 코드 포맷팅 |

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
