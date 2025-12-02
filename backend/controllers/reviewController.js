const Review = require("../models/reviewModel")
const Business = require("../models/businessModel")

const updateBusinessRating = async businessId => {
  try {
    const reviews = await Review.find({
      business: businessId,
      isApproved: true,
      isHidden: false
    })

    if (reviews.length === 0) {
      await Business.findByIdAndUpdate(businessId, { rating: 0, reviewCount: 0 })
      return
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length

    await Business.findByIdAndUpdate(businessId, {
      rating: averageRating.toFixed(1),
      reviewCount: reviews.length
    })
  } 
  catch (error) {
    console.error("Error updating business rating:", error)
  }
}

const createReview = async (req, res) => {
  try {
    const { business, rating, comment, images } = req.body

    const businessExists = await Business.findById(business)
    if (!businessExists) {
      return res.status(404).json({ success: false, message: "Business not found" })
    }

    const existingReview = await Review.findOne({
      user: req.user.id,
      business
    })

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this business"
      })
    }

    const review = await Review.create({
      user: req.user.id,
      business,
      rating,
      comment,
      images: images || []
    })

    await updateBusinessRating(business)

    const populatedReview = await Review.findById(review._id).populate("user", "name avatar")

    res.status(201).json({ success: true, review: populatedReview })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getBusinessReviews = async (req, res) => {
  try {
    const { businessId } = req.params

    const reviews = await Review.find({
      business: businessId,
      isApproved: true,
      isHidden: false
    })
      .populate("user", "name avatar")
      .sort("-createdAt")

    res.json({ success: true, count: reviews.length, reviews })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  createReview,
  getBusinessReviews
}
