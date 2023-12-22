const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const Campground = require('../models/campground');
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware');
const Reviews = require('../controllers/reviews')






router.post('/',isLoggedIn,validateReview, catchAsync(Reviews.createReview));

router.delete('/:reviewId', isLoggedIn,isReviewAuthor,catchAsync(Reviews.deleteReview))

module.exports = router