import type { Request, Response } from "express";
export declare function CheckRoute(rooms: Map<string, Set<unknown>>): (req: Request, res: Response) => Promise<void>;
export declare function CreateRoomRoute(rooms: Map<string, Set<unknown>>, getNextRoomId: () => number): (req: Request, res: Response) => Promise<void>;
export declare function InfoRoute(): (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=routes.d.ts.map