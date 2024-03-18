import bcrypt from "bcryptjs"
import User from "../models/user.model.js";

export const signup = async (req, resp) => {
  // resp.send("user")
  try {
    
    const { fullName, username, password, confirmedPassword, gender } =
      req.body;

    if (password !== confirmedPassword) {
      return resp.status(400).json({ error: "Password dont match" });
    }

    const user = await User.findOne({ username });
    if (user) {
      return resp.status(400).json({ error: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    await newUser.save();

    resp.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log("Error ", error.message);
    resp.status(500).json({ error: "Internal Server error" });
  }
};
export const login = (req, resp) => {
  // resp.send("user")
  console.log("Login User");
};
export const logout = (req, resp) => {
  console.log("Logout User");
};
