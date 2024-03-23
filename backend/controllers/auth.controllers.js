import bcrypt from "bcryptjs"
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateTokens.js";

export const signup = async (req, resp) => {
  // resp.send("user")
  try {
    
    const { fullName, username, password, confirmPassword, gender } =
      req.body;

    if (password !== confirmPassword) {
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

    if(newUser){
      await generateTokenAndSetCookie(newUser._id,resp)
      await newUser.save();

      resp.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else{
      resp.status(400).json({error:"Invalid user data"})
    }
  } catch (error) {
    console.log("Error ", error.message);
    resp.status(500).json({ error: "Internal Server error" });
  }
};


export const login = async (req, resp) => {
  try {
    const {username,password} = req.body
    const user = await User.findOne({username})
    const isPasswordCorrect = await bcrypt.compare(password,user?.password || "")

    if(!user || !isPasswordCorrect){
      return resp.status(400).json({error: "Invalid username or password"})
    }

    generateTokenAndSetCookie(user._id,resp)
    resp.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username:user.username,
      profilePic:user.profilePic
    })

  } catch (error) {
    console.log("Error ", error.message);
    resp.status(500).json({ error: "Internal Server error" });
  }
};


export const logout = (req, resp) => {
  try {
    resp.cookie("jwt","",{maxAge:0})
    resp.status(200).json({message:"Logged out Successfully"})
    
  } catch (error) {
    console.log("Error ", error.message);
    resp.status(500).json({ error: "Internal Server error" });
  }
};
