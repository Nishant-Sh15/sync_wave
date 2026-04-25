import mongoose from "mongoose";
export interface IRoom {
    _id: mongoose.Types.ObjectId;
    roomId: string;
    members: mongoose.Types.ObjectId[];
    owner: mongoose.Types.ObjectId;
    currentTrack: string;
}
declare const RoomModel: mongoose.Model<IRoom, {}, {}, {}, mongoose.Document<unknown, {}, IRoom, {}, mongoose.DefaultSchemaOptions> & IRoom & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IRoom>;
export default RoomModel;
//# sourceMappingURL=Room.d.ts.map