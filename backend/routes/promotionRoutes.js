const express = require("express")
const promotionRouter = express.Router()
const { createPromotion, getPromotions, getPromotion, updatePromotion, deletePromotion } = require("../controllers/promotionController")
const { protect, authorize } = require("../middlewares/auth")

promotionRouter.get("/", getPromotions)
promotionRouter.get("/:id", getPromotion)
promotionRouter.post("/", protect, authorize("business", "admin"), createPromotion)
promotionRouter.put("/:id", protect, authorize("business", "admin"), updatePromotion)
promotionRouter.delete("/:id", protect, authorize("business", "admin"), deletePromotion)

module.exports = promotionRouter
