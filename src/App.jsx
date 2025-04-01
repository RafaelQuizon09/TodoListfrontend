import { useState } from "react";
import { Navigate } from "react-router-dom";

function App() {
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [redirectSignUp, setRedirectSignUp] = useState(false);

  const handleLoginNav = () => {
    setRedirectLogin(true);
  };

  const handleSignUpNav = () => {
    setRedirectSignUp(true);
  };

  if (redirectLogin) {
    return <Navigate to="/login" />;
  }

  if (redirectSignUp) {
    return <Navigate to="/signup" />;
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <p className="text-center text-5xl text-wrap font-semibold text-white">
        Welcome to the very first
        <span className="font-medium" style={{ fontSize: "12px" }}>
          (not really)
        </span>{" "}
        To-Do list web app!
      </p>
      <div className="flex flex-col w-fit justify-center items-center">
        <button className="w-full m-5" onClick={handleLoginNav}>Head to Login</button>
        <button className="w-full m-5" onClick={handleSignUpNav}>Head to Sign Up</button>
      </div>
      <style>
        {`
          body {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #0B132B;
          }`}
      </style>
    </div>
  );
}

export default App;
