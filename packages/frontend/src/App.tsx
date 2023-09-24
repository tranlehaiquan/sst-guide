import "./App.css";
import Routes from "./Routes";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Auth } from "aws-amplify";
import { useAppContext } from "./libs/contextLib";

function App() {
  const nav = useNavigate();
  const { userHasAuthenticated, isAuthenticated } = useAppContext();

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);
    nav("/signin");
  }

  return (
    <Container>
      <nav>
        {isAuthenticated ? (
          <>
            <Link to="/">Home</Link>
            <Button onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/signup">Signup</Link>
            <Link to="/signin">Signin</Link>
          </>
        )}
      </nav>
      <Routes />
    </Container>
  );
}

export default App;
