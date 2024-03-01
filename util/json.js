import fs from "node:fs";

export const outputJsonFile = async (outputDir, searchTerm, report) => {
  return fs.writeFileSync(
    `${outputDir}/mentions=${searchTerm}.json`,
    JSON.stringify(report, null, 2),
    "utf8"
  );
};
