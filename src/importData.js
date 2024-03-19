import connectDB from "./database.js";

async function importData() {
  await connectDB();
}

importData().catch(console.error);
