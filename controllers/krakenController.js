const axios = require("axios");
const Redis = require("ioredis");
const { logToFile } = require("../utils/logger.js");
const { REDIS_PORT, REDIS_HOST } = require("../config/config.js");

const statusCheck = async () => {
  const redisClient = new Redis({
    port: REDIS_PORT,
    host: REDIS_HOST,
  });

  const startTime = Date.now();

  return await axios
    .get("https://api.kraken.com/0/public/SystemStatus")
    .then((response) => {
      const { status, timestamp } = response.data.result;
      console.log(`Kraken Status: ${status}, Timestamp: ${timestamp}`);

      const responseTime = Date.now() - startTime;

      const data = {
        name: "kraken",
        status: "online",
        responseTime,
        timestamp: new Date().toISOString(),
      };

      console.log(data);
      logToFile(data);

      redisClient.set(timestamp, JSON.stringify(status), "EX", 3600);
      return {
        status: true,
        message: `Status: ${status}, Timestamp: ${timestamp}`,
      };
    })
    .catch((error) => {
      console.error("Error checking Kraken health:", error.message);
      return {
        status: false,
        message: "Failed to fetch Kraken health status.",
      };
    });
};
const status = async (req, res) => {
  const result = await statusCheck();

  if (result.status) {
    return res.status(200).json({
      status: true,
      message: result.message,
    });
  } else {
    return res.status(503).json({
      status: false,
      message: result.message,
    });
  }
};

module.exports = { status, statusCheck };
