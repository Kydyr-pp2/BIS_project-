export async function submitNewPassword(newPassword) {
  const token = new URLSearchParams(window.location.search).get("token");
  const response = await fetch("http://localhost:3000/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Password reset failed");
  return data.message;
}
