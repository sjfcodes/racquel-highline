import { outputJsonFile } from "./util/json.js";
import { outputReportMarkdownFile } from "./util/markdown.js";
import { getReportPdfIncludesTerm } from "./util/report.js";

const run = async (searchTerm, pdfSrcDir = "./pdf", outputDir = "./output") => {
  if (!pdfSrcDir) throw new Error('missing arg "pdfSrcDir"');
  if (!searchTerm) throw new Error('missing arg "searchTerm"');

  const startTime = Date.now();
  const report = await getReportPdfIncludesTerm(pdfSrcDir, searchTerm);

  outputJsonFile(outputDir, searchTerm, report);
  outputReportMarkdownFile(outputDir, searchTerm, report);

  console.log("completed in:", (Date.now() - startTime) / 1000, "seconds");
  console.log("found matches in:", Object.keys(report).length, "files");
};

// run("racquel", "./test");
run("racquel", "./pdf");
