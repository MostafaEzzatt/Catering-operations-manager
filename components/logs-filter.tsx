"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const LogsFilter = ({
  users,
  selectedUsers,
  onChange,
}: {
  users: string[];
  selectedUsers: string[];
  onChange: (users: string[]) => void;
}) => {
  const isAll = selectedUsers.length === 0;

  const handleUserChange = (user: string, checked: boolean) => {
    const current = new Set(selectedUsers);
    if (checked) {
      current.add(user);
    } else {
      current.delete(user);
    }
    onChange(Array.from(current));
  };

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6 p-4 border border-dashed rounded-xl">
      <span className="text-sm font-medium text-muted-foreground">
        تصفية حسب المستخدم:
      </span>

      <div className="flex items-center gap-2">
        <Checkbox
          id="filter-all"
          checked={isAll}
          onCheckedChange={() => onChange([])}
        />
        <Label htmlFor="filter-all">الكل</Label>
      </div>

      {users.map((user) => (
        <div key={user} className="flex items-center gap-2">
          <Checkbox
            id={`filter-${user}`}
            checked={selectedUsers.includes(user)}
            onCheckedChange={(checked) => handleUserChange(user, !!checked)}
          />
          <Label htmlFor={`filter-${user}`}>{user}</Label>
        </div>
      ))}
    </div>
  );
};

export default LogsFilter;
