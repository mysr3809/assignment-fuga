function validateRow(row, rowIndex) {
  const [, title, , , isrc, , ,] = row; // keep the rest for future validations

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
