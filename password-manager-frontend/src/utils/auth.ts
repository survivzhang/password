export const authUtils = {
  setToken: (token: string): void => {
    localStorage.setItem("token", token);
  },
  getToken: (): string | null => {
    return localStorage.getItem("token");
  },
  removeToken: (): void => {
    localStorage.removeItem("token");
  },
  isAuthenticated: (): boolean => {
    return !!authUtils.getToken();
  },
  logout: (): void => {
    authUtils.removeToken;
  },
};
