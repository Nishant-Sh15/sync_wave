'use client';

import { User } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MembersSidebarProps {
  members: (string | User)[];
  currentUserId: string;
}

export default function MembersSidebar({ members, currentUserId }: MembersSidebarProps) {
  // Filter out string members for now (user IDs), only show User objects
  const userMembers = members.filter((m): m is User => typeof m === 'object' && m !== null);
  const currentUser = userMembers.find((m) => m.name === currentUserId);
  const otherMembers = userMembers.filter((m) => m.name !== currentUserId);

  return (
    <aside className="w-full md:w-64 md:border-r border-border/30 bg-card/30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <h3 className="font-semibold text-foreground">Room Members</h3>
        <p className="text-xs text-muted-foreground mt-1">{userMembers.length} online</p>
      </div>

      {/* Members List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {/* Current User */}
          {currentUser && (
            <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg font-bold text-primary-foreground">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{currentUser.name}</p>
                  <p className="text-xs text-primary">You</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
              </div>
            </div>
          )}

          {/* Online Members */}
          {otherMembers.length > 0 && (
            <div className="space-y-2 mt-4">
              <p className="text-xs font-semibold text-muted-foreground px-1">Online ({otherMembers.length})</p>
              {otherMembers.map((member) => (
                <div
                  key={member._id}
                  className="p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-sm font-bold text-secondary-foreground">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
