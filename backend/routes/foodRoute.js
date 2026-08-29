import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import adminMiddleware from "../middleware/admin.js";

const foodRouter = express.Router();

// Image Storage Engine

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Admin only routes
foodRouter.post("/add", adminMiddleware, upload.single("image"), addFood);

foodRouter.get("/list", listFood);

foodRouter.post("/remove", adminMiddleware, removeFood);

export default foodRouter;