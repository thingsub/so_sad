// controllers/authController.js
require('dotenv').config(); // 환경변수 로드
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.root = async (req, res) => {
  res.redirect('/login');
};

exports.register = async (req, res) => {
  try {
    const { id, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
    }

    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return res.status(400).json({ success: false, message: '이미 존재하는 ID입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 유저 생성
    const newUser = new User({ id, password: hashedPassword });
    // 유저 저장
    await newUser.save();
    res.status(201).json({ message: "회원가입이 완료되었습니다.", userId: newUser.id })
  } catch (error) {
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다(회원가입).' });
  }
};

exports.login = async (req, res) => {

  const { id, password } = req.body;
  try {
      // 유저 확인
      const user = await User.findOne({ id });

      if (!user) {
          return res.status(400).json({ error: '등록되지 않은 사용자입니다.' });
      }
      if (!(await bcrypt.compare(password, user.password))) {
           return res.status(400).json({ error: '비밀번호가 잘못되었습니다.' });
    }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      console.log('갓 발급한 토큰(authController_login):', token); // 로그 추가
      res.status(200).json({ token, userId : user.id });

  } catch (error) {
      res.status(500).json({ error: '서버 오류가 발생했습니다.(음)' });
  }
};


// ID 중복 체크
exports.checkIdAvailability = async (req, res) => {
  const { id } = req.body;
  const existingUser = await User.findOne({ id });

  // 중복 ID가 없으면 사용 가능
  if (!existingUser) {
      return res.status(200).json({ available: true });
  }

  // 중복 ID가 있으면 사용 불가
  res.json({ available: false });
};

exports.home = async (req, res) => {
  try {
      const user = req.user; // 미들웨어에서 검증된 사용자 정보 사용
      res.status(200).json({ userId: user.id });
  } catch (error) {
      console.error("서버 오류:", error);
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};



// 로그아웃
exports.logout = (req, res) => {
  res.status(200).json({ message: '로그아웃되었습니다.' });
}