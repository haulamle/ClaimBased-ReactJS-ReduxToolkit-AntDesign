import { Form, Input, message, Modal } from "antd";
import { useState } from "react";
import handleAPI from "../api/handleAPI";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: (val: any) => void;
}
const PermissionModal = (props: Props) => {
  const { visible, onClose, onAddNew } = props;
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  const handleAddNew = async (values: any) => {
    const api = "/permissions";
    setIsLoading(true);
    try {
      const res: any = await handleAPI(api, values, "post");
      message.success(res.message);
      onAddNew(values);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Add Permission"
      open={visible}
      onCancel={onClose}
      onClose={onClose}
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
        <Form.Item
          name="apiEndpoint"
          label="Api Endpoint"
          rules={[
            {
              required: true,
              message: "Please input your apiEndpoint!",
            },
          ]}
        >
          <Input placeholder="/api/users/:id" allowClear />
        </Form.Item>
        <Form.Item
          name="apiMethod"
          label="Api Method"
          rules={[
            {
              required: true,
              message: "Please input your api Method!",
            },
          ]}
        >
          <Input placeholder="GET, POST, PUT, DELETE" allowClear />
        </Form.Item>
        <Form.Item
          name="action"
          label="Action"
          rules={[
            {
              required: true,
              message: "Please input your api action!",
            },
          ]}
        >
          <Input placeholder="delete, read, update, post" allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PermissionModal;
