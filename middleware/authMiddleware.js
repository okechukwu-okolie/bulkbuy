import jwt from 'jsonwebtoken'
import AppUser from '../model/userModel.js'
import dotenv from 'dotenv'
dotenv.config()


// export const auth = async(req,res,next)=>{
//     let token;

//   // 1. Check if the token exists in the Headers
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       // Get token from header (Format: "Bearer <token>")
//       token = req.headers.authorization.split(' ')[1];
      
//       // 2. Verify the token
//       const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//       return res.json(decoded)

//       // 3. Find the user and attach them to the Request object
//       // We exclude the password for security
//       req.user = await AppUser.findById(decoded.id).select('-password');

//       // 4. Move to the next function (the Controller)
//       next();
//     } catch (error) {
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   }

//   if (!token) {
//     res.status(401).json({ message: 'Not authorized, no token' });
//   }
// }


export const auth = async (req, res, next) => {


  // 1. Check if the token exists in the Headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
    const  token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // 3. Find the user and attach them to the Request object
      // We exclude the password for security
      req.user = await AppUser.findById(decoded.id).select('-password');

      // 4. Move to the next function (the Controller)
      return next(); // Use return to ensure no further code in this function runs
      
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If we reach here, it means no token was found in the header
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};