import { useEffect, useState } from "react";
import handleAPI from "../../api/handleAPI";
import { Table, message, Space, Button, Switch, Typography, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Edit2, Trash } from "iconsax-react";
import { AddRoleModal } from "../../modals";
import { useNavigate } from "react-router-dom";

interface RoleType {
  id: string;
  name: string;
  description: string;
  status: boolean;
  createdAt: string;
}

const { Title } = Typography;
const { confirm } = Modal;
const ListRole = () => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [isvisibleAddRoleModal, setIsVisibleAddRoleModal] = useState(false);

  const navigate = useNavigate();

  const handleStatusChange = async (checked: boolean, record: RoleType) => {
    try {
      const api = `/roles/status/${record.id}`;
      const res: any = await handleAPI(api, { status: checked }, "put");
      message.success(res.message);
      setRoles(
        roles.map((role) =>
          role.id === record.id ? { ...role, status: checked } : role
        )
      );
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const columns: ColumnsType<RoleType> = [
    {
      title: "Name Role",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
        <Space size="middle">
          <Button
            type="primary"
            icon={<Edit2 size={16} />}
            onClick={() => {
              navigate(`/setting/list-role/roles?id=${record.id}`);
            }}
          />
          <Button
            size="middle"
            type="default"
            icon={<Trash className="text-danger" size={16} />}
            onClick={() => {
              confirm({
                title: "Are you sure delete this role?",
                content:
                  "When clicked the OK button, this role will be deleted.",
                onOk: () => {
                  handleDelete(record.id);
                },
              });
            }}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getRole();
  }, []);

  const getRole = async () => {
    try {
      setLoading(true);
      const res = await handleAPI("/roles");
      setRoles(res.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const api = `/roles/${id}`;
      const res: any = await handleAPI(api, undefined, "delete");
      message.success(res.message);
      setRoles(roles.filter((role: RoleType) => role.id !== id));
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <Title level={3}>List Roles</Title>
        </div>
        <div className="col-12 text-right">
          <Button onClick={() => setIsVisibleAddRoleModal(true)} type="default">
            Add Role
          </Button>
        </div>
        <div className="col-12 mt-3">
          <Table
            bordered
            columns={columns}
            dataSource={roles}
            rowKey="id"
            loading={loading}
          />
        </div>
      </div>
      <AddRoleModal
        visible={isvisibleAddRoleModal}
        onClose={() => setIsVisibleAddRoleModal(false)}
        onAddNew={() => {
          setIsVisibleAddRoleModal(false);
        }}
      />
    </div>
  );
};

export default ListRole;
