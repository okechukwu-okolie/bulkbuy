import AppUser from "../model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export const login = async (req, res) => {
  const { email, password, isActive } = req.body;
  try {
    const user = await AppUser.findOne({ email });
    if (!user) return res.status(404).json({ message: "user not found" });
    if (!user.isActive)
      return res
        .status(403)
        .json({ message: "account is deactivated, contact admin" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "invalid credentials" });
    const token = jwt.sign(
      { id: user._id, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    const refreshToken = jwt.sign(
      { id: user._id, roles: user.roles },
      process.env.refresh_key,
      { expiresIn: "7d" },
    );

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    res.status(200).json({ message: "login successful", token, refreshToken });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error" });
  }
};
