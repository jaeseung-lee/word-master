# Project Instructions (AGENTS.md)

Word Master는 문장과 단어를 등록하면 AI가 자동으로 뜻을 검색해주는 스마트 단어장 앱입니다.

## Goal / Scope

- **요청된** 기능/버그 수정만 **최소한의 변경**으로 구현한다.
- 요청에 명시되지 않은 동작은 변경하지 않는다.

## Guardrails (Hard Rules)

- **요청과 무관한 리팩토링/정리 금지**.
- **최소한의 파일만 변경**한다. 불필요한 대규모 포맷팅 금지.
- **새 의존성 추가 금지**. 기존 패키지만 사용한다.
- **Lockfile** (`package-lock.json`)은 의존성 설치가 명시적으로 요청된 경우에만 변경한다.
- **`.env*`, 시크릿, CI/CD 설정**은 명시적 요청 없이 수정하지 않는다.
- **토큰/PII 로깅 금지**. 인증 헤더, 접근 토큰, 사용자 식별 정보를 로그에 출력하지 않는다.

## Tech Stack

| 영역        | 기술                                      |
| ----------- | ----------------------------------------- |
| Framework   | Next.js 16 (App Router)                   |
| Language    | TypeScript                                |
| Styling     | Tailwind CSS 4                            |
| UI Library  | Radix UI                                  |
| ORM         | Prisma 7                                  |
| Database    | PostgreSQL (Supabase / Local)             |
| i18n        | next-intl (기본 로케일: ko)               |
| Formatting  | Prettier (husky pre-commit hook)          |
| Font        | Noto Sans (Google Fonts)                  |

## Project Structure

```
word-master/                  # Git root
├── .prettierrc               # Prettier 설정
├── .vscode/settings.json     # VS Code 설정
├── agents.md                 # 이 파일
└── app/                      # Next.js 앱
    ├── .husky/
    │   └── pre-commit        # Commit 전 prettier 실행
    ├── messages/
    │   └── ko.json           # 한국어 i18n 메시지
    ├── prisma/
    │   ├── schema.prisma     # DB 스키마 정의
    │   └── migrations/       # 마이그레이션 파일
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx    # 루트 레이아웃
    │   │   ├── globals.css   # 글로벌 스타일
    │   │   └── [locale]/
    │   │       └── page.tsx  # 메인 페이지
    │   ├── i18n/
    │   │   ├── routing.ts    # 로케일 라우팅 설정
    │   │   └── request.ts    # 서버 요청 로케일 설정
    │   └── proxy.ts          # next-intl 미들웨어 (middleware)
    ├── generated/prisma/     # Prisma 생성 클라이언트 (Git 제외)
    ├── public/               # 정적 파일
    ├── prisma.config.ts      # Prisma 설정
    ├── next.config.ts        # Next.js 설정
    ├── package.json
    └── tsconfig.json
```

## Project Constraints

- **Language**: 한국어 (ko) 기본. 메시지 파일은 `app/messages/ko.json`.
- **DB**: Prisma 스키마는 `app/prisma/schema.prisma` (마이그레이션은 `app/prisma/migrations/`).
- **i18n**: next-intl 사용. 로케일은 URL에 노출하지 않음 (`localePrefix: "never"`).
- **Middleware**: `app/src/proxy.ts`에서 next-intl 미들웨어 설정.

## Data Model

### sentence

| 필드          | 타입     | 설명                                      |
| ------------- | -------- | ----------------------------------------- |
| id            | Int      | PK, 자동증가                              |
| text          | String   | 문장 원문                                 |
| definition    | String   | 문장 뜻 (AI 번역)                        |
| language      | Language | 언어 (ENGLISH / KOREAN / JAPANESE)        |
| is_bookmarked | Boolean  | 북마크 여부                               |
| create_time   | DateTime | 생성 시간                                 |
| update_time   | DateTime | 수정 시간                                 |

### word

| 필드          | 타입     | 설명                                      |
| ------------- | -------- | ----------------------------------------- |
| id            | Int      | PK, 자동증가                              |
| text          | String   | 단어 원문                                 |
| definition    | String   | 단어 뜻 (AI 검색)                        |
| language      | Language | 언어 (ENGLISH / KOREAN / JAPANESE)        |
| is_bookmarked | Boolean  | 북마크 여부                               |
| sentence_id   | Int      | 소속 문장 FK                              |
| create_time   | DateTime | 생성 시간                                 |
| update_time   | DateTime | 수정 시간                                 |

### Language (Enum)

`LANGUAGE_ENGLISH` | `LANGUAGE_KOREAN` | `LANGUAGE_JAPANESE`

## How to Run (Local)

### 설치

```bash
cd app && npm install
```

### 환경 변수 설정

```bash
cp .env.example .env
# .env 파일에서 DATABASE_URL을 본인 환경에 맞게 수정
```

### DB 마이그레이션

```bash
npx prisma migrate dev
npx prisma generate
```

### 개발 서버 실행

```bash
npm run dev    # http://localhost:3000
```

## Code Style

Prettier (`.prettierrc`):

```json
{
  "tabWidth": 2,
  "singleQuote": false,
  "trailingComma": "all"
}
```

- 더블 쿼트 (`"`) 사용
- 2칸 들여쓰기
- 모든 곳에 trailing comma
- 커밋 시 husky pre-commit hook이 자동으로 `npm run pretty` 실행

## Available Scripts

| 명령어           | 설명                                     |
| ---------------- | ---------------------------------------- |
| `npm run dev`    | 개발 서버 실행                           |
| `npm run build`  | 프로덕션 빌드                            |
| `npm run start`  | 프로덕션 서버 실행                       |
| `npm run lint`   | ESLint 코드 검사                         |
| `npm run pretty` | Prettier 코드 포맷팅                     |

## Definition of Done / Output Format

- **코드 변경이 완료**되고 요청 범위에 맞게 스코핑됨 (무관한 리팩토링 없음).
- Prisma 스키마 변경 시: **마이그레이션 생성 및 클라이언트 재생성** 완료.
- 최종 응답에 포함할 항목:
  - **변경 요약** (무엇을, 왜 변경했는지)
  - **변경된 파일 목록**
  - **실행한 명령어 및 결과** (성공/실패)
