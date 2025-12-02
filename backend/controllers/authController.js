const User = require("../models/userModel")
const jwt = require("jsonwebtoken")

const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d"
  })
}

const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists with this email" })
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
      phone
    })

    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" })
    }

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const token = generateToken(user._id)

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites")
    res.json({ success: true, user })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, avatar },
      { new: true, runValidators: true }
    )
    res.json({ success: true, user })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateProfile
}
