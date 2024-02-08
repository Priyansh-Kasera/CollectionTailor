const express = require("express");
const { showAllUsers, signUp, login, updateUser, logout, getUserDetails, forgotPassword, resetPassword, updatePassword, isLoggedIn } = require("../Controller/userController");
const router = express.Router();

router.route("/showAll").get(showAllUsers)

router.route("/signUp").post(signUp)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/update").put(updateUser)
router.route("/me/:id").get(getUserDetails)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/changePassword").post(updatePassword)
router.route("/isLoggedIn").get(isLoggedIn);
module.exports = router;