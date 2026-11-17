# 기웃 클라이언트

기웃 모바일 애플리케이션의 Expo·React Native 클라이언트입니다.

## 기술 스택

- Expo SDK 58
- React Native
- TypeScript
- Expo Router
- React Native Reanimated

## 시작하기

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm start
```

터미널에 표시되는 QR 코드를 Expo Go로 스캔합니다. 컴퓨터와 휴대폰은 같은 네트워크에 연결되어 있어야 합니다.

연결이 되지 않으면 터널 모드를 사용할 수 있습니다.

```bash
npx expo start --tunnel
```

### Expo Go와 Development Build

Expo Go는 Expo가 미리 포함해 둔 네이티브 모듈만 사용할 수 있는 공용 개발 앱입니다. 화면과 일반적인 앱 기능은 Expo Go에서 빠르게 확인할 수 있습니다.

카메라, 알림, 블루투스처럼 iOS 또는 Android의 기능을 사용하는 코드를 **네이티브 모듈**이라고 합니다. 새로 설치한 라이브러리에 Expo Go가 포함하지 않은 네이티브 모듈이 있다면 Expo Go에서는 실행할 수 없으며, 프로젝트 전용 개발 앱인 **Development Build**가 필요합니다.

- 기본 UI 및 Expo Go 지원 기능: Expo Go로 확인
- Expo Go에 없는 네이티브 모듈: Development Build로 확인
- 패키지 설치: SDK 호환 버전이 설치되도록 `npx expo install <package>` 사용

Development Build는 필요한 네이티브 모듈을 포함해 빌드한 이 프로젝트 전용 테스트 앱입니다. Windows에서 iOS용 개발 빌드가 필요하면 EAS Build를 이용해 클라우드에서 빌드합니다.

## 주요 명령어

| 명령어 | 설명 |
| --- | --- |
| `npm start` | Expo 개발 서버 실행 |
| `npm run android` | Android에서 실행 |
| `npm run ios` | iOS 시뮬레이터에서 실행(macOS 필요) |
| `npm run web` | 웹에서 실행 |
| `npm run lint` | ESLint 검사 |
| `npx tsc --noEmit` | TypeScript 타입 검사 |
| `npm run theme` | 디자인 토큰으로 테마 파일 생성 |

## 프로젝트 구조

```text
.
├─ assets/             # 이미지와 앱 아이콘
├─ scripts/            # 프로젝트 스크립트
├─ src/
│  ├─ app/             # Expo Router 화면과 레이아웃
│  ├─ components/      # 공통 컴포넌트
│  └─ theme/           # 색상, 글자, 간격, 모션
└─ tokens.json         # 디자인 토큰 원본
```

`src/app` 내부의 파일은 Expo Router의 경로가 됩니다. 화면이 아닌 컴포넌트와 공통 로직은 `src/app` 밖에 둡니다.

## 디자인 토큰

색상, 타이포그래피, 간격, 모서리와 그림자는 `tokens.json`에서 관리합니다.

토큰을 수정한 뒤 다음 명령어로 테마 파일을 다시 생성합니다.

```bash
npm run theme
```

다음 파일은 `npm run theme`으로 자동 생성되므로 직접 수정하지 않습니다.

- `src/theme/colors.ts`
- `src/theme/typography.ts`
- `src/theme/layout.ts`
- `src/theme/shadows.ts`

`src/theme/motion.ts`, `src/theme/fonts.ts`, `src/theme/index.ts`는 직접 관리합니다.

## 이슈 규칙

이슈 제목은 작업 유형과 내용을 함께 작성합니다.

```text
<type>: <작업 내용>
```

예시:

```text
feat: 디자인 시스템 및 공통 UI 컴포넌트 구축
```

## 브랜치 규칙

GitHub Issue를 생성한 뒤 작업 유형, 이슈 번호와 간단한 작업명을 브랜치 이름에 사용합니다.

```text
<type>/FE-<issue-number>-<short-description>
```

작업명은 영문 소문자와 하이픈으로 작성합니다.

예시:

```text
feat/FE-1-design-system
fix/FE-12-login-redirect
```

새 브랜치는 최신 `main`에서 생성합니다.

```bash
git switch main
git pull origin main
git switch -c feat/FE-1-design-system
```

## 커밋 규칙

```text
<type>: <작업 내용>
```

| 타입 | 설명 |
| --- | --- |
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `refactor` | 동작 변경 없는 코드 개선 |
| `style` | UI 스타일과 디자인 수정 |
| `docs` | 문서 수정 |
| `test` | 테스트 추가와 수정 |
| `chore` | 설정, 패키지, 빌드 작업 |

예시:

```text
feat: 공통 앱 헤더 구현
fix: 로그인 화면 이동 오류 수정
docs: 프로젝트 실행 방법 추가
```

커밋 하나에는 하나의 작업만 포함합니다.

## Pull Request 규칙

Pull Request 제목은 이슈 및 커밋과 같은 형식을 사용합니다.

```text
feat: 디자인 시스템 및 공통 UI 컴포넌트 구축
```

본문에 연결된 이슈를 작성하면 Pull Request가 병합될 때 이슈가 자동으로 닫힙니다.

```text
Closes #1
```

## 작업 순서

1. 작업 유형을 포함한 제목으로 GitHub Issue를 생성합니다.
2. 최신 `main`에서 이슈 브랜치를 생성합니다.
3. 기능을 구현하고 작업 단위로 커밋합니다.
4. 린트와 타입 검사를 실행합니다.
5. 원격 브랜치에 Push하고 이슈를 연결한 Pull Request를 생성합니다.
6. 리뷰가 끝나면 `main`에 병합합니다.

## 작업 완료 전 검사

```bash
npm run lint
npx tsc --noEmit
```
