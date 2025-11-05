import logger from './logger.js';

// Wrapper để đảm bảo Eureka có đủ các phương thức debug/info/warn/error
const eurekaLogger = {
    debug: (msg) => (logger.debug ? logger.debug(msg) : console.debug(msg)),
    info: (msg) => (logger.info ? logger.info(msg) : console.info(msg)),
    warn: (msg) => (logger.warn ? logger.warn(msg) : console.warn(msg)),
    error: (msg) => (logger.error ? logger.error(msg) : console.error(msg)),
};

export default eurekaLogger;
