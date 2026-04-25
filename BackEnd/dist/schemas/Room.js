import mongoose from "mongoose";
const { Schema, model } = mongoose;
const RoomSchema = new Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    currentTrack: {
        type: String,
        // required: true,
        default: "",
    },
});
const RoomModel = model("Room", RoomSchema);
export default RoomModel;
//# sourceMappingURL=Room.js.map