import  jwt  from "jsonwebtoken";

const generateTokenAndSetCookie = (userId,resp)=>{
    const token =jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: "15d",
    })

    resp.cookie("jwt",token,{
        maxAge: 15*24*60*1000,
        httpOnly:true,//prevent xss attacks (cross site scripting attacks)
        sameSite:"strict",//CSRF and cross site request forgery attacks
        secure: process.env.NODE_ENV !== "development"
    })
}

export default generateTokenAndSetCookie