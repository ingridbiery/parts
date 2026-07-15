const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPING', 'ARRIVED']

// What each status can transition to next (used by the distributor UI/resolver)
const NEXT_STATUS = {
  PENDING: 'PROCESSING',
  PROCESSING: 'SHIPPING',
  SHIPPING: 'ARRIVED',
  ARRIVED: null,
}

module.exports = { ORDER_STATUSES, NEXT_STATUS }