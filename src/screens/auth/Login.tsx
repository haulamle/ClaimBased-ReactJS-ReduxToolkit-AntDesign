import { Button, Card, Form, Input, message, Space, Typography } from "antd";
import { useState } from "react";
import { colors } from "../../constants/colors";
import handleAPI from "../../api/handleAPI";
import { useDispatch } from "react-redux";
import { addAuth } from "../../redux/reducers/authReducer";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispacth = useDispatch();

  const [form] = Form.useForm();

  const handleLogin = async (values: any) => {
    setIsLoading(true);
    try {
      const res: any = await handleAPI("/auth/login", values, "post");
      res.data && dispacth(addAuth(res.data));
      message.success(res.message);
      setIsLoading(false);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card loading={isLoading}>
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
      <Form
        layout="vertical"
        form={form}
        onFinish={handleLogin}
        disabled={isLoading}
        size="large"
      >
        <Form.Item
          name={"username"}
          label="Username"
          rules={[
            {
              required: true,
              message: "Please enter your username",
            },
          ]}
        >
          <Input placeholder="Enter your username" allowClear />
        </Form.Item>
        <Form.Item
          name={"password"}
          label="Password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Enter your password" allowClear />
        </Form.Item>
      </Form>
      <div className="mt-4 mb-3">
        <Button
          onClick={() => form.submit()}
          type="primary"
          style={{ width: "100%", background: colors.primary500 }}
          size="large"
        >
          Login
        </Button>
      </div>
      <div className="mt-4 text-center">
        <Space>
          <Link style={{ color: colors.primary500 }} to="/forgot-password">
            Forgot your account?
          </Link>
        </Space>
      </div>
    </Card>
  );
};

export default Login;
