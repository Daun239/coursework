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
import { useLanguageStore } from '@/Stores/useLanguageStore';

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

  const translations = {
    en: {
      errorDate: "Error: Invalid date or time",
      errorDateTime: "Error: Invalid date time",
      soldOut: "Sold out",
      availableSeats: (count: number) => `${count} seat${count !== 1 ? 's' : ''} available`,

      position: "Position",
      cell: "Cell",
      email: "Email",
      logout: "Log out",
    },
    ua: {
      errorDate: "Помилка: недійсні дата або час",
      errorDateTime: "Помилка: недійсний формат дати й часу",
      soldOut: "Розпродано",
      availableSeats: (count: number) =>
        `${count} міс${count === 1 ? '' : count < 5 ? 'ця' : 'ць'} доступно`,

      position: "Посада",
      cell: "Телефон",
      email: "Електронна пошта",
      logout: "Вийти",
    },
  };

  const { logOut } = useUserStore();

  const getInitials = (name: string, surname: string) => {
    return `${name[0]}${surname[0]}`.toUpperCase();
  };

  const handleLogout = () => {
    logOut();
  };

  const { language } = useLanguageStore() || "en";
  const t = translations[language] ?? translations["en"];


  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-3 shadow-md cursor-pointer">
            {getInitials(Name, Surname)}
          </div>
        </DropdownMenuTrigger>

        <span className="text-sm font-semibold">{EmployeePosition}</span>

        {/* ✅ Everything below must be inside DropdownMenuContent */}
        <DropdownMenuContent align="end" className="rounded-lg shadow-xl p-2">
          <DropdownMenuLabel>{`${Name} ${Surname}`}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{t.position}: {EmployeePosition}</DropdownMenuItem>
          <DropdownMenuItem>{t.cell}: {CellNumber}</DropdownMenuItem>
          <DropdownMenuItem>{t.email}: {Email}</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2" />
            <span>{t.logout}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

};

export default Profile;
