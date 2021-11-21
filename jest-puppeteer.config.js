module.exports = {
  launch: {
    headless: process.env.HEADLESS !== "false",
    executablePath: process.env.CHROME_BIN || null,
    args: process.env.CI ? ["--disable-gpu", "--disable-dev-shm-usage", "--no-sandbox"] : [],
  },
};
