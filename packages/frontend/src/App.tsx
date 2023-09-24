import "./App.css";
import Routes from "./Routes";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { Auth } from "aws-amplify";
import { useAppContext } from "./libs/contextLib";
import { LinkContainer } from "react-router-bootstrap";
import Nav from "react-bootstrap/Nav";

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
            <LinkContainer to="/settings">
              <Nav.Link>Settings</Nav.Link>
            </LinkContainer>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
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
