const express = require("express");
const router = express.Router();
const {
  registerUser,
  getUser,
  loginUser,
  updateUser,
  deleteUserHandler,
} = require("../controllers/usersController");
const { middleware } = require("../middleware/authMiddleware");

/* GET users listing. */
router.get("/get", [middleware.userAuthentication, middleware.adminAuthentication], getUser);
/* Register user */
router.post("/register", registerUser);
/* Login user */
router.post("/login", loginUser);
/* Update user */
router.patch(["/update/:id", "/update"], [middleware.userAuthentication, middleware.creatorAuthentication, middleware.adminAuthentication], updateUser);

router.delete("/user/delete/:userId", [middleware.userAuthentication, middleware.creatorAuthentication, middleware.adminAuthentication], deleteUserHandler);

module.exports = router;