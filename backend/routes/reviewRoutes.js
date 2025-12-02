const express = require('express');
const reviewRouter = express.Router();
const { createReview, getBusinessReviews } = require('../controllers/reviewController');
const { protect } = require('../middlewares/auth');

reviewRouter.post('/', protect, createReview);
reviewRouter.get('/business/:businessId', getBusinessReviews);

module.exports = reviewRouter;
