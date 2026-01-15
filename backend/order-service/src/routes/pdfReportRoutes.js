import express from 'express';
import pdfReportController from '../controllers/pdfReportController.js';

const router = express.Router();

// PDF Report routes
router.get('/:merchantId/reports/pdf', pdfReportController.generatePdfReport);

export default router;
