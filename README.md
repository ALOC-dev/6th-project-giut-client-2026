# 기웃 (GIUT)

대학생이 공모전·대외활동을 탐색하고 함께할 팀원을 찾을 수 있도록 돕는 모바일 애플리케이션입니다. 이 저장소는 Expo와 React Native로 개발하는 프론트엔드 클라이언트입니다.

## 기술 스택

| 구분        | 기술                                           |
| ----------- | ---------------------------------------------- |
| Framework   | Expo SDK 58                                    |
| Application | React 19.3, React Native 0.88                  |
| Language    | TypeScript 6 (strict mode)                     |
| Routing     | Expo Router, Expo Router UI                    |
| Animation   | React Native Animated, React Native Reanimated |
| UI          | React Native SVG, Expo Symbols, Phosphor Icons |
| Styling     | React Native StyleSheet, Design Tokens         |

## 시작하기

### 요구 사항

- Node.js 22.13 이상
- npm
- Expo Go가 설치된 모바일 기기 또는 플랫폼별 시뮬레이터

### 설치 및 실행

```bash
git clone https://github.com/ALOC-dev/6th-project-giut-client-2026.git
cd 6th-project-giut-client-2026
npm install
npm start
```

개발 서버에 표시되는 QR 코드를 Expo Go로 스캔합니다. 컴퓨터와 모바일 기기는 같은 네트워크에 연결되어 있어야 합니다.

로컬 네트워크 연결이 어려우면 터널 모드를 사용할 수 있습니다.

```bash
npx expo start --tunnel
```

### 플랫폼별 실행

```bash
npm run android
npm run ios
npm run web
```

- iOS 시뮬레이터는 macOS와 Xcode가 필요합니다.
- Expo Go에 포함되지 않은 네이티브 모듈을 추가하면 Development Build가 필요합니다.
- 패키지는 프로젝트의 Expo SDK와 호환되는 버전이 설치되도록 `npx expo install <package>`로 추가합니다.

## 주요 명령어

| 명령어                 | 설명                             |
| ---------------------- | -------------------------------- |
| `npm start`            | Expo 개발 서버 실행              |
| `npm run android`      | Android에서 앱 실행              |
| `npm run ios`          | iOS 시뮬레이터에서 앱 실행       |
| `npm run web`          | 웹 환경에서 앱 실행              |
| `npm run lint`         | ESLint 검사                      |
| `npx tsc --noEmit`     | TypeScript 타입 검사             |
| `npm run format`       | Prettier 포맷 적용               |
| `npm run format:check` | Prettier 포맷 검사               |
| `npm run theme`        | `tokens.json`으로 테마 파일 생성 |
| `npx expo-doctor`      | Expo 설정과 의존성 상태 점검     |

## 프로젝트 구조

```text
.
├─ assets/                     # 앱 아이콘, 로고 및 이미지
├─ scripts/
│  └─ gen-theme.mjs            # 디자인 토큰 생성 스크립트
├─ src/
│  ├─ app/                     # Expo Router 라우트와 레이아웃
│  ├─ components/              # 여러 화면에서 재사용하는 컴포넌트
│  ├─ screens/                 # 기능 단위 화면과 전용 로직
│  ├─ theme/                   # 생성된 테마와 직접 관리하는 테마 설정
│  └─ utils/                   # 공통 유틸리티
└─ tokens.json                 # 디자인 토큰 원본
```

`src/app` 안의 파일은 URL과 연결되는 라우트입니다. 화면 컴포넌트, 기능 로직, 화면 전용 데이터 등 라우트가 아닌 코드는 `src/screens`, `src/components`, `src/utils`에서 관리합니다.

## 디자인 토큰

색상, 타이포그래피, 간격, 모서리와 그림자는 루트의 `tokens.json`을 기준으로 관리합니다. 토큰을 변경한 뒤에는 테마 파일을 다시 생성합니다.

```bash
npm run theme
```

다음 파일은 자동 생성되므로 직접 수정하지 않습니다.

- `src/theme/colors.ts`
- `src/theme/typography.ts`
- `src/theme/layout.ts`
- `src/theme/shadows.ts`

다음 파일은 직접 관리합니다.

- `src/theme/fonts.ts`
- `src/theme/motion.ts`
- `src/theme/index.ts`

## 작업 규칙

### Issue

작업을 시작하기 전에 목적과 범위를 확인할 수 있는 GitHub Issue를 생성합니다. 제목은 다음 형식을 사용합니다.

```text
<type>: <작업 내용>
```

이슈 본문에는 작업 배경, 반영할 내용과 완료 기준을 작성합니다.

### 브랜치

GitHub Issue를 생성한 뒤 최신 `main`에서 작업 브랜치를 만듭니다.

```text
<type>/FE-<issue-number>-<short-description>
```

예시:

```text
feat/FE-32-team-application
fix/FE-19-bottom-navigation
docs/FE-38-readme
```

```bash
git switch main
git pull --ff-only origin main
git switch -c docs/FE-38-readme
```

### 커밋

```text
<type>: <작업 내용>
```

| type       | 용도                     |
| ---------- | ------------------------ |
| `feat`     | 새로운 기능              |
| `fix`      | 버그 수정                |
| `refactor` | 동작 변경 없는 구조 개선 |
| `style`    | UI 스타일 변경           |
| `docs`     | 문서 변경                |
| `test`     | 테스트 추가 또는 수정    |
| `chore`    | 설정, 패키지, 빌드 작업  |

하나의 커밋에는 하나의 논리적인 변경을 담습니다.

### Pull Request

- PR 제목은 커밋과 같은 형식을 사용합니다.
- 본문에는 주요 변경 사항, 검증 결과와 주의 사항을 작성합니다.
- 관련 이슈는 `Closes #<issue-number>` 형식으로 연결합니다. 예: `Closes #38`
- 리뷰가 끝난 뒤 `main`에 병합합니다.

## 작업 완료 전 확인

```bash
npm run lint
npx tsc --noEmit
npm run format:check
```

디자인 토큰을 수정했다면 `npm run theme` 실행 결과도 함께 커밋합니다. 의존성을 변경했다면 `npx expo-doctor`로 Expo SDK 호환성을 추가로 확인합니다.
