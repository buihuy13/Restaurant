import os from 'os';
import EurekaClient from 'eureka-js-client';
import logger from '../utils/logger.js';
import eurekaLogger from '../utils/eurekaLogger.js';

const { Eureka } = EurekaClient;

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
        instanceId: `${getLocalIp()}:payment-service:${process.env.ORDER_SERVICE_URL || 'http://payment-service:8083'}`,
        app: 'PAYMENT-SERVICE',
        hostName: process.env.EUREKA_INSTANCE_HOSTNAME || 'payment-service',
        ipAddr: getLocalIp(),
        port: {
            $: parseInt(process.env.PAYMENT_PORT) || 8083,
            '@enabled': true,
        },
        vipAddress: 'payment-service',
        statusPageUrl: `http://${process.env.EUREKA_INSTANCE_HOSTNAME || 'payment-service'}:${
            process.env.PAYMENT_PORT || 8083
        }/health`,
        healthCheckUrl: `http://${process.env.EUREKA_INSTANCE_HOSTNAME || 'payment-service'}:${
            process.env.PAYMENT_PORT || 8083
        }/health`,
        homePageUrl: `http://${process.env.EUREKA_INSTANCE_HOSTNAME || 'payment-service'}:${
            process.env.PAYMENT_PORT || 8083
        }`,
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
        metadata: {
            'management.port': process.env.PAYMENT_PORT || 8083,
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

export default eurekaClient;
