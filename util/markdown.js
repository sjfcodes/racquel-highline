import fs from "node:fs";
import { getHttpsUrl } from "./general.js";

const getMarkdownFromReport = (searchTerm, report) => {
  const sections = [`# includes keyword: ${searchTerm}`, ""];
  Object.entries(report).forEach(([fileName, pages]) => {
    const year = fileName.substring(0, 4);
    const month = fileName.substring(4, 6);
    const day = fileName.substring(6, 8);

    sections.push(`## ${year}-${month}-${day}`);
    Object.entries(pages).forEach(([pageNumber, lines]) => {
      sections.push(
        "",
        `- [page ${pageNumber}](${getHttpsUrl(
          year,
          fileName
        )}#page=${pageNumber})`
      );
      Object.entries(lines).forEach(([lineNumber, lineText]) => {
        sections.push(`  - line ${lineNumber}: "${lineText}"`);
      });
    });
  });

  return sections.join("\n");
};

export const outputReportMarkdownFile = (outputDir, searchTerm, report) => {
  return fs.writeFileSync(
    `${outputDir}/mentions=${searchTerm}.md`,
    getMarkdownFromReport(searchTerm, report),
    "utf8"
  );
};
