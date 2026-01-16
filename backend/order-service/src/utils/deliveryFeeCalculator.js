import logger from './logger.js';

/**
 * Calculate delivery fee based on distance and duration
 * @param {number} distance - Distance in kilometers
 * @param {number} duration - Duration in minutes
 * @returns {number} Delivery fee in USD (rounded to 2 decimal places)
 */
export function calculateDeliveryFee(distance = 0, duration = 0) {
    // Pricing structure (in USD)
    const BASE_FEE = 0.60; // Base delivery fee
    const DISTANCE_RATE = 0.20; // Per kilometer
    const TIME_RATE = 0.08; // Per 10 minutes
    const MIN_FEE = 0.60; // Minimum delivery fee
    const MAX_FEE = 4.00; // Maximum delivery fee

    try {
        // Validate inputs
        const validDistance = Math.max(0, parseFloat(distance) || 0);
        const validDuration = Math.max(0, parseInt(duration) || 0);

        // Calculate fee
        let fee = BASE_FEE;
        fee += validDistance * DISTANCE_RATE;
        fee += Math.floor(validDuration / 10) * TIME_RATE;

        // Apply min/max constraints
        fee = Math.max(MIN_FEE, Math.min(MAX_FEE, fee));

        // Round to 2 decimal places
        const finalFee = Math.round(fee * 100) / 100;

        logger.info(
            `Delivery fee calculated: distance=${validDistance}km, duration=${validDuration}min, fee=$${finalFee}`,
        );

        return finalFee;
    } catch (error) {
        logger.error(`Error calculating delivery fee: ${error.message}`);
        return MIN_FEE; // Fallback to minimum fee
    }
}

/**
 * Get delivery fee pricing structure
 * @returns {object} Pricing configuration
 */
export function getDeliveryFeePricing() {
    return {
        baseFee: 0.6,
        distanceRate: 0.2,
        timeRate: 0.08,
        minFee: 0.6,
        maxFee: 4.0,
        currency: 'USD',
    };
}

export default {
    calculateDeliveryFee,
    getDeliveryFeePricing,
};
