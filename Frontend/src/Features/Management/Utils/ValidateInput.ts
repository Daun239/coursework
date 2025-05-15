import { Client } from "@/Types/Client";
import { Employee } from "@/Types/Employee";
import { Supplier } from "@/Types/Supplier";
import { useTranslation } from "react-i18next";

// Function to validate client data
export const validateInput = (
  editedClient: Client | Employee | Supplier,
  t: Function
): string | null => {
  const isAsciiAlpha = (str: string) => {
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      const isUpper = code >= 65 && code <= 90; // A-Z
      const isLower = code >= 97 && code <= 122; // a-z
      if (!(isUpper || isLower)) {
        return false;
      }
    }
    return true;
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Get the appropriate namespace based on the type
  let namespace = "clients";
  if ("employeeId" in editedClient) {
    namespace = "employees";
  } else if ("supplierId" in editedClient) {
    namespace = "suppliers";
  }

  // Use correct namespace for error messages
  if (!isAsciiAlpha(editedClient.name)) {
    return t(`${namespace}.nameError`);
  }
  if (!isAsciiAlpha(editedClient.surname)) {
    return t(`${namespace}.surnameError`);
  }
  if (!emailRegex.test(editedClient.email)) {
    return t(`clients.emailError`);
  }

  return null;
};
