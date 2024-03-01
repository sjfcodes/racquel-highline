import fs from "node:fs";
import { readPdfPages } from "pdf-text-reader";



export const getReportPdfIncludesTerm = async (pdfSrcDir, searchTerm) => {
  const report = {};
  const searchTermLowercase = searchTerm.toLowerCase();

  const files = fs
    .readdirSync(pdfSrcDir)
    .filter((fileName) => fileName.endsWith(".pdf"));

  const processPdf = async (file) => {
    const [fileName, fileExtension] = file.split(".");
    const url = `${pdfSrcDir}/${fileName}.${fileExtension}`;

    const pages = await readPdfPages({ url });

    pages.forEach((page, pageIdx) => {
      const reportPage = {};
      page.lines.forEach((line, lineIdx) => {
        if (line.toLowerCase().includes(searchTermLowercase)) {
          reportPage[lineIdx + 1] = line;
        }
      });

      if (Object.values(reportPage).length) {
        if (!report[file]) report[file] = {};
        report[file][pageIdx + 1] = reportPage;
      }
    });
  };

  await Promise.allSettled(files.map(processPdf));

  const sortedKeys = Object.keys(report).sort();
  const sorted = {};
  for (const key of sortedKeys) {
    sorted[key] = report[key];
  }

  return sorted;
};
