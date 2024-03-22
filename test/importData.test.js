import { expect } from "chai";
import validateRow from "../utils/validateRow.js";
import processRowData from "../utils/processRow.js";

describe("Row Validation", function () {
  it("should validate a row successfully with all required fields", function () {
    const row = [
      null,
      "Track 1",
      "Version 1",
      "Artist 1",
      "ISRC1",
      "P Line 1",
      "alias1;alias2",
      "Contract 1",
    ];
    const rowIndex = 3;

    const { isValid, errors } = validateRow(row, rowIndex);

    expect(isValid).to.be.true;
    expect(errors).to.be.empty;
  });

  it("should flag rows with missing required fields as invalid", function () {
    const row = [
      null,
      "", // Missing Title
      "Version 1",
      "Artist 1",
      "ISRC1",
      "P Line 1",
      "alias1;alias2",
      "Contract 1",
    ];
    const rowIndex = 4;

    const { isValid, errors } = validateRow(row, rowIndex);

    expect(isValid).to.be.false;
    expect(errors).to.include(`Line ${rowIndex}: Title is required.`);
  });

  it("should flag rows with missing required fields as invalid", function () {
    const row = [
      null,
      "Track 1",
      "Version 1",
      "Artist 1",
      "", // Missing ISRC
      "P Line 1",
      "alias1;alias2",
      "Contract 1",
    ];
    const rowIndex = 5;

    const { isValid, errors } = validateRow(row, rowIndex);

    expect(isValid).to.be.false;
    expect(errors).to.include(`Line ${rowIndex}: ISRC is required.`);
  });

  it("should validate a row successfully even without a contract name", function () {
    const row = [
      null,
      "Track 2",
      "Version 2",
      "Artist 2",
      "ISRC2",
      "P Line 2",
      "alias3;alias4",
      "", // No Contract Name
    ];
    const rowIndex = 5;

    const { isValid, errors } = validateRow(row, rowIndex);

    expect(isValid).to.be.true;
    expect(errors).to.be.empty;
  });
});

describe("Row Data Processing", function () {
  it("should ISRC be cleaned", function () {
    const rawISRC = "ISRC 1";
    const { isrc } = processRowData(rawISRC, "");
    expect(isrc).to.equal("ISRC1");
  });

  it("should split aliases into an array", function () {
    const rawAliases = "alias1;alias2";
    const { aliasesArray } = processRowData("ISRC1", rawAliases);
    expect(aliasesArray).to.deep.equal(["alias1", "alias2"]);
  });
});
