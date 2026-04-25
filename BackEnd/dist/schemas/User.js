import mongoose from "mongoose";
const { Schema, model } = mongoose;
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
});
export default model("User", UserSchema);
//# sourceMappingURL=User.js.map