import { Layout, Menu, MenuProps } from "antd";
import { Home2, I3Square, Setting2, UserOctagon } from "iconsax-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { authSelector, AuthState } from "../redux/reducers/authReducer";

const { Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

const SiderComponent = () => {
  const auth: AuthState = useSelector(authSelector);
  const userRoles = auth.user.roles.map((x: any) => x.name);
  const getMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [
      {
        key: "DashBoard",
        label: <Link to={"/"}>DashBoard</Link>,
        icon: <Home2 size={20} />,
      },
    ];

    const settingChildren: MenuItem[] = [];
    if (userRoles.some((role) => ["ADMIN", "MANAGER"].includes(role))) {
      settingChildren.push({
        key: "Permission",
        label: <Link to={"/setting/perrmission"}>Permission</Link>,
        icon: <I3Square size={20} />,
      });
    }

    // User menu có thể thêm điều kiện khác nếu cần
    settingChildren.push({
      key: "User",
      label: <Link to={"/setting/user"}>User</Link>,
      icon: <UserOctagon size={20} />,
    });

    if (settingChildren.length > 0) {
      items.push({
        key: "Setting",
        label: <Link to={"/setting"}>Setting</Link>,
        icon: <Setting2 size={20} />,
        children: settingChildren,
      });
    }

    return items;
  };

  return (
    <Sider width={200} theme="light" style={{ height: "100vh" }}>
      <div className="p-2 d-flex align-items-center pl-4">
        <img alt="" src="https://qcm.com.vn/images/logo.png" width={48} />
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={["DashBoard"]}
        items={getMenuItems()}
      />
    </Sider>
  );
};

export default SiderComponent;
