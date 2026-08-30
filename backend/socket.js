import { Server } from "socket.io";

let io;

const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO is not initialized");
    }

    return io;
};

export { initSocket, getIO };

