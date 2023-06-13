## 1. 개발 환경 세팅 방식
### mysql 설치 과정
- https://dev.mysql.com/downloads/mysql/ 로 접속하여 운영체제에 맞게 설치
- 설치 유형: "Typical" 또는 "Standard"을 선택
- 데이터베이스 설정: "Server Only" 또는 "Server and Client"를 선택
- 인증 방법: "Use Legacy Authentication Method"을 선택
- 비밀번호 설정: "Enable Validate Password Plugin"을 선택하고 관리자 비밀번호를 입력

### Frontend 설치 command
- node.js가 설치되었다고 가정하고 `vue` 설치하는 방법
```shell
npm install -g @vue/cli
```
### Backend 설치 command
- `nestJS` 프레임워크 설치
```shell
npm i -g @nestjs/cli
```
### Database 테이블 생성 sql
- 터미널에서 아래 command line을 입력하여 `mysql`에 접속 후 데이터베이스 생성
```shell
mysql -u root -p 비밀번호입력
CREATE DATABASE aresa
```

## 2. 서비스 실행 방식
### Frontend 실행 command
- 순서대로 입력
```shell
cd front
npm install
npm run serve
```
### Backend 실행 command
- 순서대로 입력
```shell
cd back
npm install
npm run typeorm schema:sync
npm run start
```
## 3. 예제 실행 Step 별 화면 변경사항
### DB 에 아무 정보 없을 때 화면
> 클라이언트와 서버가 실행이되면 자동적으로 데이터베이스에 2000년부터 2033년도까지의 가격이 0으로 초기화됩니다.
<img width="1000" alt="스크린샷 2023-06-14 오전 3 55 35" src="https://github.com/cheimbus/aresa/assets/87293880/256a6069-4a57-4ca2-90b9-2313faabaeb6">

### POST historical_price 에 임의의 값 post
- post curl 커멘드
```shell
curl -X POST -H "Content-Type: application/json" -d '{
  "aptId": 1101105,
  "year": 2023,
  "monthStart": 3,
  "value": 10
}' http://localhost:3000/aresa-api/historical_price
```
- post 이후 새로고침 화면
<img width="1000" alt="스크린샷 2023-06-14 오전 4 19 51" src="https://github.com/cheimbus/aresa/assets/87293880/a5c339d2-cbf5-454b-a90b-6b5006e2d7d4">

### POST futurel_price 에 임의의 값 post
- post curl 커멘드
```shell
curl -X POST -H "Content-Type: application/json" -d '{
  "aptId": 1101105,
  "year": 2030,
  "monthStart": 6,
  "value": 100
}' http://localhost:3000/aresa-api/future_price
```
- post 이후 새로고침 화면
<img width="1000" alt="스크린샷 2023-06-14 오전 4 36 26" src="https://github.com/cheimbus/aresa/assets/87293880/7e9e34e7-831c-4fde-ab98-f922e5546170">
