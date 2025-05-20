export function useAuth() {
  const token = localStorage.getItem("token");

  return {
    token,
    authHeader: {
      Authorization: `Bearer ${token}`,
    },
  };
}
