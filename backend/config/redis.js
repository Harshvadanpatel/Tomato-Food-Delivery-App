import { createClient } from "redis";

const redisClient = createClient({
    //url: "redis://redis:6379"
    url: "redis://localhost:6379"

});

redisClient.on("error", (error) => {
    console.log("Redis Error:", error);
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Redis connected");
    } catch (error) {
        console.log("Redis connection failed:", error);
    }
};

export { redisClient, connectRedis };

//cd C:\Users\HARSHVADAN\OneDrive\Desktop\Food-del
//docker compose up --build