import path from "path";
import fs from "fs-extra";
import hbs from "handlebars";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getBase64FromUrl = async (url: string): Promise<string> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) return "";
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer).toString("base64");
  } catch (error) {
    console.error("Error fetching logo:", error);
    return "";
  }
};

export const generatePdf = async (templateName: string, data: any) => {
  let browser = null;
  try {
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      const chromium = (await import("@sparticuz/chromium")).default;
      const puppeteerCore = (await import("puppeteer-core")).default;
      
      browser = await puppeteerCore.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      const puppeteer = (await import("puppeteer")).default;
      try {
        browser = await puppeteer.launch({
          channel: "chrome",
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-web-security",
          ],
        });
      } catch (chromeLaunchErr) {
        console.warn("Could not launch system Chrome, trying bundled Chromium...", chromeLaunchErr);
        browser = await puppeteer.launch({
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-web-security",
          ],
        });
      }
    }
    const page = await browser.newPage();

    const logoUrl =
      "https://res.cloudinary.com/dwduymu1l/image/upload/v1769187917/Patuakhali_Science_and_Technology_University_logo_rv2zwu.png";
    const base64Logo = await getBase64FromUrl(logoUrl);
    const logoTag = base64Logo
      ? `<img src="data:image/png;base64,${base64Logo}" style="width: 50px; height: 50px; margin-bottom: 5px;" />`
      : "";

    let templatePath = path.join(
      process.cwd(),
      "src",
      "templates",
      templateName,
    );
    if (!(await fs.pathExists(templatePath))) {
      templatePath = path.join(__dirname, "../templates", templateName);
    }
    if (!(await fs.pathExists(templatePath))) {
      templatePath = path.join(__dirname, "../../src/templates", templateName);
    }

    if (!(await fs.pathExists(templatePath))) {
      throw new Error(`Template file not found: ${templateName}`);
    }

    const content = await fs.readFile(templatePath, "utf-8");
    const template = hbs.compile(content);
    const html = template(data);

    await page.setContent(html, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    const headerTemplate = `
            <div style="width: 100%; text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 0;">
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    ${logoTag}
                    <div style="text-align: center;">
                        <h2 style="margin: 0; font-size: 16px; color: #003366; font-family: Helvetica, sans-serif; font-weight: bold;">Patuakhali Science and Technology University</h2>
                        <span style="font-size: 10px; color: #555; font-family: Helvetica, sans-serif;">Dumki, Patuakhali-8602, Bangladesh</span>
                    </div>
                </div>
            </div>
        `;

    const footerTemplate = `
            <div style="font-size: 8px; width: 100%; text-align: center; border-top: 1px solid #ddd; padding-top: 5px; color: #777; font-family: sans-serif;">
                Page <span class="pageNumber"></span> of <span class="totalPages"></span>
            </div>
        `;

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: headerTemplate,
      footerTemplate: footerTemplate,
      margin: {
        top: "120px",
        bottom: "50px",
        left: "20px",
        right: "20px",
      },
    });

    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error(`❌ Error generating PDF for template ${templateName}:`, error);
    throw error;
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
};
