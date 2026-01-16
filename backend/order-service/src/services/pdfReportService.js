import PDFDocument from 'pdfkit';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import merchantDashboardService from './merchantDashboardService.js';
import logger from '../utils/logger.js';

class PdfReportService {
    constructor() {
        // Chart configuration
        this.chartJSNodeCanvas = new ChartJSNodeCanvas({
            width: 800,
            height: 400,
            backgroundColour: 'white',
        });
    }

    /**
     * Generate comprehensive PDF report for merchant
     */
    async generateReport(merchantId, restaurantInfo, startDate, endDate) {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 50, bottom: 50, left: 50, right: 50 },
                info: {
                    Title: `Dashboard Report - ${restaurantInfo.restaurantName}`,
                    Author: 'Restaurant Management System',
                    Subject: `Dashboard Report ${startDate} to ${endDate}`,
                },
            });

            // Fetch all data
            const [overview, revenue, ratings, hourly, timeAnalytics, topProducts, statusBreakdown] =
                await Promise.all([
                    merchantDashboardService.getMerchantOverview(merchantId, startDate, endDate),
                    merchantDashboardService.getRevenueAnalytics(merchantId, startDate, endDate),
                    merchantDashboardService.getRatingStatistics(merchantId, startDate, endDate),
                    merchantDashboardService.getHourlyStatistics(merchantId, startDate, endDate),
                    merchantDashboardService.getTimeBasedAnalytics(merchantId, startDate, endDate),
                    merchantDashboardService.getTopProducts(merchantId, 10, startDate, endDate),
                    merchantDashboardService.getOrderStatusBreakdown(merchantId, startDate, endDate),
                ]);

            // Generate PDF content
            await this._addHeader(doc, restaurantInfo, startDate, endDate);
            await this._addExecutiveSummary(doc, overview, revenue);
            await this._addRevenueSection(doc, revenue);
            await this._addOrderAnalytics(doc, statusBreakdown, overview);
            await this._addTopProducts(doc, topProducts);
            await this._addRatingSection(doc, ratings);
            await this._addTimeAnalytics(doc, hourly, timeAnalytics);
            this._addFooter(doc);

            return doc;
        } catch (error) {
            logger.error('Error generating PDF report:', error);
            throw new Error('Failed to generate PDF report');
        }
    }

    /**
     * Add header section
     */
    async _addHeader(doc, restaurantInfo, startDate, endDate) {
        // Title
        doc.fontSize(24)
            .fillColor('#2563eb')
            .text('DASHBOARD REPORT', { align: 'center' });

        doc.moveDown(0.5);

        // Restaurant info
        doc.fontSize(16)
            .fillColor('#1f2937')
            .text(restaurantInfo.restaurantName || 'N/A', { align: 'center' });

        doc.fontSize(10)
            .fillColor('#6b7280')
            .text(restaurantInfo.address || '', { align: 'center' });

        doc.moveDown(0.5);

        // Date range
        doc.fontSize(12)
            .fillColor('#374151')
            .text(
                `Period: ${this._formatDate(startDate)} - ${this._formatDate(endDate)}`,
                { align: 'center' }
            );

        doc.moveDown(1);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#e5e7eb');
        doc.moveDown(1);
    }

    /**
     * Add executive summary
     */
    async _addExecutiveSummary(doc, overview, revenue) {
        this._addSectionTitle(doc, 'EXECUTIVE SUMMARY');

        const summaryData = [
            ['Total Orders', this._formatNumber(overview.totalOrders)],
            ['Total Revenue', this._formatCurrency(overview.totalRevenue)],
            ['Avg Order Value', this._formatCurrency(overview.averageOrderValue)],
            ['Completed Orders', this._formatNumber(overview.completedOrders)],
            ['Processing Orders', this._formatNumber(overview.pendingOrders + overview.confirmedOrders + overview.preparingOrders)],
            ['Cancelled Orders', this._formatNumber(overview.cancelledOrders)],
        ];

        this._addTable(doc, summaryData, 2);
        doc.moveDown(1);
    }

    /**
     * Add revenue section
     */
    async _addRevenueSection(doc, revenue) {
        this._addSectionTitle(doc, 'REVENUE ANALYTICS');

        doc.fontSize(10).fillColor('#374151');
        doc.text(`Total Revenue: ${this._formatCurrency(revenue.totalRevenue)}`);
        doc.text(`Total Orders: ${this._formatNumber(revenue.totalOrders)}`);
        doc.text(`Avg Order Value: ${this._formatCurrency(revenue.averageOrderValue)}`);
        doc.moveDown(1);

        if (revenue.revenueByRestaurant && revenue.revenueByRestaurant.length > 0) {
            const revenueData = revenue.revenueByRestaurant.map((r) => [
                r.restaurantName,
                this._formatNumber(r.totalOrders),
                this._formatCurrency(r.totalRevenue),
            ]);

            this._addTable(doc, [['Restaurant Name', 'Total Orders', 'Total Revenue'], ...revenueData], 3);
        }

        doc.moveDown(1);
    }

    /**
     * Add order analytics
     */
    async _addOrderAnalytics(doc, statusBreakdown, overview) {
        if (doc.y > 600) doc.addPage();

        this._addSectionTitle(doc, 'ORDER ANALYTICS');

        // Status breakdown table
        if (statusBreakdown && statusBreakdown.length > 0) {
            const statusData = statusBreakdown.map((s) => [
                this._translateStatus(s.status),
                this._formatNumber(s.count),
                this._formatCurrency(s.totalAmount),
            ]);

            this._addTable(doc, [['Order Status', 'Order Count', 'Total Amount'], ...statusData], 3);
        }

        doc.moveDown(1);
    }

    /**
     * Add top products
     */
    async _addTopProducts(doc, topProducts) {
        if (doc.y > 600) doc.addPage();

        this._addSectionTitle(doc, 'TOP SELLING PRODUCTS');

        if (topProducts && topProducts.length > 0) {
            const productData = topProducts.map((p, index) => [
                `${index + 1}`,
                p.productName,
                this._formatNumber(p.totalQuantity),
                this._formatCurrency(p.totalRevenue),
            ]);

            this._addTable(
                doc,
                [['Rank', 'Product Name', 'Quantity Sold', 'Total Revenue'], ...productData],
                4
            );
        } else {
            doc.fontSize(10).fillColor('#6b7280').text('No data available');
        }

        doc.moveDown(1);
    }

    /**
     * Add rating section
     */
    async _addRatingSection(doc, ratings) {
        if (doc.y > 600) doc.addPage();

        this._addSectionTitle(doc, 'CUSTOMER RATINGS');

        doc.fontSize(10).fillColor('#374151');
        doc.text(`Total Ratings: ${this._formatNumber(ratings.totalRatings)}`);
        doc.text(`Average Rating: ${ratings.averageRating.toFixed(1)}/5.0`);
        doc.moveDown(0.5);

        // Rating distribution
        if (ratings.ratingDistribution) {
            const ratingData = [
                ['5 Stars', this._formatNumber(ratings.ratingDistribution[5])],
                ['4 Stars', this._formatNumber(ratings.ratingDistribution[4])],
                ['3 Stars', this._formatNumber(ratings.ratingDistribution[3])],
                ['2 Stars', this._formatNumber(ratings.ratingDistribution[2])],
                ['1 Star', this._formatNumber(ratings.ratingDistribution[1])],
            ];

            this._addTable(doc, ratingData, 2);
        }

        doc.moveDown(1);
    }

    /**
     * Add time analytics
     */
    async _addTimeAnalytics(doc, hourly, timeAnalytics) {
        if (doc.y > 600) doc.addPage();

        this._addSectionTitle(doc, 'TIME-BASED ANALYTICS');

        // Peak hour
        doc.fontSize(10).fillColor('#374151');
        doc.text(`Peak Hour: ${timeAnalytics.peakHour.hour}:00 (${this._formatNumber(timeAnalytics.peakHour.totalOrders)} orders)`);
        doc.text(`Busiest Day: ${timeAnalytics.busiestDay.dayName} (${this._formatNumber(timeAnalytics.busiestDay.totalOrders)} orders)`);
        doc.moveDown(1);

        // Top 5 busiest hours
        const topHours = hourly
            .sort((a, b) => b.totalOrders - a.totalOrders)
            .slice(0, 5)
            .map((h, index) => [
                `${index + 1}`,
                `${h.hour}:00 - ${h.hour + 1}:00`,
                this._formatNumber(h.totalOrders),
                this._formatCurrency(h.totalRevenue),
            ]);

        this._addTable(doc, [['Rank', 'Time Period', 'Total Orders', 'Total Revenue'], ...topHours], 4);

        doc.moveDown(1);
    }

    /**
     * Add footer
     */
    _addFooter(doc) {
        const pages = doc.bufferedPageRange();
        for (let i = pages.start; i < pages.start + pages.count; i++) {
            doc.switchToPage(i);

            doc.fontSize(8)
                .fillColor('#9ca3af')
                .text(
                    `Page ${i - pages.start + 1} / ${pages.count}`,
                    50,
                    doc.page.height - 50,
                    { align: 'center' }
                );

            doc.text(
                `Generated: ${new Date().toLocaleString('en-US')}`,
                50,
                doc.page.height - 35,
                { align: 'center' }
            );
        }
    }

    /**
     * Helper: Add section title
     */
    _addSectionTitle(doc, title) {
        doc.fontSize(14)
            .fillColor('#1f2937')
            .text(title, { underline: false });
        doc.moveDown(0.5);
    }

    /**
     * Helper: Add table
     */
    _addTable(doc, data, columns) {
        const startY = doc.y;
        const cellPadding = 8;
        const rowHeight = 25;
        const tableWidth = 495;
        const colWidth = tableWidth / columns;

        data.forEach((row, rowIndex) => {
            const y = startY + rowIndex * rowHeight;

            // Check if need new page
            if (y > 700) {
                doc.addPage();
                return;
            }

            // Background for header
            if (rowIndex === 0) {
                doc.rect(50, y, tableWidth, rowHeight).fill('#f3f4f6');
            }

            // Draw cells
            row.forEach((cell, colIndex) => {
                const x = 50 + colIndex * colWidth;

                // Cell border
                doc.rect(x, y, colWidth, rowHeight).stroke('#e5e7eb');

                // Cell text
                doc.fontSize(9)
                    .fillColor(rowIndex === 0 ? '#1f2937' : '#374151')
                    .text(cell || '', x + cellPadding, y + cellPadding, {
                        width: colWidth - cellPadding * 2,
                        height: rowHeight - cellPadding * 2,
                        align: colIndex === 0 ? 'left' : 'right',
                    });
            });
        });

        doc.y = startY + data.length * rowHeight + 10;
    }

    /**
     * Helper: Format currency
     */
    _formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'VND',
        }).format(amount || 0);
    }

    /**
     * Helper: Format number
     */
    _formatNumber(num) {
        return new Intl.NumberFormat('en-US').format(num || 0);
    }

    /**
     * Helper: Format date
     */
    _formatDate(dateString) {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US');
    }

    /**
     * Helper: Translate status
     */
    _translateStatus(status) {
        const translations = {
            pending: 'Pending',
            confirmed: 'Confirmed',
            preparing: 'Preparing',
            ready: 'Ready',
            completed: 'Completed',
            cancelled: 'Cancelled',
        };
        return translations[status] || status;
    }
}

export default new PdfReportService();
