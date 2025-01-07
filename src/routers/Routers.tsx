import { useEffect, useState } from "react";
import {
  addAuth,
  authSelector,
  AuthState,
} from "../redux/reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { localDataNames } from "../constants/appInfos";
import { Spin } from "antd";
import AuthRouter from "./AuthRouter";
import MainRouter from "./MainRouter";

const Routers = () => {
  const [isLoading] = useState(false);

  const auth: AuthState = useSelector(authSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = localStorage.getItem(localDataNames.authData);
    res && dispatch(addAuth(JSON.parse(res)));
  };

  return isLoading ? <Spin /> : !auth.token ? <AuthRouter /> : <MainRouter />;
};

export default Routers;
