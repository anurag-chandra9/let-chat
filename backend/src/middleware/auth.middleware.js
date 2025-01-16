// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";

// export const protectRoute = async (req, res, next) => {
//     try {
//         const token =req.cookies.jwt;

//         if(!token){
//          return res.status(401).json({message:"Unauthorized-no token provided"});
//         }
//         const decoded=jwt.verify(token,process.env.JWT_SECRET);
//        // console.log("Decoded token:", decoded);

//         if(!decoded){

//             console.log("Invalid token");
//             return res.status(401).json({message:"Unauthorized-invalid token"});
//         }
//         const user = await User.findById(decoded.userId).select("-password");
//      // console.log("User found:", user);

//         if(!user){

//             console.log("User not found for given token");
//             return res.status(401).json({message:"Unauthorized-no user found"});
//         }

//         req.user=user;
//         next();

//     } catch (error) {
//         console.log("Error in protectRoute middleware",error.message);
//         res.status(500).json({message:"Internal server error"});
        
//     }
// }
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
      //  console.log("Token received:", token);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - no token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            console.log("Invalid token");
            return res.status(401).json({ message: "Unauthorized - invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password").catch(err => {
            //console.error("Database query error:", err);
            throw new Error("Database query failed");
        });

        if (!user) {
            console.log("User not found for given token");
            return res.status(401).json({ message: "Unauthorized - no user found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware", error);
        res.status(500).json({ message: "Internal server error" });
    }
};