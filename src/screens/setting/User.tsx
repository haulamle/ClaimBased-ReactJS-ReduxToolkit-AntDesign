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
import { ColumnProps } from "antd/es/table";
import { useEffect, useState } from "react";
import handleAPI from "../../api/handleAPI";
import { EditUserModal } from "../../modals";
import { Edit2, Trash } from "iconsax-react";

const { Title } = Typography;
const { confirm } = Modal;
const User = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [isModalAddRoleUserVisible, setIsModalAddRoleUserVisible] =
    useState(false);
  const [recordUser, setRecordUser] = useState<any>();
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const api = `/users`;
    setIsLoading(true);
    try {
      const res: any = await handleAPI(api);
      setIsLoading(false);
      setUsers(res.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnProps<any>[] = [
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
          onChange={(checked) => handleStatusChange(checked, record)}
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
  const handleStatusChange = async (checked: boolean, record: any) => {
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
      <div className="row">
        <div className="col-12">
          <Title level={3}>User Management</Title>
        </div>
        <div className="col-12 text-right">
          <Space>
            <Button
              onClick={() => setIsModalAddRoleUserVisible(true)}
              type="default"
            >
              Add User
            </Button>
          </Space>
        </div>
        <div className="col-12 mt-3">
          <Table
            bordered
            loading={isLoading}
            columns={columns}
            dataSource={users}
          />
        </div>
      </div>

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

export default User;
