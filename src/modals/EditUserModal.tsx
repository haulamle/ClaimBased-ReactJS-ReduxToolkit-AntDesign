import { Form, Input, message, Modal, Select } from "antd";
import handleAPI from "../api/handleAPI";
import { useEffect, useState } from "react";
import { UserType } from "../@types/user.type";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: (val: any) => void;
  user?: UserType;
}

const EditUserModal = (props: Props) => {
  const { visible, onClose, onAddNew, user } = props;
  const [roles, setRoles] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      getRole();
      form.setFieldsValue({
        username: user?.username,
        roles: user?.userRoles?.map((ur: any) => ur.roleId) || [],
      });
    }
  }, [visible, user, form]);

  const getRole = async () => {
    try {
      const res = await handleAPI("/roles");
      setRoles(res.data);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const api = user ? `/users/${user.id}` : `/users`;
      const method = user ? "put" : "post";
      const body = user
        ? {
            username: values.username,
            roleIds: values.roles,
          }
        : {
            username: values.username,
            roleIds: values.roles,
            password: values.password,
          };

      const res: any = await handleAPI(api, body, method);
      // await handleAPI(
      //   `/users/${user?.id}`,
      //   {
      //     username: values.username,
      //     roleIds: values.roles,
      //   },
      //   "put"
      // );

      message.success(res.message);
      onAddNew(values);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={`${user ? "Edit User" : "Add User"}  `}
      open={visible}
      onCancel={handleCancel}
      onClose={handleCancel}
      onOk={() => form.submit()}
      confirmLoading={isLoading}
      width={600}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input username!" }]}
        >
          <Input />
        </Form.Item>
        {!user && (
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input password!" }]}
          >
            <Input />
          </Form.Item>
        )}

        <Form.Item
          label="Roles"
          name="roles"
          rules={[
            { required: true, message: "Please select at least one role!" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select roles"
            style={{ width: "100%" }}
            options={roles.map((role) => ({
              label: role.name,
              value: role.id,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
