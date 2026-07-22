const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/src/components/quotation/sections/quantity/quantity-data.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// We will extract all the exported arrays and process them.
const exportsRegex = /export const (\w+):\s*RowDef\[\]\s*=\s*(\[[\s\S]*?\]);/g;

function shouldMainRowBeCalculated(parentSl) {
  if (parentSl === "1" || parentSl.startsWith("1.")) return true;
  if (parentSl.startsWith("2.") && Number(parentSl.split(".")[1]) <= 6) return true;
  if (parentSl.startsWith("3.") && Number(parentSl.split(".")[1]) <= 9) return true;
  if (parentSl.startsWith("4.") && Number(parentSl.split(".")[1]) <= 19) return true;
  if (parentSl.startsWith("5.") && Number(parentSl.split(".")[1]) <= 6) return true;
  if (parentSl.startsWith("6.") && Number(parentSl.split(".")[1]) <= 3) return true;
  return false;
}

function shouldSubRowBeCalculated(parentSl) {
  if (parentSl === "2.1") return false; // exclude subsection
  return shouldMainRowBeCalculated(parentSl);
}

let newContent = `import type { RowDef } from './QuantityTableTypes';\n\n`;

let match;
while ((match = exportsRegex.exec(content)) !== null) {
  const varName = match[1];
  const arrayStr = match[2];

  let array;
  try {
    // We can evaluate it safely since we know it's just data
    array = eval(`(${arrayStr})`);
  } catch (e) {
    console.error("Failed to parse", varName, e);
    process.exit(1);
  }

  for (const row of array) {
    if (row.sl && shouldMainRowBeCalculated(row.sl)) {
      row.isCalculated = true;
    }
    if (row.subRows && row.sl && shouldSubRowBeCalculated(row.sl)) {
      for (const subRow of row.subRows) {
        if (subRow.addlField || subRow.purchField) {
          subRow.isCalculated = true;
          
          const excludeSubRows = {
            "1.1": ["a"],
            "1.2": ["a"],
            "1.3": ["a"],
            "1.4": ["a"],
            "1.5": ["a"],
            "1.6": ["a"],
            "1.7": ["a"],
            "5.1": ["b"],
          };
          
          if (excludeSubRows[row.sl] && excludeSubRows[row.sl].includes(subRow.sl)) {
            delete subRow.isCalculated;
          }
          
          if ((row.sl === "6.2" || row.sl === "6.3") && subRow.addlField) {
            delete subRow.isCalculated;
          }
        }
      }
    }
  }

  const jsonStr = JSON.stringify(array, null, 2);
  newContent += `export const ${varName}: RowDef[] = ${jsonStr};\n\n`;
}

fs.writeFileSync(filePath, newContent);
console.log('Done!');
