// src/utils/AppError.js
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // để phân biệt lỗi do mình ném vs lỗi server crash

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
