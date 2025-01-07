export interface UserType {
  userRoles: any;
  id: string;
  username: string;
  roles: UserRole[];
  status: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}
