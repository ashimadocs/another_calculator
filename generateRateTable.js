const fs = require("fs");

const csv = fs.readFileSync("cases.csv", "utf8");
const lines = csv.trim().split("\n");

const result = lines
  .filter((line) => line.trim() && line.split(",").length > 13) // skip empty/trailing lines
  .map((line) => {
    const cols = line.split(",");
    // Adjust indices if your CSV columns differ!
    return {
      startDayType: cols[1].trim(),
      rule: cols[2].trim(),
      newSettingsCode: cols[3].trim(),
      startHoliday: cols[4].trim(),
      startRates: {
        HOL: parseFloat(cols[5]),
        NSD: parseFloat(cols[6]),
        OT: parseFloat(cols[7]),
      },
      endDayType: cols[9].trim(),
      endHoliday: cols[10].trim(),
      endRates: {
        HOL: parseFloat(cols[11]),
        NSD: parseFloat(cols[12]),
        OT: parseFloat(cols[13]),
      },
    };
  });

fs.writeFileSync(
  "rateTable.js",
  "export const rateTable = " + JSON.stringify(result, null, 2) + ";\n"
);
console.log("rateTable.js generated!");
