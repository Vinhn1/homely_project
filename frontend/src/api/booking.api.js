import axiosInstance from './axiosInstance';

export const bookingApi = {
  // Create a new booking
  createBooking: (bookingData) => axiosInstance.post('/bookings', bookingData),
  
  // Get all bookings for the logged-in user
  getMyBookings: () => axiosInstance.get('/bookings/my-bookings'),
  
  // Get all bookings for an owner's property
  getPropertyBookings: (propertyId) => axiosInstance.get(`/bookings/property/${propertyId}`),
  
  // Update booking status (owner only)
  updateBookingStatus: (bookingId, status) => axiosInstance.patch(`/bookings/${bookingId}/status`, { status }),
  
  // Get all booking requests for properties owned by the logged-in user
  getOwnerRequests: () => axiosInstance.get('/bookings/owner-requests'),
};
