import pdfReportService from '../services/pdfReportService.js';
import logger from '../utils/logger.js';
import axios from 'axios';

class PdfReportController {
    /**
     * Generate and download PDF report
     * GET /api/merchant/:merchantId/reports/pdf
     */
    async generatePdfReport(req, res) {
        try {
            const { merchantId } = req.params;
            const { startDate, endDate } = req.query;

            // Verify user permission
            const requestUserId = req.user?.id || req.query?.merchantId;
            if (requestUserId && requestUserId !== merchantId) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to generate this report',
                });
            }

            // Validate date range
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'startDate and endDate are required',
                });
            }

            // Fetch restaurant info from restaurant-service
            let restaurantInfo = {
                restaurantName: 'Restaurant',
                address: '',
            };

            try {
                const response = await axios.get(
                    `http://restaurant-service:8081/api/dashboard/merchant/${merchantId}/restaurant`,
                    {
                        headers: req.headers,
                    }
                );
                restaurantInfo = response.data;
            } catch (error) {
                logger.warn('Could not fetch restaurant info:', error.message);
            }

            // Generate PDF
            const pdfDoc = await pdfReportService.generateReport(
                merchantId,
                restaurantInfo,
                startDate,
                endDate
            );

            // Set response headers
            const filename = `dashboard-report-${merchantId}-${startDate}-${endDate}.pdf`;
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

            // Pipe PDF to response
            pdfDoc.pipe(res);
            pdfDoc.end();

            logger.info(`PDF report generated for merchant: ${merchantId}`);
        } catch (error) {
            logger.error('Generate PDF report error:', error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

export default new PdfReportController();
