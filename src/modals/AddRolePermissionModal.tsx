import { Checkbox, Form, message, Modal, Space } from "antd";
import { useEffect, useState } from "react";
import handleAPI from "../api/handleAPI";
import { PermissionType } from "../@types/permission.type";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: (val: any) => void;
  role?: string | null;
}
const AddRolePermissionModal = (props: Props) => {
  const { visible, onClose, onAddNew, role } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [permissions, setPermissions] = useState([]);
  // const [rolePermissions, setRolePermissions] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    getPermission();
    // fetchRolePermissions();
  }, []);

  // const fetchRolePermissions = async () => {
  //   try {
  //     setIsLoading(true);
  //     const res = await handleAPI(`/role-permissions`);
  //     if (res.data) {
  //       const filteredPermissions = res.data.filter(
  //         (item: RolePermission) => item.role.id === role
  //       );
  //       setRolePermissions(filteredPermissions);
  //     }
  //   } catch (error: any) {
  //     message.error(error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchRolePermissions();
  // }, [role]);

  // console.log("permissions", permissions);
  // console.log("Role", role);

  const getPermission = async () => {
    const api = `/permissions?`;
    setIsLoading(true);
    try {
      const res: any = await handleAPI(api);
      setPermissions(res.data);
      setIsLoading(false);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = async (values: any) => {
    const selectedPermissionIds = Object.keys(values).filter(
      (key) => values[key] === true
    );
    const api = `/role-permissions`;
    try {
      setIsFetching(true);
      selectedPermissionIds.map(async (id: string) => {
        await handleAPI(
          api,
          {
            roleId: role,
            permissionId: id,
          },
          "post"
        );
      });
      message.success("Add RolePermission successfully");
      onClose();
      onAddNew(console.log("Add Done!!"));
      setIsFetching(false);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Modal
      title="Add RolePermission"
      open={visible}
      onCancel={onClose}
      onClose={onClose}
      okButtonProps={{ disabled: isFetching }}
      onOk={() => {
        form.submit();
      }}
    >
      <Form
        layout="vertical"
        size="large"
        disabled={isLoading}
        form={form}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        onFinish={handleAddNew}
      >
        {permissions.map((item: PermissionType) => (
          <Form.Item key={item.id} name={item.id} valuePropName="checked">
            <div className="d-flex align-items-center justify-content-between">
              <Space>
                {item.apiEndpoint} - {item.apiMethod} - {item.action}
              </Space>
              <Checkbox />
            </div>
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default AddRolePermissionModal;
