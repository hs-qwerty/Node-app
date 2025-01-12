const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../logs/health_logs.json");

const logToFile = (data) => {
  const logs = fs.existsSync(logFilePath)
    ? JSON.parse(fs.readFileSync(logFilePath))
    : [];
  logs.push(data);
  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2), "utf8");
};

module.exports = { logToFile };
