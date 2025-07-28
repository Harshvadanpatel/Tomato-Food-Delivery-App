import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    // OLD CODE:
    // const { token } = req.headers;
    // if (!token) {
    //     return res.json({success:false,message:"Not Authorized! Login Again"})
    // }
    // try {
    //     const token_decode = jwt.verify(token,process.env.JWT_SECRET);
    //     req.body.userId = token_decode.id; // ❌ modifies req.body
    //     next();
    // } catch (error) {
    //     console.log(error);
    //     res.json({success:false,message:"Error"})
    // }

    // ✅ NEW CODE:
    const { token } = req.headers;
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized! Login Again" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id }; // ✅ store in req.user instead of req.body
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export default authMiddleware;
