import { Eureka } from "eureka-js-client";

// hostname container trong network Docker Compose
const EUREKA_HOST = process.env.EUREKA_SERVER_HOST || "service-discovery";

const client = new Eureka({
  instance: {
    app: "order-service", // Tên service hiển thị trên Eureka
    hostName: "order-service", // hostname của container
    ipAddr: "127.0.0.1", // không quan trọng trong Docker, Eureka vẫn hiển thị ipAddr
    port: { $: parseInt(process.env.PORT) || 8082, "@enabled": true },
    vipAddress: "order-service",
    dataCenterInfo: {
      "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
      name: "MyOwn",
    },
  },
  eureka: {
    host: EUREKA_HOST, // host service-discovery container
    port: parseInt(process.env.EUREKA_SERVER_PORT) || 8761,
    servicePath: process.env.EUREKA_SERVER_PATH || "/eureka/",
  },
});

// tự động đăng ký với Eureka khi client start
client.logger.level("debug");
client.start();

export default client;
