function validateRow(
  [id, title, version, artist, isrc, pLine, aliases, contractName],
  rowIndex
) {
  let isValid = true;
  let errors = [];

  if (!title) {
    isValid = false;
    errors.push(`Line ${rowIndex}: Title is required.`);
  }

  if (!isrc) {
    isValid = false;
    errors.push(`Line ${rowIndex}: ISRC is required.`);
  }

  return { isValid, errors };
}

export default validateRow;
