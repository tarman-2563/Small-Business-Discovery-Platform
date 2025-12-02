const Business = require("../models/businessModel")
const { uploadToCloudinary } = require("../utils/cloudinary")

const createBusiness = async (req, res) => {
  try {
    const { name, description, category, location, phone, email, website, hours } = req.body

    let imageUrls = []
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path)
        imageUrls.push(result.secure_url)
      }
    }

    const business = await Business.create({
      owner: req.user.id,
      name,
      description,
      category,
      location: {
        type: "Point",
        coordinates: [parseFloat(location.lng), parseFloat(location.lat)],
        address: location.address
      },
      phone,
      email,
      website,
      hours,
      images: imageUrls
    })

    res.status(201).json({ success: true, business })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getBusinesses = async (req, res) => {
  try {
    const { category, rating, status, search } = req.query

    let query = { isActive: true }
    if (category) query.category = category
    if (rating) query.rating = { $gte: parseFloat(rating) }
    if (status) query.status = status
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    }

    const businesses = await Business.find(query).populate("owner", "name email").sort("-createdAt")
    res.json({ success: true, count: businesses.length, businesses })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getNearbyBusinesses = async (req, res) => {
  try {
    const { lat, lng, distance = 10, category, rating } = req.query

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: "Please provide latitude and longitude" })
    }

    const distanceInMeters = parseFloat(distance) * 1000

    let query = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: distanceInMeters
        }
      },
      isActive: true,
      status: "approved"
    }

    if (category) query.category = category
    if (rating) query.rating = { $gte: parseFloat(rating) }

    const businesses = await Business.find(query).populate("owner", "name email").limit(50)
    res.json({ success: true, count: businesses.length, businesses })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).populate("owner", "name email phone")
    if (!business) return res.status(404).json({ success: false, message: "Business not found" })
    res.json({ success: true, business })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const updateBusiness = async (req, res) => {
  try {
    let business = await Business.findById(req.params.id)
    if (!business) return res.status(404).json({ success: false, message: "Business not found" })

    if (business.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to update this business" })
    }

    if (req.files && req.files.length > 0) {
      let imageUrls = [...business.images]
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path)
        imageUrls.push(result.secure_url)
      }
      req.body.images = imageUrls
    }

    if (req.body.location) {
      req.body.location = {
        type: "Point",
        coordinates: [parseFloat(req.body.location.lng), parseFloat(req.body.location.lat)],
        address: req.body.location.address
      }
    }

    business = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    res.json({ success: true, business })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
    if (!business) return res.status(404).json({ success: false, message: "Business not found" })

    if (business.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this business" })
    }

    await business.deleteOne()
    res.json({ success: true, message: "Business deleted successfully" })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  createBusiness,
  getBusinesses,
  getNearbyBusinesses,
  getBusiness,
  updateBusiness,
  deleteBusiness
}
