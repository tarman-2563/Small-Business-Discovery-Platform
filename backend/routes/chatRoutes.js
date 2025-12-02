const express = require("express")
const Chat = require("../models/chatModel")
const { protect } = require("../middlewares/auth")

const chatRouter = express.Router()

chatRouter.get("/", protect, async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.id })
      .populate("business", "name images")
      .sort("-lastMessage")
    res.json({ success: true, chats })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

chatRouter.get("/:businessId", protect, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      user: req.user.id,
      business: req.params.businessId
    }).populate("messages.sender", "name avatar")
    res.json({ success: true, chat: chat || { messages: [] } })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = chatRouter
