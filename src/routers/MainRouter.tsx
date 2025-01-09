import { Affix, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SiderComponent } from "../components";
import { HomeScreen } from "../screens";
import { Roles, User, Setting, ListRole } from "../screens/setting";
import { useSelector } from "react-redux";
import { authSelector } from "../redux/reducers/authReducer";

const PermissionRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useSelector(authSelector);
  const userRoles = auth.user.roles.map((x: any) => x.name);

  if (!userRoles.some((role: string) => ["ADMIN", "MANAGER"].includes(role))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
const MainRouter = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Affix offsetTop={0}>
          <SiderComponent />
        </Affix>
        <Content className="pt-3 container-fluid bg-white">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/setting" element={<Setting />}>
              <Route
                path="list-role"
                element={
                  <PermissionRoute>
                    <ListRole />
                  </PermissionRoute>
                }
              />
              <Route
                path="list-role/roles"
                element={
                  <PermissionRoute>
                    <Roles />
                  </PermissionRoute>
                }
              />
              <Route path="user" element={<User />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  );
};

export default MainRouter;
