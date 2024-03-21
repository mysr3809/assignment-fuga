function processRowData(rawISRC, rawAliases) {
  const isrc = cleanISRC(rawISRC);

  const aliasesArray = rawAliases
    ? rawAliases.split(";").map((alias) => alias.trim())
    : [];

  return { isrc, aliasesArray };
}

function cleanISRC(isrc) {
  return isrc.replace(/[^a-zA-Z0-9]/g, "");
}

export default processRowData;
