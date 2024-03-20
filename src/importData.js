import connectDB from "./database.js";
import readXlsxFile from "read-excel-file/node";
import Track from "../models/Track.js";
import Contract from "../models/Contract.js";
import validateRow from "../utils/validationRow.js";

async function importData() {
  await connectDB();

  const rows = await readXlsxFile("../Track Import Test8.xlsx");

  let errors = [];

  // Start from 2 to skip both the header and the explanatory rows
  for (let i = 2; i < rows.length; i++) {
    const [, title, version, artist, isrc, pLine, aliases, contractName] =
      rows[i];

    const { isValid, errors: validationErrors } = validateRow(rows[i], i + 1);

    if (!isValid) {
      errors.push(...validationErrors);
      continue;
    }

    // Split and trim aliases
    const aliasesArray = aliases
      ? aliases.split(";").map((alias) => alias.trim())
      : [];

    // ISRC should be unique and should not exist duplicate ISRC in the database
    const existingTrack = await Track.findOne({
      ISRC: isrc,
    });

    if (existingTrack) {
      console.log(`Line ${i + 1}: Track with ISRC "${isrc}" already exists.`);
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
  }

  if (errors.length > 0) {
    console.log("Errors encountered during import:");
    errors.forEach((error, index) => console.log(`${index + 1}.`, error));
  } else {
    console.log("Data import completed without any error.");
  }
}

importData().catch(console.error);
