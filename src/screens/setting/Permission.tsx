import {
  Button,
  message,
  Radio,
  RadioChangeEvent,
  Space,
  Switch,
  Table,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import handleAPI from "../../api/handleAPI";
import { ColumnProps } from "antd/es/table";
import { PermissionType, RolePermission } from "../../@types/permission.type";
import { AddRolePermissionModal, PermissionModal } from "../../modals";

const { Title } = Typography;
const Permission = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [rolePermissions, setRolePermissions] = useState<PermissionType[]>([]);

  const [isVisibleModalPermission, setIsVisibleModalPermission] =
    useState(false);
  const [isVisibleRolePermission, setIsVisibleRolePermission] = useState(false);

  useEffect(() => {
    getRole();
    fetchRolePermissions();
  }, [selectedRole]);

  useEffect(() => {
    if (roles.length > 0 && selectedRole === null) {
      setSelectedRole(roles[0].id);
    }
  }, [roles, selectedRole]);
  const fetchRolePermissions = async () => {
    try {
      setIsLoading(true);
      const res = await handleAPI(`/role-permissions`);

      if (res.data) {
        const filteredPermissions = res.data
          .filter((item: RolePermission) => item.role.id === selectedRole)
          .map((item: RolePermission) => ({
            ...item.permission,
            id: item.id,
            status: item.status,
          }));
        setRolePermissions(filteredPermissions);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getRole = async () => {
    const api = `/roles`;
    try {
      const res = await handleAPI(api);
      setRoles(res.data);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleRoleChange = (e: RadioChangeEvent) => {
    setSelectedRole(e.target.value);
  };

  const handleStatusChange = async (
    checked: boolean,
    record: PermissionType
  ) => {
    try {
      const api = `/permissions/status/${record.id}`;
      const res: any = await handleAPI(
        api,
        { status: checked, roleId: selectedRole },
        "put"
      );
      message.success(res.message);
      await fetchRolePermissions();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const columns: ColumnProps<PermissionType>[] = [
    {
      title: "API Endpoint",
      dataIndex: "apiEndpoint",
      key: "apiEndpoint",
      render: (text) => <code>{text}</code>,
    },
    {
      title: "Method",
      dataIndex: "apiMethod",
      key: "apiMethod",
      render: (method) => {
        const colors: Record<string, string> = {
          GET: "green",
          POST: "blue",
          PUT: "orange",
          DELETE: "red",
        };
        return <span style={{ color: colors[method] }}>{method}</span>;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: boolean, record) => (
        <Switch
          checked={status}
          onChange={(checked) => handleStatusChange(checked, record)}
        />
      ),
    },
  ];

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-12">
          <Title level={3}>Permission Management</Title>
        </div>
        <div className="col-6">
          <Radio.Group onChange={handleRoleChange} value={selectedRole}>
            <Space direction="horizontal">
              {roles &&
                roles.length > 0 &&
                roles.map((role: any) => (
                  <Radio value={role.id}>{role.name}</Radio>
                ))}
            </Space>
          </Radio.Group>
        </div>
        <div className="col-6 text-right">
          <Space>
            <Button
              onClick={() => setIsVisibleRolePermission(true)}
              type="default"
            >
              Add RolePermisson
            </Button>
            <Button
              onClick={() => setIsVisibleModalPermission(true)}
              type="default"
            >
              Add Permission
            </Button>
          </Space>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <Table
            bordered
            loading={isLoading}
            columns={columns}
            dataSource={rolePermissions}
            rowKey="id"
          />
        </div>
      </div>
      <PermissionModal
        visible={isVisibleModalPermission}
        onClose={() => setIsVisibleModalPermission(false)}
        onAddNew={(_: any) => {
          setIsVisibleModalPermission(false);
        }}
      />
      <AddRolePermissionModal
        visible={isVisibleRolePermission}
        onClose={() => setIsVisibleRolePermission(false)}
        onAddNew={() => {
          setIsVisibleRolePermission(false);
          fetchRolePermissions();
        }}
        role={selectedRole}
      />
    </div>
  );
};
export default Permission;
