const express = require("express")
const { createBusiness, getBusinesses, getNearbyBusinesses, getBusiness, updateBusiness, deleteBusiness } = require("../controllers/businessController")
const { protect, authorize } = require("../middlewares/auth")
const upload = require("../middlewares/upload")

const businessRouter = express.Router()

businessRouter.get("/nearby", getNearbyBusinesses)
businessRouter.get("/", getBusinesses)
businessRouter.get("/:id", getBusiness)
businessRouter.post("/", protect, authorize("business", "admin"), upload.array("images", 5), createBusiness)
businessRouter.put("/:id", protect, authorize("business", "admin"), upload.array("images", 5), updateBusiness)
businessRouter.delete("/:id", protect, authorize("business", "admin"), deleteBusiness)

module.exports = businessRouter
