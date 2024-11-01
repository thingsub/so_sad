// controllers/authController.js
require("dotenv").config(); // 환경변수 로드
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 원래 login으로의 redirect만 남겼는데 배포할 때 보니까 login 거쳐서 home으로 감
// exports.root = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (token) {
//     console.log("토큰이 존재합니다:", token);
//     try {
//       jwt.verify(token, process.env.JWT_SECRET);
//       return res.redirect("/home"); // 토큰이 유효하면 /home으로 리다이렉트
//     } catch (err) {
//       return res.redirect("/login");
//     }
//   } else {
//     console.log("토큰이 없습니다. 다음 미들웨어로 이동합니다 ^오^");
//     return res.redirect("/home");
//   }
// };

exports.root = async (req, res) => res.redirect("/login");

exports.register = async (req, res) => {
  try {
    const { id, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "비밀번호가 일치하지 않습니다." });
    }

    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "이미 존재하는 ID입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 유저 생성
    const newUser = new User({ id, password: hashedPassword });
    // 유저 저장
    await newUser.save();
    res
      .status(201)
      .json({ message: "회원가입이 완료되었습니다.", userId: newUser.id });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다(회원가입)." });
  }
};

exports.login = async (req, res) => {
  const { id, password } = req.body;
  try {
    // 유저 확인
    const user = await User.findOne({ id });

    if (!user) {
      return res.status(400).json({ error: "등록되지 않은 사용자입니다." });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "비밀번호가 잘못되었습니다." });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("갓 발급한 토큰(authController_login):", token); // 로그 추가
    res.status(200).json({ token, userId: user.id });
  } catch (error) {
    res.status(500).json({ error: "서버 오류가 발생했습니다.(음)" });
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

exports.checkHome = async (req, res) => {
  try {
    if (!req.user) {
      // req.user가 없다면 인증이 누락된 것으로 간주하여 에러 반환
      return res
        .status(401)
        .json({ message: "인증된 사용자 정보가 없습니다." });
    }

    const user = req.user; // 미들웨어에서 검증된 사용자 정보 사용
    res.status(200).json({ userId: user.id });
  } catch (error) {
    console.error("서버 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 로그아웃
exports.logout = (req, res) => {
  res.status(200).json({ message: "로그아웃되었습니다." });
};
