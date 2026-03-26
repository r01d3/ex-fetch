export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
}
