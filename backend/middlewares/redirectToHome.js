require("dotenv").config();
const jwt = require("jsonwebtoken");

// 미들웨어 함수: 토큰이 있는 경우 home으로 리다이렉트
module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    console.log("토큰이 존재합니다:", token);
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      console.log("토큰이 유효합니다. /home으로 리다이렉트합니다.");
      return res.redirect("/home"); // 토큰이 유효하면 /home으로 리다이렉트
    } catch (err) {
      // 토큰 검증 실패 시 다음 미들웨어로 이동
      next();
    }
  } else {
    console.log("토큰이 없습니다. 다음 미들웨어로 이동합니다 ^오^");
    next(); // 토큰이 없으면 다음 미들웨어로 이동
  }
};
