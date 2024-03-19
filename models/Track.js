import mongoose from "mongoose";

const TrackSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Version: String,
  Artist: String,
  ISRC: { type: String, required: true },
  PLine: String,
  Aliases: [String],
  ContractID: { type: mongoose.Schema.Types.ObjectId, ref: "Contract" },
});

export default mongoose.model("Track", TrackSchema);
