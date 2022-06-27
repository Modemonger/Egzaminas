const express = require("express");
const router = express.Router();
const {
  registerUser,
  getUser,
  loginUser,
  updateUser,
  deleteUserHandler,
  getLecturers,

} = require("../controllers/usersController");
const { middleware } = require("../middleware/authMiddleware");

/* GET users listing. */
router.get("/get", middleware.adminAuthentication, getUser);

router.get('/get-lecturers', getLecturers);
/* Register user */
router.post("/register", registerUser);
/* Login user */
router.post("/login", loginUser);
/* Update user */
router.patch(["/update/:id", "/update"], middleware.adminAuthentication, updateUser);

router.delete("/user/delete/:userId", middleware.adminAuthentication, deleteUserHandler);

module.exports = router;