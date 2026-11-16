# 기웃 클라이언트

기웃 모바일 애플리케이션의 Expo/React Native 클라이언트입니다.

## 기술 스택

- Expo
- React Native
- TypeScript
- Expo Router

## 시작하기

```bash
npm install
npx expo start
```

개발 서버가 실행되면 Expo Go에서 QR 코드를 스캔하거나 다음 키를 사용할 수 있습니다.

- `a`: Android 에뮬레이터
- `w`: 웹 브라우저
- `i`: iOS 시뮬레이터(macOS만 지원)

## 프로젝트 구조

```text
src/
├─ app/          # Expo Router 화면 및 레이아웃
├─ components/   # 공통 UI 컴포넌트
├─ features/     # 기능별 코드
├─ hooks/        # 공통 훅
├─ services/     # API 통신
├─ types/        # 공통 타입
└─ utils/        # 공통 함수
```

필요한 폴더는 기능을 구현할 때 추가합니다.

## 브랜치 규칙

브랜치는 작업 이슈 번호를 사용합니다.

```text
FE-<issue-number>
```

예시:

```text
FE-1
FE-2
FE-3
```

- 브랜치 하나에서는 하나의 이슈만 작업합니다.
- 구체적인 작업 내용은 GitHub Issue와 Pull Request에 작성합니다.
- Pull Request가 병합된 브랜치는 삭제합니다.

새 브랜치는 최신 `main` 브랜치에서 생성합니다.

```bash
git switch main
git pull origin main
git switch -c FE-1
```

## 커밋 규칙

커밋 메시지는 다음 형식을 사용합니다.

```text
<type>: <작업 내용>
```

| 타입 | 설명 |
| --- | --- |
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `refactor` | 기능 변경 없는 코드 개선 |
| `style` | UI 스타일 및 디자인 수정 |
| `docs` | 문서 수정 |
| `test` | 테스트 코드 추가 및 수정 |
| `chore` | 설정, 패키지 및 빌드 작업 |
| `perf` | 성능 개선 |
| `ci` | CI/CD 설정 변경 |

예시:

```text
feat: 공통 버튼 컴포넌트 구현
feat: 로그인 화면 API 연결
fix: 토큰 만료 시 로그인 화면 이동 오류 수정
style: 홈 화면 여백 및 색상 수정
refactor: 인증 상태 관리 로직 분리
docs: README에 개발 규칙 추가
chore: Axios 패키지 설치
```

커밋을 작성할 때 다음 원칙을 지킵니다.

- 커밋 하나에는 하나의 작업만 포함합니다.
- 작업 내용을 한글로 명확하게 작성합니다.
- 커밋 메시지 끝에는 마침표를 사용하지 않습니다.
- `수정`, `작업`, `최종`처럼 작업 내용을 알 수 없는 메시지는 사용하지 않습니다.

## 작업 및 Pull Request 순서

1. 작업할 GitHub Issue를 생성합니다.
2. 이슈 번호에 맞는 브랜치를 생성합니다.
3. 기능을 구현하고 커밋합니다.
4. 린트와 타입 검사를 실행합니다.
5. 원격 브랜치에 Push하고 Pull Request를 생성합니다.
6. 리뷰가 완료되면 `main` 브랜치에 병합합니다.

Pull Request 제목도 커밋 메시지와 같은 형식을 사용합니다.

```text
feat: 디자인 시스템 및 공통 UI 컴포넌트 구현
```

## 검사

Pull Request를 생성하기 전에 다음 명령어를 실행합니다.

```bash
npx expo lint
npx tsc --noEmit
```
