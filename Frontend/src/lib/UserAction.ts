import { UserActionLog } from "@/Types/UserActionLog";

export class UserActionService {
  private readonly baseUrl = "http://localhost:5275/api/action";

  async get(): Promise<UserActionLog[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch user actions");
    }

    return response.json();
  }

  async post(action: UserActionLog): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(action),
    });

    if (!response.ok) {
      throw new Error("Failed to log user action");
    }
  }
}
