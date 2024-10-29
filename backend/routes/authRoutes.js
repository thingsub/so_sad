// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware'); 
const User = require("../models/user")


router.get('/', authController.root);

router.get('/login', (req, res) => {
    res.render('login');  // login.ejs 파일을 렌더링
  });

router.get('/register', (req, res) => {
    console.log(req.headers);
    res.render('register');  // register.ejs 파일을 렌더링
  });  

// 로그인 엔드포인트
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/check-id', authController.checkIdAvailability);

// 홈 화면 엔드포인트
router.get('/home',authMiddleware, authController.home);

// 로그아웃 처리
router.get('/logout', authController.logout);

module.exports = router;
