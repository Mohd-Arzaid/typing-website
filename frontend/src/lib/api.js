const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function saveResult(payload) {
  const response = await fetch(`${API_URL}/api/v1/results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to save result");
  }

  return data.data ?? data;
}

export async function fetchResults() {
  const response = await fetch(`${API_URL}/api/v1/results`, {
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to fetch results");
  }

  return data.data ?? data;
}
