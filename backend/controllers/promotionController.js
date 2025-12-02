const Promotion = require("../models/promotionModel")
const Business = require("../models/businessModel")

const createPromotion = async (req, res) => {
  try {
    const { business, title, description, discount, image, expiryDate } = req.body

    const businessDoc = await Business.findById(business)
    if (!businessDoc) return res.status(404).json({ success: false, message: "Business not found" })

    if (businessDoc.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    const promotion = await Promotion.create({
      business,
      title,
      description,
      discount,
      image,
      expiryDate
    })

    res.status(201).json({ success: true, promotion })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getPromotions = async (req, res) => {
  try {
    const { business } = req.query

    let query = { isActive: true, expiryDate: { $gte: new Date() } }
    if (business) query.business = business

    const promotions = await Promotion.find(query)
      .populate("business", "name location images")
      .sort("-createdAt")

    res.json({ success: true, count: promotions.length, promotions })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getPromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id).populate(
      "business",
      "name location images"
    )

    if (!promotion) return res.status(404).json({ success: false, message: "Promotion not found" })

    res.json({ success: true, promotion })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id)
    if (!promotion) return res.status(404).json({ success: false, message: "Promotion not found" })

    const businessDoc = await Business.findById(promotion.business)
    if (!businessDoc) return res.status(404).json({ success: false, message: "Business not found" })

    if (businessDoc.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    const updatedPromotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate("business", "name location images")

    res.json({ success: true, promotion: updatedPromotion })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id)
    if (!promotion) return res.status(404).json({ success: false, message: "Promotion not found" })

    const businessDoc = await Business.findById(promotion.business)
    if (!businessDoc) return res.status(404).json({ success: false, message: "Business not found" })

    if (businessDoc.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    await promotion.deleteOne()
    res.json({ success: true, message: "Promotion deleted successfully" })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  createPromotion,
  getPromotions,
  getPromotion,
  updatePromotion,
  deletePromotion
}
