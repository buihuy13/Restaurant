import axios from 'axios';
import logger from '../utils/logger.js';

class RestaurantService {
    constructor() {
        this.baseUrl = (process.env.RESTAURANT_SERVICE_URL || 'http://restaurant-service:8085').replace(/\/$/, '');
    }

    /**
     * Find restaurant ID by merchant ID
     * @param {string} merchantId 
     * @returns {Promise<string|null>} restaurantId
     */
    async findResIdByMerchantId(merchantId) {
        if (!merchantId) return null;

        try {
            const url = `${this.baseUrl}/api/restaurant/merchant/${encodeURIComponent(merchantId)}`;
            logger.info(`Fetching restaurant for merchant: ${merchantId}`, { url });

            const response = await axios.get(url, { timeout: 5000 });

            // The response is a list of restaurants
            const restaurants = response.data?.data || response.data;

            if (Array.isArray(restaurants) && restaurants.length > 0) {
                // Return the first restaurant ID
                const resId = restaurants[0].id;
                logger.info(`Found restaurant ${resId} for merchant ${merchantId}`);
                return resId;
            }

            logger.warn(`No restaurant found for merchant ${merchantId}`);
            return null;
        } catch (error) {
            logger.error(`Error fetching restaurant for merchant ${merchantId}:`, {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
            return null;
        }
    }
}

export default new RestaurantService();
