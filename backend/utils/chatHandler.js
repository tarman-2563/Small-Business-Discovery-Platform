const Chat = require("../models/chatModel")
const jwt = require("jsonwebtoken")

module.exports = io => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) return next(new Error("Authentication error"))

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.userId = decoded.id
      next()
    } 
    catch {
      next(new Error("Authentication error"))
    }
  })

  io.on("connection", socket => {
    console.log("User connected:", socket.userId)

    socket.on("join-chat", async ({ businessId }) => {
      const roomId = `${socket.userId}-${businessId}`
      socket.join(roomId)
      console.log(`User ${socket.userId} joined chat with business ${businessId}`)
    })

    socket.on("send-message", async ({ businessId, content }) => {
      try {
        const roomId = `${socket.userId}-${businessId}`

        let chat = await Chat.findOne({
          user: socket.userId,
          business: businessId
        })

        if (!chat) {
          chat = await Chat.create({
            user: socket.userId,
            business: businessId,
            messages: []
          })
        }

        const message = {
          sender: socket.userId,
          content,
          timestamp: new Date()
        }

        chat.messages.push(message)
        chat.lastMessage = new Date()
        await chat.save()

        io.to(roomId).emit("new-message", message)
      } 
      catch (error) {
        socket.emit("error", { message: error.message })
      }
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.userId)
    })
  })
}
