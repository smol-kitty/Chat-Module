const db = require("../config/db");

async function getNextPhotoId() {
  await db.query("INSERT INTO photo_counter VALUES ()");
  const [[row]] = await db.query("SELECT LAST_INSERT_ID() AS id");
  return row.id;
}

module.exports = { getNextPhotoId };
