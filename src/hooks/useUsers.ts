import { useState, useEffect } from "react";
import type { User, UseUsersResult } from "../types";

const BASE_URL = "https://jsonplaceholder.typicode.com/users";

const FETCH_OPTIONS : RequestInit = {
  method: "GET",
  headers: { Accept: "application/json" },
}

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(BASE_URL, FETCH_OPTIONS);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: User[] = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error!");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
}
