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
    <div className="relative flex items-center text-gray-100">
      {/* Theme toggle */}

      <div className='pr-6'>
        <label className="toggle text-base-content">
          <input type="checkbox" value="synthwave" className="theme-controller" />

          <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></g></svg>

          <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></g></svg>

        </label>
      </div>


      {/* Profile toggle */}
      <div
        className="flex items-center cursor-pointer p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
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
          <p className="mb-4"><span className="font-semibold text-gray-400">Cinema ID:</span> {CinemaId}</p>
          <p className="mb-4"><span className="font-semibold text-gray-400">Employee Id:</span> {EmployeeId}</p>
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
