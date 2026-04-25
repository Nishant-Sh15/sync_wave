import mongoose from "mongoose";

const { Schema, model } = mongoose;

export interface IUser {
    _id: mongoose.Types.ObjectId;
    name: string;
    room: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<IUser>(
    {
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
    },
    //   {
    //     timestamps: true,
    //   }
);

export default model<IUser>("User", UserSchema);
