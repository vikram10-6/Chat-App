export const signup = async(req, resp) => {
  try {
    const {fullName,username,password,confirmedPassword,gender}= req.body

  } catch (error) {
    
  }
};
export const login = (req, resp) => {
  console.log("Login User");
};
export const logout = (req, resp) => {
  console.log("Logout User");
};
