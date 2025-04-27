import React, { useState } from 'react';
import { useUserStore } from "../Stores/UserStore";

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
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logOut();
  };

  const toggleProfile = () => {
    console.log('TOGGLED PROFILE', isProfileOpen);
    setIsProfileOpen((prev) => !prev);
  };

  const getInitials = (name: string, surname: string) => {
    return `${name[0]}${surname[0]}`.toUpperCase();
  };

  return (

    <div>
      <div
        className="flex items-center cursor-pointer p-2 rounded-md btn btn-ghost transition-colors"
        onClick={toggleProfile}
      >
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mr-3 shadow-md">
          {getInitials(Name, Surname)}
        </div>
        <span className="text-sm font-semibold">{EmployeePosition}</span>
      </div>

      {/* Profile dropdown */}
      {isProfileOpen && (
        <div className="absolute right-0 top-16 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-72 p-5 z-50 text-sm text-gray-200">
          <p className="mb-2"><span className="font-semibold text-gray-400">Name:</span> {Name}</p>
          <p className="mb-2"><span className="font-semibold text-gray-400">Surname:</span> {Surname}</p>
          <p className="mb-2"><span className="font-semibold text-gray-400">Email:</span> {Email}</p>
          <p className="mb-2"><span className="font-semibold text-gray-400">Cell:</span> {CellNumber}</p>
          <p className="mb-2"><span className="font-semibold text-gray-400">Position:</span> {EmployeePosition}</p>
          <button
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );

};

export default Profile;
