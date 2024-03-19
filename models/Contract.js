import mongoose from "mongoose";

const ContractSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

export default mongoose.model("Contract", ContractSchema);
