import { Form, Input, Button, message, Card, Typography, Space } from "antd";
import { useState } from "react";
import handleAPI from "../../api/handleAPI";
import { colors } from "../../constants/colors";
import { Link, useNavigate } from "react-router-dom";
const { Title, Paragraph } = Typography;
const ForgotPass = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (values: any) => {
    setLoading(true);
    console.log(values);
    try {
      const res: any = await handleAPI("/auth/forgot-password", values, "post");
      message.success(res.message);
      navigate("/login");
      form.resetFields();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card loading={loading}>
      <div className="text-center">
        <img
          src="https://qcm.com.vn/images/logo.png"
          alt="logo"
          style={{ width: 48, height: 48 }}
          className="mb-3"
        />
        <Title level={2}>Login to your account</Title>
        <Paragraph type="secondary">
          Welcome back! Please enter your details.
        </Paragraph>
      </div>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Enter your username" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Plsease input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item>
          <Button
            onClick={() => form.submit()}
            type="primary"
            style={{ width: "100%", background: colors.primary500 }}
            size="large"
          >
            Reset Password
          </Button>
        </Form.Item>
      </Form>
      <div className="mt-4 text-center">
        <Space>
          <Link style={{ color: colors.primary500 }} to="/login">
            Login
          </Link>
        </Space>
      </div>
    </Card>
  );
};

export default ForgotPass;
