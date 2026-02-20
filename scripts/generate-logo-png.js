/**
 * Generate PNG logo assets from SVG files.
 * Run: node scripts/generate-logo-png.js
 * Requires: npm install sharp
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");

async function generatePNGs() {
  const svgFullColor = fs.readFileSync(path.join(publicDir, "logo-paymentrecovery.svg"));
  const svgWhite = fs.readFileSync(path.join(publicDir, "logo-paymentrecovery-white.svg"));
  const svgIcon = fs.readFileSync(path.join(publicDir, "logo-icon.svg"));

  await sharp(svgFullColor)
    .png()
    .resize(1200, 400)
    .toFile(path.join(publicDir, "logo-paymentrecovery.png"));

  await sharp(svgWhite)
    .png()
    .resize(1200, 400)
    .toFile(path.join(publicDir, "logo-paymentrecovery-white.png"));

  await sharp(svgIcon)
    .png()
    .resize(512, 512)
    .toFile(path.join(publicDir, "logo-paymentrecovery-icon.png"));

  const svgLogo = fs.readFileSync(path.join(publicDir, "logo.svg"));
  await sharp(svgLogo)
    .png()
    .resize(480, 100)
    .toFile(path.join(publicDir, "logo-email.png"));

  console.log("Generated: logo-paymentrecovery.png, logo-paymentrecovery-white.png, logo-paymentrecovery-icon.png, logo-email.png");
}

generatePNGs().catch((err) => {
  console.error(err);
  process.exit(1);
});
