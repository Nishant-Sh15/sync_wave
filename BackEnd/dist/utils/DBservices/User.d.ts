import mongoose from "mongoose";
import type { HydratedDocument } from "mongoose";
import type { IUser } from "../../schemas/User.js";
type UserDocument = HydratedDocument<IUser>;
export declare function createUser(name: string, room: string | mongoose.Types.ObjectId): Promise<UserDocument>;
export {};
//# sourceMappingURL=User.d.ts.map