const dns = require("dns");
const mongoose = require("mongoose");

// ISP DNS often blocks/fails MongoDB SRV lookups on Windows
if (process.platform === "win32") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set in environment");
  }

  const maxAttempts = 5;
  let lastErr;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log("MongoDB connected");
      return;
    } catch (err) {
      lastErr = err;
      console.error(
        `[db] Connect attempt ${attempt}/${maxAttempts} failed:`,
        err.message
      );
      if (attempt < maxAttempts) await sleep(2000 * attempt);
    }
  }

  const hint =
    "Copy a fresh connection string from MongoDB Atlas → Connect → Drivers. " +
    "If using mongodb+srv and DNS fails, try the standard (non-SRV) URI from Atlas.";
  throw new Error(`${lastErr.message}\n${hint}`);
};

module.exports = connectDB;
