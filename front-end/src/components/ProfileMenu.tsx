import {
  SignOutIcon,
  GearIcon,
  UserIcon,
  NotificationIcon,
  ChatIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store";
import { logoutThunk } from "@/app/auth/authSlice";

import type { AuthUser } from "@/app/auth/authSlice";

interface ProfileMenuProps {
  user: AuthUser | null;
}

export function ProfileMenu({ user }: ProfileMenuProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  if (!user) return null;

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <UserIcon /> {user.name.slice(0, 20)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => navigate("/dashboard")}>
          <UserIcon />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem>
          <GearIcon />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/chat")}>
          <ChatIcon />
          Chat
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <SignOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
