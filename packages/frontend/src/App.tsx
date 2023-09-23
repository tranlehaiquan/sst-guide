import "./App.css";
import Routes from "./Routes";
import { Link } from 'react-router-dom';

function App() {
  return (
    <div>
      <div>
        <Link to="/">Home</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/signin">Signin</Link>
      </div>
      <Routes />
    </div>
  );
}

export default App;
