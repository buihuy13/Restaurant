import os from 'os';
import { Eureka } from 'eureka-js-client';
import eurekaLogger from '../utils/eurekaLogger.js';
import logger from '../utils/logger.js';

const getLocalIp = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
};

const eurekaClient = new Eureka({
    instance: {
        instanceId: `${getLocalIp()}:blog-service:${process.env.BLOG_PORT || 8087}`,
        app: 'BLOG-SERVICE',
        hostName: process.env.EUREKA_INSTANCE_HOSTNAME || 'blog-service',
        ipAddr: getLocalIp(),
        port: {
            $: parseInt(process.env.BLOG_PORT) || 8087,
            '@enabled': true,
        },
        vipAddress: 'blog-service',
        statusPageUrl: `http://${process.env.EUREKA_INSTANCE_HOSTNAME || 'blog-service'}:${
            process.env.BLOG_PORT || 8087
        }/health`,
        healthCheckUrl: `http://${process.env.EUREKA_INSTANCE_HOSTNAME || 'blog-service'}:${
            process.env.BLOG_PORT || 8082
        }/health`,
        homePageUrl: `http://${process.env.EUREKA_INSTANCE_HOSTNAME || 'blog-service'}:${
            process.env.BLOG_PORT || 8082
        }`,
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
        metadata: {
            'management.port': process.env.BLOG_PORT || 8082,
        },
    },
    eureka: {
        host: process.env.EUREKA_HOST || 'service-discovery',
        port: parseInt(process.env.EUREKA_PORT) || 8761,
        servicePath: '/eureka/apps/',
        maxRetries: 10,
        requestRetryDelay: 5000,
        heartbeatInterval: 30000,
        registryFetchInterval: 30000,
    },
    logger: eurekaLogger,
});

export const startEurekaClient = () => {
    eurekaClient.start((error) => {
        if (error) {
            logger.error('Eureka registration failed:', error);
        } else {
            logger.info('Order Service registered with Eureka successfully');
        }
    });

    const shutdown = () => {
        logger.info('Deregistering from Eureka...');
        eurekaClient.stop(() => {
            logger.info('Eureka client stopped');
            process.exit(0);
        });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
};

export default eurekaClient;
