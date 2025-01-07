import { Form, Input, message, Modal, Select } from "antd";
import handleAPI from "../api/handleAPI";
import { useEffect, useState } from "react";
import { UserType } from "../@types/user.type";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: (val: any) => void;
  user: UserType;
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
      await handleAPI(
        `/users/${user.id}`,
        {
          username: values.username,
          roleIds: values.roles,
        },
        "put"
      );

      message.success("User updated successfully");
      onAddNew(values);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Edit User"
      open={visible}
      onCancel={onClose}
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
