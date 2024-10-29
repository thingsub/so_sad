// server.js

require('dotenv').config(); // 환경변수 로드
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./backend/routes/authRoutes'); // 인증 라우트 불러오기
const db = require('./backend/database/db'); // DB 연결 모듈 불러오기
const app = express();
const cors = require('cors');
const path = require('path');  // path 모듈 추가

// CORS 설정에서 Authorization 헤더 허용
app.use(cors({
    origin: 'http://localhost:3000',  // 클라이언트 도메인
    methods: ['GET', 'POST'],  // 허용할 HTTP 메서드
    allowedHeaders: ['Authorization', 'Content-Type'],  // 허용할 헤더에 Authorization 추가
    exposedHeaders: ['Authorization'],  // 클라이언트에서 접근할 수 있는 응답 헤더
    credentials: true  // 자격 증명 허용
}));

// 프리플라이트 요청에 대한 응답 처리 (OPTIONS 요청)
app.options('*', cors());  // 모든 경로에 대해 CORS 허용

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 뷰 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // views 폴더 경로 설정

// 정적 파일 설정 (public 폴더)
app.use(express.static(path.join(__dirname, 'public')));

// 라우팅 설정
app.use('/', authRoutes); // 인증 관련 라우트

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error('서버 오류:', err);
    res.status(500).send('서버에서 오류가 발생했습니다(server.js).');
});

// DB 연결
db.connect();

// 서버 실행
const port = process.env.PORT || 3000; // 포트 설정
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
