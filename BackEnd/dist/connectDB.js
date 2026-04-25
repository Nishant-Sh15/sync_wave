import mongoose from "mongoose";
async function main() {
    await mongoose.connect(process.env.ATLASDB_URL?.replace("<db_password>", process.env.ATLAS_PASSWORD || "") || "");
}
export default main;
//# sourceMappingURL=connectDB.js.map