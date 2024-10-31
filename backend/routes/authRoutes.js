// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const redirectToHome = require("../middlewares/redirectToHome");
const User = require("../models/user");

router.get("/", redirectToHome, authController.root);
router.get("/login", redirectToHome, (req, res) => res.render("login"));
router.get("/register", redirectToHome, (req, res) => res.render("register"));
router.get("/home", redirectToHome, (req, res) => res.render("home"));

// 로그인 엔드포인트
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/check-id", authController.checkIdAvailability);

// 홈 화면 엔드포인트
router.get("/check-home", authMiddleware, authController.checkHome);

// 로그아웃 처리
router.get("/logout", authController.logout);

module.exports = router;
