export interface PermissionType {
  id: string;
  apiEndpoint: string;
  apiMethod: string;
  action: string;
  status: boolean;
}

export interface RolePermission {
  id: string;
  role: {
    id: string;
    name: string;
  };
  permission: PermissionType;
  status: boolean;
}
