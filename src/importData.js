import connectDB from "./database.js";
import readXlsxFile from "read-excel-file/node";
import Track from "../models/Track.js";
import Contract from "../models/Contract.js";
import validateRow from "../utils/validateRow.js";
import processRowData from "../utils/processRow.js";

async function importData() {
  await connectDB();

  let validationErrors = [];

  try {
    const rows = await readXlsxFile("../Track Import Test.xlsx");

    // Start from 2 to skip both the header and the explanatory rows
    for (let i = 2; i < rows.length; i++) {
      const [
        ,
        title,
        version,
        artist,
        rawISRC,
        pLine,
        rawAliases,
        contractName,
      ] = rows[i];

      // Clean the ISRC and split the aliases into an array
      const { isrc, aliasesArray } = processRowData(rawISRC, rawAliases);

      const { isValid, errors } = validateRow(rows[i], i + 1);

      if (!isValid) {
        validationErrors.push(...errors);
        continue;
      }

      // ISRC should be unique and should not exist duplicate ISRC in the database
      const existingTrack = await Track.findOne({
        ISRC: isrc,
      });

      if (existingTrack) {
        console.error(
          `Line ${i + 1}: Track with ISRC "${isrc}" already exists.`
        );
        continue;
      }

      let contractId = null;
      if (contractName) {
        let contract = await Contract.findOne({ name: contractName.trim() });

        if (!contract) {
          console.error(
            `Line ${
              i + 1
            }: Contract named "${contractName}" cannot be found. Skipping track "${title}".`
          );
          continue;
        }
        contractId = contract._id;
      }

      const track = new Track({
        Title: title,
        Version: version,
        Artist: artist,
        ISRC: isrc,
        PLine: pLine,
        Aliases: aliasesArray,
        ContractID: contractId, // will be null if no contractName was provided
      });

      await track.save();
      console.log(`Line ${i + 1}: Track "${title}" imported successfully.`);
    }
  } catch (error) {
    console.error("Error reading the Excel file:", error.message);
    return;
  }

  if (validationErrors.length > 0) {
    console.error("Errors encountered during import data from excel file:");
    validationErrors.forEach((error, index) =>
      console.error(`${index + 1}.`, error)
    );
  } else {
    console.log("Data import completed without any error.");
  }
}

importData().catch(console.error);
