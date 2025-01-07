import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "../screens/auth/Login";

const AuthRouter = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col d-none d-lg-block text-center"
          style={{ marginTop: "30%" }}
        >
          <img
            className="mb-4"
            src="https://qcm.com.vn/images/logo.png"
            alt="logo"
            style={{
              width: 256,
              objectFit: "cover",
            }}
          />
        </div>
        <div className="col content-center">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
};

export default AuthRouter;
