import Header from "./Header.jsx"
import Sample from "./Sample.jsx";
import Login from "./AuthComponents/Login.jsx";
import { Link } from "react-router";
function App() {

  return (
    <>
        <Sample/>
        <Header/>
        <Link to="/login">Login</Link>
    </>


  );
}

export default App
