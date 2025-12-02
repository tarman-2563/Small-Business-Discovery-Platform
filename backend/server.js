const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const http = require("http")
const socketIO = require("socket.io")

dotenv.config()

const authRoutes = require("./routes/authRoutes")
const businessRoutes = require("./routes/businessRoutes")
const reviewRoutes = require("./routes/reviewRoutes")
const promotionRoutes = require("./routes/promotionRoutes")
const chatRoutes = require("./routes/chatRoutes")
const adminRoutes = require("./routes/adminRoutes")
const favoriteRoutes = require("./routes/favoriteRoutes")

const app = express()
const server = http.createServer(app)

const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err))

const chatHandler = require("./utils/chatHandler")
chatHandler(io)

app.set("io", io)

app.use("/api/auth", authRoutes)
app.use("/api/businesses", businessRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/promotions", promotionRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/favorites", favoriteRoutes)

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "LocalLens API is running" })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
