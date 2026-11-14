# 기웃 클라이언트

기웃 모바일 애플리케이션의 Expo/React Native 클라이언트입니다.

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

## 검사

```bash
npx expo lint
npx tsc --noEmit
```
