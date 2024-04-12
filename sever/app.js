import express from "express"
import { Server } from "socket.io"
import { createServer } from "http"
import cors from "cors"
const PORT = 3000

const app = express()
app.use(cors())
const server = new createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    },
})

io.on("connection", (socket) => {
    console.log("user connected");
    console.log("socket.id", socket.id);
    socket.on("message", ({ room, message }) => {
        console.log(room, message);
        // io.emit("recieve-message", data)
        // socket.broadcast.emit("recieve-message", data)
        // socket.broadcast.to(room).emit("receive-message", message);
        socket.to(room).emit("recieve-message", message)
    })
    socket.on("join-room", (room) => {

        socket.join(room)
        console.log(`use joined  ${room} group`)
    })

    socket.on("disconnected", () => {
        console.log("user disconnected");
    })
})
app.get("/", (req, res) => {
    res.send("hello motherfucker")
})
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})