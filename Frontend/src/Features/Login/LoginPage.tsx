import React, { useState } from "react";
import { useServiceStore } from "../../Stores/ServicesStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { UserActionLog } from "@/Types/UserActionLog";

const LoginPage = () => {
  const { loginService, userActionService } = useServiceStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!email.trim() || !password.trim()) {
        toast.error("Будь ласка, введіть електронну пошту та пароль");
        return;
      }

      const result = await loginService.loginUser(email.trim(), password.trim());

      console.log('Login result:', result);

      if (result && result.success) {
        // Log the successful login
        const actionLog: UserActionLog = {
          action: "Logged in",
          details: `${JSON.stringify(result.user)}`,
          entity: "User",
          timestamp: new Date(),
          user: `${result.user?.name} ${result.user?.surname}`
        };

        // await userActionService.post(actionLog);

        toast.success("Успішний вхід!");

        // Determine which page to navigate to based on user role
        if (result.user?.role === "Cashier") {
          navigate("/movies");
        }
        else if (result.user?.role === "Manager") {
          navigate("/deliveryOrders");
        }
        else if (result.user?.role === "WarehouseWorker") {
          navigate("/deliveryOrders");
        }
        else if (result.user?.role === "Admin") {
          navigate("/auditPage");
        }
        else {
          // Default redirect if role doesn't match any of the above
          navigate("/dashboard");
        }
      } else {
        toast.error("Невірний логін або пароль. Спробуйте ще раз.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Сталася помилка при вході. Спробуйте ще раз.");
    }
  };

  // Handle enter key press for login
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-semibold text-center mb-6">Увійти</h2>
        <input
          type="text"
          placeholder="Електронна пошта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-3 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleLogin}
          className="w-full py-3 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          Увійти
        </button>
      </div>
    </div>
  );
};

export default LoginPage;