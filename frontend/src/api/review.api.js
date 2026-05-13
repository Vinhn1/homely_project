import axiosInstance from './axiosInstance';

export const reviewApi = {
  // Get all reviews for a property
  getReviewsByProperty: (propertyId) => axiosInstance.get(`/reviews/property/${propertyId}`),
  
  // Create a new review
  createReview: (reviewData) => axiosInstance.post('/reviews', reviewData),
  
  // Delete a review
  deleteReview: (reviewId) => axiosInstance.delete(`/reviews/${reviewId}`),
};
