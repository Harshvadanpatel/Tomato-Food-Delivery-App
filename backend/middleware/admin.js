import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const adminMiddleware = async (req, res, next) => {

    const { token } = req.headers;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized! Login Again"
        });
    }

    try {

        const token_decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await userModel.findById(token_decode.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        req.user = {
            id: user._id,
            isAdmin: user.isAdmin
        };

        next();

    } catch (error) {

        console.log(error);

        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

export default adminMiddleware;