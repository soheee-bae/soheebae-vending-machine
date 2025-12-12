
### 1.프로젝트 개요

이름: soheebae-vending-machine
설명: 간단한 자판기 시뮬레이터 (React + TypeScript)

### 1. 실행 방법 
1. 설치 : `npm install`
2. 개발 서버 실행 : `npm run dev`

### 2. 사용된 기술 및 버전
- 프레임워크: React (19.2.0)
- 언어: TypeScript (~5.9.3)
- 번들러/빌드: Vite (7.2.4)
- 상태 관리: React Hooks (useReducer, useMemo, useEffect, useContext)
- 스타일: Sass/CSS Modules (1.96.0), clsx (2.1.1)

### 3.참고 자료 및 도구
- 주요 도식 : draw.io를 사용하여 도식 문서를 만들었습니다.
- 아이콘 : svgrepo의 아이콘을 사용했습니다.
- 도구: VS Code Studio, Gemini와 Chrome 개발자 도구를 사용했습니다.

### 4. AI 활용 내역 (Gemini)
- `selectDrink` 이후의 구매 처리, 배출, 잔돈 반환으로 이어지는 시간차 비동기 흐름을 해결하기 위해 중첩 setTimeout을 제안받아 사용하였습니다. 
- `useVendingMachine` 훅 리팩토링(거스름돈 타이밍/효과 수정, requestReturnChange 안정화)에 사용했습니다.
- 잔돈 계산 함수 `changeCheck`의 타입 안전성과 오류를 검토하고 수정하는 데 참고했습니다.
- Nano Banana AI를 사용해 간단한 자판기 UI를 추천 받았습니다.


제출 :
- 도식 문서 : [Vending Machine State Diagram.pdf](https://github.com/user-attachments/files/24121245/Vending.Machine.State.Diagram.pdf)

