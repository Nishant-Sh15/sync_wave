import mongoose from "mongoose";

const { Schema, model } = mongoose;

export interface IRoom {
    _id: mongoose.Types.ObjectId;
    roomId: string;
    members: mongoose.Types.ObjectId[];
    owner: mongoose.Types.ObjectId;
    currentTrack: string;
}

const RoomSchema = new Schema<IRoom>(
    {
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
            required: true,
            default: "",
        },
    },
    //   {
    //     timestamps: true,
    //   }
);
const RoomModel = model<IRoom>("Room", RoomSchema);
export default RoomModel;
