import { create } from "zustand";
import { User } from "../Types/User";
import { UserActionLog } from "@/Types/UserActionLog";
import { UserActionService } from "@/lib/UserAction";

type UserStore = {
  user: User | null;
  isInitialized: boolean; 
  setUser: (user: User) => void;
  logOut: (userActionService?: UserActionService) => void;
  initializeFromStorage: () => void;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isInitialized: false,
  
  initializeFromStorage: () => {
    try {
      const userFromStorage = localStorage.getItem("user");
      
      if (userFromStorage) {
        console.log("User found in localStorage, initializing");
        const user = JSON.parse(userFromStorage);
        set({ user, isInitialized: true });
        return;
      }
    } catch (error) {
      console.error("Error reading user from localStorage:", error);
    }
    
    set({ user: null, isInitialized: true });
  },
  
  setUser: (user) => {
    console.log("Setting user:", user);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, isInitialized: true });
  },
  
  logOut: (userActionService?: UserActionService) => {
    const user = get().user;

    if (user && userActionService) {
      const actionLog: UserActionLog = {
        action: "Logged out",
        details: `${JSON.stringify(user)}`,
        entity: "User",
        timestamp: new Date(),
        user: `${user.name || ""} ${user.surname || ""}`,
      };
      
      userActionService.post(actionLog);
    }

    localStorage.removeItem("user");
    set({ user: null });
  },
}));