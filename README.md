# 가계부 (Budget Tracker)

React 기반 가계부 웹 애플리케이션으로, AWS S3 정적 호스팅과 GitHub Actions CI/CD 파이프라인을 통해 자동 배포됩니다.

## 시스템 아키텍처

```
[GitHub Repository]
       │
       │  push (main branch)
       ▼
[GitHub Actions CI/CD]
       │
       │  npm build → S3 upload
       ▼
[AWS S3 Static Hosting]
       │
       ▼
[사용자 브라우저]
```

| 구성 요소 | 기술 |
|-----------|------|
| Frontend | React + Vite |
| Hosting | AWS S3 (정적 웹 호스팅) |
| CI/CD | GitHub Actions |
| Build Tool | Vite |

## 기능 소개

- **수입/지출 등록** — 카테고리, 내용, 금액을 입력하여 거래 내역 추가
- **잔액 요약** — 총 수입, 총 지출, 현재 잔액을 실시간으로 표시
- **카테고리 분류** — 지출(식비, 교통, 쇼핑, 주거, 통신, 기타) / 수입(급여, 용돈, 부수입, 기타)
- **거래 삭제** — 잘못 입력한 내역 삭제 가능
- **반응형 UI** — 모바일/데스크톱 모두 지원

## GitHub Actions CI/CD

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드 및 S3 배포를 수행합니다.

### 워크플로우 파일

`.github/workflows/deploy.yml`에 위치하며, 다음 단계를 수행합니다:

1. 코드 체크아웃
2. Node.js 환경 설정
3. 의존성 설치 (`npm ci`)
4. 프로덕션 빌드 (`npm run build`)
5. 빌드 결과물을 AWS S3 버킷에 업로드

```yaml
name: Deploy to AWS S3

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-session-token: ${{ secrets.AWS_SESSION_TOKEN }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Deploy to S3
        run: aws s3 sync dist/ s3://${{ secrets.AWS_S3_BUCKET }} --delete
```

### GitHub Secrets 설정

Repository → Settings → Secrets and variables → Actions에서 다음 값을 등록해야 합니다:

| Secret Name | 설명 |
|-------------|------|
| `AWS_ACCESS_KEY_ID` | AWS IAM 액세스 키 |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM 시크릿 키 |
| `AWS_SESSION_TOKEN` | AWS 세션 토큰 |
| `AWS_S3_BUCKET` | S3 버킷 이름 |
| `AWS_REGION` | AWS 리전 (예: `us-east-1`) |

## 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 배포 URL

> `http://<버킷이름>.s3-website-us-east-1.amazonaws.com`

## 프로젝트 구조

```
AWS_project/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions 워크플로우
├── src/
│   ├── App.jsx               # 메인 컴포넌트
│   ├── App.css               # 스타일
│   ├── index.css             # 글로벌 스타일
│   └── main.jsx              # 엔트리 포인트
├── index.html
├── package.json
└── vite.config.js
```
