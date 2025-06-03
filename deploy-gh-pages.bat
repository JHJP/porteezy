@echo off
REM 자동 배포 스크립트: 코드 수정 후 실행하세요.

REM 1. 빌드
npm run build
if %errorlevel% neq 0 (
    echo 빌드 실패. 오류를 확인하세요.
    exit /b %errorlevel%
)

REM 2. 빌드 결과물을 루트로 복사
xcopy /E /Y build\* .\

REM 3. 변경 파일 git add/commit
REM (변경된 파일만 add)
git add asset-manifest.json index.html static\css\* static\js\*
git commit -m "자동 배포: 코드/빌드 결과 반영"

REM 4. gh-pages 브랜치에 푸시
git push origin gh-pages

echo ======================
echo 배포 스크립트 완료!
echo 사이트를 새로고침해서 반영 여부를 확인하세요.
echo ======================
