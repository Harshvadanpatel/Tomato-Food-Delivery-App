import foodModel from "../models/foodModel.js";
import fs from "fs";
import { redisClient } from "../config/redis.js";

// Add food item
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });

    try {
        await food.save();

        // Delete old food cache
        await redisClient.del("food_list");

        console.log("Food added and Redis cache cleared");

        res.json({
            success: true,
            message: "Food Added"
        });

    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: "Error"
        });
    }
};


// All food list
const listFood = async (req, res) => {
    try {

        // 1. Check Redis first
        const cachedFoods = await redisClient.get("food_list");

        if (cachedFoods) {
            console.log("Food list from Redis");

            return res.json({
                success: true,
                data: JSON.parse(cachedFoods)
            });
        }

        // 2. Redis doesn't have data
        console.log("Food list from MongoDB");

        const foods = await foodModel.find({});

        // 3. Store food list in Redis for 5 minutes
        await redisClient.set(
            "food_list",
            JSON.stringify(foods),
            {
                EX: 300
            }
        );

        // 4. Send data to frontend
        res.json({
            success: true,
            data: foods
        });

    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: "Error"
        });
    }
};


// Remove food item
const removeFood = async (req, res) => {
    try {

        const food = await foodModel.findById(req.body.id);

        fs.unlink(`uploads/${food.image}`, () => {});

        await foodModel.findByIdAndDelete(req.body.id);

        // Delete old food cache
        await redisClient.del("food_list");

        console.log("Food removed and Redis cache cleared");

        res.json({
            success: true,
            message: "Food Removed"
        });

    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: "Error"
        });
    }
};


export {
    addFood,
    listFood,
    removeFood
};

