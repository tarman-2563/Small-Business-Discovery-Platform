const express = require('express');
const Business = require('../models/businessModel');
const Review = require('../models/reviewModel');
const { protect, authorize } = require('../middlewares/auth');

const adminRouter = express.Router();

adminRouter.get("/businesses/pending",protect,authorize("admin"),async(req,res)=>{
    try{
        const businesses=await Business.find({status:"pending"}).populate("owner","name email").sort("-createdAt");

        res.json({success: true,businesses})
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
})

adminRouter.put("/businesses/:id/status", protect, authorize("admin"), async (req, res) => {
  try {
    const { status } = req.body
    const business = await Business.findByIdAndUpdate(req.params.id, { status }, { new: true })
    res.json({ success: true, business })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

adminRouter.put("/reviews/:id/moderate", protect, authorize("admin"), async (req, res) => {
  try {
    const { isHidden } = req.body
    const review = await Review.findByIdAndUpdate(req.params.id, { isHidden }, { new: true })
    res.json({ success: true, review })
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = adminRouter

