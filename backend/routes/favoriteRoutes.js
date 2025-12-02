const express = require("express")
const User = require("../models/userModel")
const { protect } = require("../middlewares/auth")

const favoriteRouter = express.Router()

favoriteRouter.post("/:businessId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user.favorites.includes(req.params.businessId)) {
      user.favorites.push(req.params.businessId)
      await user.save()
    }
    res.json({ success: true, favorites: user.favorites })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

favoriteRouter.delete("/:businessId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    user.favorites = user.favorites.filter(id => id.toString() !== req.params.businessId)
    await user.save()
    res.json({ success: true, favorites: user.favorites })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

favoriteRouter.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites")
    res.json({ success: true, favorites: user.favorites })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = favoriteRouter
