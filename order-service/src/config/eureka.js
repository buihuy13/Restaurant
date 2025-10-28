import { Eureka } from "eureka-js-client";
import logger from "../utils/logger.js";

const eurekaClient = new Eureka({
  instance: {
    app: "ORDER-SERVICE",
    hostName: process.env.EUREKA_INSTANCE_HOSTNAME || "localhost",
    ipAddr: process.env.EUREKA_INSTANCE_IP || "127.0.0.1",
    port: {
      $: parseInt(process.env.PORT) || 8082,
      "@enabled": true,
    },
    vipAddress: "order-service",
    statusPageUrl: `http://${
      process.env.EUREKA_INSTANCE_HOSTNAME || "localhost"
    }:${process.env.PORT || 8082}/health`,
    healthCheckUrl: `http://${
      process.env.EUREKA_INSTANCE_HOSTNAME || "localhost"
    }:${process.env.PORT || 8082}/health`,
    homePageUrl: `http://${
      process.env.EUREKA_INSTANCE_HOSTNAME || "localhost"
    }:${process.env.PORT || 8082}`,
    dataCenterInfo: {
      "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
      name: "MyOwn",
    },
    metadata: {
      "management.port": process.env.PORT || 3003,
      version: "1.0.0",
      nodeVersion: process.version,
    },
  },
  eureka: {
    host: process.env.EUREKA_HOST || "localhost",
    port: parseInt(process.env.EUREKA_PORT) || 8761,
    servicePath: "/eureka/apps/",
    maxRetries: 10,
    requestRetryDelay: 5000,
    heartbeatInterval: 30000,
    registryFetchInterval: 30000,
  },
  // logger: {
  //   level: "info",
  //   write: (message) => {
  //     logger.info(`Eureka Client: ${message}`);
  //   },
  // },
});

export const startEurekaClient = () => {
  eurekaClient.start((error) => {
    if (error) {
      logger.error("Eureka registration failed:", error);
    } else {
      logger.info("Order Service registered with Eureka successfully");
      logger.info(
        `Registered at: http://${process.env.EUREKA_HOST}:${process.env.EUREKA_PORT}`
      );
    }
  });

  const shutdown = () => {
    logger.info("Deregistering from Eureka...");
    eurekaClient.stop(() => {
      logger.info("Eureka client stopped");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

export default eurekaClient;
