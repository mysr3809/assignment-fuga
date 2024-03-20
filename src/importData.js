import connectDB from "./database.js";
import readXlsxFile from "read-excel-file/node";
import Track from "../models/Track.js";
import Contract from "../models/Contract.js";
import validateRow from "../utils/validationRow.js";

async function importData() {
  await connectDB();

  // Read the Excel file
  readXlsxFile("../Track Import Test.xlsx").then(async (rows) => {
    // Start from 2 to skip both the header and the explanatory rows
    for (let i = 2; i < rows.length; i++) {
      const [id, title, version, artist, isrc, pLine, aliases, contractName] =
        rows[i];

      // Validate the row
      const { isValid, errors } = validateRow(rows[i], i + 1);

      if (!isValid) {
        console.error(`Errors encountered on row ${i + 1}:`, errors.join("; "));
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
        console.log(`Track with ISRC "${isrc}" already exists. Skipping.`);
        continue;
      }

      let contractId = null; // Initialize contractId to null by default
      if (contractName) {
        // find the contract by name
        let contract = await Contract.findOne({ name: contractName.trim() });

        // check if a contract was found or not
        if (contract) {
          contractId = contract._id;
        } else {
          console.error(
            `Contract can not be found with name "${contractName}". Skipping track "${title}".`
          );
          continue;
        }
      }

      // Create a new Track object and save it to the database
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
  });
}

importData().catch(console.error);
