import { useDispatch } from "react-redux";
import { removeAuth } from "../redux/reducers/authReducer";
import { Button } from "antd";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.removeItem("authData");
    dispatch(removeAuth());
  };
  return (
    <div>
      <Button type="primary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default HomeScreen;
