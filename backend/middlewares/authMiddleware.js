// middleware/authMiddleware.js
// 클라이언트가 home같은 인증 필수 페이지에 접근하고자 토큰 검증 요청 보냄.

const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// JWT 인증 미들웨어
module.exports = async (req, res, next) => {
  console.log("authMiddleware 실행됨"); // 미들웨어 실행 여부 확인
  console.log(
    "애초에 Authorization 헤더 내 값이 존재하나?:",
    req.headers.authorization
  );
  // console.log("혹시 이상한 곳 간 것 아냐?? 쿠키라던가:", req.cookies);

  const token = req.headers.authorization?.split(" ")[1]; // 헤더에서 토큰 분리
  console.log("미들웨어가 받은 토큰:", token); // 토큰이 제대로 전달되었는지 확인

  // 이 코드가 여기 있는게 타당하진 않다만
  if (!req.headers.authorization) {
    console.log(
      "미들웨어.js : auth 헤더가 없습니다. 로그인으로 리다이렉트합니다 ㅋ."
    );
    return res.status(401).json({ message: "헤더도 없는데 토큰은 무슨 " });
  }

  if (!token) {
    console.log("미들웨어.js : 토큰이 없습니다. 로그인으로 리다이렉트합니다.");
    return res
      .status(401)
      .json({ message: "토큰이 없습니다. 인증이 거부되었습니다." });
  }

  // JWT 토큰 검증
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //const user = await User.findOne({id : decoded.userId});

    if (!user) {
      return res.status(401).json({ message: "사용자를 찾을 수 없습니다." });
    }

    req.user = user; // 요청 객체에 사용자 정보 추가
    next(); // 다음 미들웨어로 이동
  } catch (err) {
    console.error("토큰 검증 오류:", err);
    res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};
