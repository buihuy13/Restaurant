import { Eureka } from "eureka-js-client";
import os from "os";

const client = new Eureka({
  instance: {
    app: "order-service", // Tên service hiển thị trên Eureka
    hostName: "localhost", // hostname của máy chạy service
    ipAddr: "127.0.0.1", // ip của máy
    port: { $: process.env.PORT || 8082, "@enabled": true },
    vipAddress: "order-service",
    dataCenterInfo: {
      "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
      name: "MyOwn",
    },
  },
  eureka: {
    host: process.env.EUREKA_SERVER_HOST || "localhost",
    port: process.env.EUREKA_SERVER_PORT || 8761,
    servicePath: process.env.EUREKA_SERVER_PATH,
  },
});

export default client;
