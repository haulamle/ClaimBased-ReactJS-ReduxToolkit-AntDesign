import { Form, Input, message, Modal } from "antd";
import { useState } from "react";
import handleAPI from "../api/handleAPI";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: (val: any) => void;
}

const AddRoleModal = (props: Props) => {
  const { visible, onClose, onAddNew } = props;
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  const handleAddNew = async (values: any) => {
    const data = {
      name: values.name.toUpperCase(),
      description: values.description,
    };
    const api = "/roles";
    setIsLoading(true);
    try {
      const res: any = await handleAPI(api, data, "post");
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
      open={visible}
      title="Add Role"
      onCancel={handleCancel}
      onClose={handleCancel}
      onOk={() => {
        form.submit();
      }}
    >
      <Form
        form={form}
        onFinish={handleAddNew}
        layout="vertical"
        size="large"
        disabled={isLoading}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input role name!" }]}
        >
          <Input placeholder="Role name" allowClear />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "Please input role description!" },
          ]}
        >
          <Input placeholder="Description Role" allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRoleModal;
