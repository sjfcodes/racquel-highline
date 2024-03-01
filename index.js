import fs from "node:fs";
import { readPdfPages } from "pdf-text-reader";

const run = async (searchTerm, srcDir = "./pdf", outputDir = "./output") => {
  if (!srcDir) throw new Error('missing arg "srcDir"');
  if (!searchTerm) throw new Error('missing arg "searchTerm"');

  const reportAll = {};
  const startTime = Date.now();
  const searchTermLowercase = searchTerm.toLowerCase();
  const files = fs
    .readdirSync(srcDir)
    .filter((fileName) => fileName.endsWith(".pdf"));

  const processPdf = async (file) => {
    const [fileName, fileExtension] = file.split(".");
    const url = `${srcDir}/${fileName}.${fileExtension}`;

    (await readPdfPages({ url })).forEach((page, pageIdx) => {
      const reportPage = {};
      page.lines.forEach((line, lineIdx) => {
        if (line.toLowerCase().includes(searchTermLowercase)) {
          reportPage[lineIdx + 1] = line;
        }
      });

      if (Object.values(reportPage).length) {
        if (!reportAll[file]) reportAll[file] = {};
        reportAll[file][pageIdx + 1] = reportPage;
      }
    });
  };

  await Promise.allSettled(files.map(processPdf));

  const sortedKeys = Object.keys(reportAll).sort();
  const sorted = {};
  for (const key of sortedKeys) {
    sorted[key] = reportAll[key];
  }

  const outputJsonFile = (data) => {
    fs.writeFileSync(
      `${outputDir}/mentions=${searchTerm}.json`,
      JSON.stringify(data),
      "utf8"
    );
  };

  const outputMarkdownFile = (sorted) => {
    const sections = [`# includes keyword: ${searchTerm}`, ""];
    Object.entries(sorted).forEach(([fileName, pages]) => {
      const fileUrl = `${srcDir}/${fileName}`;
      const year = fileName.substring(0, 4);
      const month = fileName.substring(4, 6);
      const day = fileName.substring(6, 8);

      const webUrl = `https://documents.highline.edu/collections/thunderword/${year}/${fileName}`;

      sections.push(`## ${year}-${month}-${day}`);
      Object.entries(pages).forEach(([pageNumber, lines]) => {
        sections.push(
          "",
          `- [page ${pageNumber}](${webUrl}#page=${pageNumber})`
        );
        Object.entries(lines).forEach(([lineNumber, lineText]) => {
          sections.push(`  - line ${lineNumber}: "${lineText}"`);
        });
      });
    });

    const output = sections.join("\n");
    fs.writeFileSync(`${outputDir}/mentions=${searchTerm}.md`, output, "utf8");
  };

  // outputJsonFile(sorted);
  outputMarkdownFile(sorted);
  console.log("completed in:", (Date.now() - startTime) / 1000, "seconds");
  console.log("found matches in:", Object.keys(reportAll).length, "files");
};

// run("racquel", "./test");
run("racquel", "./pdf");
