export async function requestPasswordReset(email) {
  const response = await fetch("http://localhost:3000/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data.message;
}
