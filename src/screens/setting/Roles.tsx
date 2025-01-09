import {
  Button,
  message,
  Modal,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import handleAPI from "../../api/handleAPI";
import { ColumnProps } from "antd/es/table";
import { PermissionType, RolePermission } from "../../@types/permission.type";
import {
  AddRolePermissionModal,
  EditUserModal,
  PermissionModal,
} from "../../modals";
import { useSearchParams } from "react-router-dom";
import { ArrowCircleLeft2, Edit2, Trash } from "iconsax-react";

const { Title } = Typography;
const { confirm } = Modal;
const Roles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rolePermissions, setRolePermissions] = useState<PermissionType[]>([]);

  const [isVisibleModalPermission, setIsVisibleModalPermission] =
    useState(false);
  const [isVisibleRolePermission, setIsVisibleRolePermission] = useState(false);
  // user
  const [users, setUsers] = useState([]);
  const [isModalAddRoleUserVisible, setIsModalAddRoleUserVisible] =
    useState(false);
  const [recordUser, setRecordUser] = useState<any>();
  const [searchParams] = useSearchParams();
  const idRole = searchParams.get("id");

  useEffect(() => {
    getData();
    getUsers();
  }, [idRole]);

  const getData = async () => {
    await fetchRolePermissions();
  };
  const fetchRolePermissions = async () => {
    try {
      setIsLoading(true);
      const res = await handleAPI(`/role-permissions`);

      if (res.data) {
        const filteredPermissions = res.data
          .filter((item: RolePermission) => item.role.id === idRole)
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

  const handleStatusChange = async (
    checked: boolean,
    record: PermissionType
  ) => {
    try {
      const api = `/permissions/status/${record.id}`;
      const res: any = await handleAPI(
        api,
        { status: checked, roleId: idRole },
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

  //table user
  const getUsers = async () => {
    const api = `/users`;
    setIsLoading(true);
    try {
      const res: any = await handleAPI(api);
      setIsLoading(false);
      const data = res.data.filter((user: any) => {
        return user.userRoles.some((x: any) => {
          return x.roleId === idRole;
        });
      });
      setUsers(data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const columnsUser: ColumnProps<any>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id: string) => <code>{id}</code>,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "name",
      render: (username: string) => <code>{username}</code>,
    },
    {
      title: "Roles",
      dataIndex: "",
      key: "roles",
      render: (_, record) => (
        <Space wrap>
          {record.userRoles?.map((userRole: any) => (
            <Tag color="blue" key={userRole.id}>
              {userRole.role.name}
            </Tag>
          ))}
        </Space>
      ),
    },

    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: boolean, record) => (
        <Switch
          checked={status}
          onChange={(checked) => handleUserStatusChange(checked, record)}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space wrap>
          <Tooltip title="Edit user">
            <Button
              onClick={() => {
                setIsModalAddRoleUserVisible(true);
                setRecordUser(record);
              }}
              icon={<Edit2 size={16} />}
              size="middle"
              type="primary"
            />
          </Tooltip>

          <Tooltip title="Delete user">
            <Button
              onClick={() => {
                confirm({
                  title: "Are you sure you want to delete this user?",
                  content:
                    "When clicked the OK button, this user will be deleted.",
                  onOk: () => {
                    handleRemoveUser(record);
                  },
                });
              }}
              icon={<Trash size={16} className="text-danger" />}
              size="middle"
              type="default"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleUserStatusChange = async (checked: boolean, record: any) => {
    try {
      const api = `/users/status/${record.id}`;
      const res: any = await handleAPI(api, { status: checked }, "put");
      message.success(res.message);
      getUsers();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleRemoveUser = async (record: any) => {
    const api = `/users/${record.id}`;
    try {
      const res: any = await handleAPI(api, undefined, "delete");
      message.success(res.message);
      getUsers();
    } catch (error: any) {
      message.error(error.message || "Failed to delete user");
    }
  };

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-12">
          <Title level={3}>Roles Management</Title>
        </div>
        <div className="col-6">
          <Button
            type="primary"
            icon={<ArrowCircleLeft2 size={16} />}
            onClick={() => window.history.back()}
          />
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
            pagination={{
              total: rolePermissions.length,
              pageSize: 6,
            }}
          />
        </div>
        <div className="col-12 mt-3">
          <Table
            bordered
            loading={isLoading}
            columns={columnsUser}
            dataSource={users}
            rowKey="id"
            pagination={{
              total: users.length,
              pageSize: 6,
            }}
          />
        </div>
      </div>
      <PermissionModal
        visible={isVisibleModalPermission}
        onClose={() => setIsVisibleModalPermission(false)}
        onAddNew={async (_: any) => {
          setIsVisibleModalPermission(false);
          await getData();
        }}
      />
      <AddRolePermissionModal
        visible={isVisibleRolePermission}
        onClose={() => setIsVisibleRolePermission(false)}
        onAddNew={async () => {
          setIsVisibleRolePermission(false);
          await getData();
        }}
        role={idRole}
      />
      {/* {user} */}
      <EditUserModal
        visible={isModalAddRoleUserVisible}
        onClose={() => {
          setIsModalAddRoleUserVisible(false);
          setRecordUser(undefined);
        }}
        onAddNew={() => {
          setIsModalAddRoleUserVisible(false);
          getUsers();
        }}
        user={recordUser}
      />
    </div>
  );
};
export default Roles;
