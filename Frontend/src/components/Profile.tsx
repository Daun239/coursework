import React from 'react';
import { useUserStore } from "../Stores/UserStore";
import { LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ProfileProps = {
  EmployeePosition: string;
  CellNumber: string;
  Email: string;
  Name: string;
  Surname: string;
  CinemaId: number;
  EmployeeId: number;
};

const Profile = ({ CinemaId, EmployeePosition, CellNumber, Email, Name, Surname, EmployeeId }: ProfileProps) => {
  const { logOut } = useUserStore();

  const getInitials = (name: string, surname: string) => {
    return `${name[0]}${surname[0]}`.toUpperCase();
  };

  const handleLogout = () => {
    logOut();
  };

  return (
    <div className="flex items-center">
      <DropdownMenu>
        {/* Wrap the profile initials with DropdownMenuTrigger */}
        <DropdownMenuTrigger asChild>
          <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-3 shadow-md cursor-pointer">
            {getInitials(Name, Surname)}
          </div>
        </DropdownMenuTrigger>

        <span className="text-sm font-semibold">{EmployeePosition}</span>

        {/* Dropdown menu content */}
        <DropdownMenuContent align="end" className="rounded-lg shadow-xl p-2">
          <DropdownMenuLabel>{`${Name} ${Surname}`}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Position: {EmployeePosition}</DropdownMenuItem>
          <DropdownMenuItem>Cell: {CellNumber}</DropdownMenuItem>
          <DropdownMenuItem>Email: {Email}</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Profile;
