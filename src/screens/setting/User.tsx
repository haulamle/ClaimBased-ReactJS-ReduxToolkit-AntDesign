import { Button, message, Space, Switch, Table, Tag, Typography } from "antd";
import { ColumnProps } from "antd/es/table";
import { useEffect, useState } from "react";
import handleAPI from "../../api/handleAPI";
import { AddRoleModal, EditUserModal } from "../../modals";
import { Edit2 } from "iconsax-react";

const { Title } = Typography;
const User = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [isvisibleAddRoleModal, setIsVisibleAddRoleModal] = useState(false);
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
          <Button
            onClick={() => {
              setIsModalAddRoleUserVisible(true);
              setRecordUser(record);
            }}
            icon={<Edit2 size={16} />}
            size="middle"
            type="primary"
          />
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

  return (
    <div className="conttainer">
      <div className="row">
        <div className="col-12">
          <Title level={3}>User Management</Title>
        </div>
        <div className="col-12 text-right">
          <Button onClick={() => setIsVisibleAddRoleModal(true)} type="default">
            Add Role
          </Button>
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
      <AddRoleModal
        visible={isvisibleAddRoleModal}
        onClose={() => setIsVisibleAddRoleModal(false)}
        onAddNew={() => {
          setIsVisibleAddRoleModal(false);
          getUsers();
        }}
      />
      <EditUserModal
        visible={isModalAddRoleUserVisible}
        onClose={() => setIsModalAddRoleUserVisible(false)}
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
