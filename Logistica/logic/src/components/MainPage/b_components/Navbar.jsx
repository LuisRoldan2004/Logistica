import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AppNavbar = ({ user, logout }) => {
  const location = useLocation();

  return (
    <Navbar className='navbar_container' variant="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">SupplyChainOptimizer</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {user && (
              <>
                <Nav.Link as={Link} to="/register">New Route</Nav.Link>
                <Nav.Link as={Link} to="/myroutes">My Routes</Nav.Link>
                <Nav.Link as={Link} to="/store">Add Wineries</Nav.Link>
                <Nav.Link as={Link} to="/report">Report</Nav.Link> {/* Nuevo enlace */}
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <Navbar.Text>
                <div className="btn-group">
                  <button className="btn dropdown-toggle" type="button" id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
                    <span>{user}</span>
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="defaultDropdown">
                    <li><a className="dropdown-item" href="#">My Profile</a></li>
                    <li><a className="dropdown-item" href="#" onClick={logout}>Log out</a></li>
                  </ul>
                </div>
              </Navbar.Text>
            ) : (
              location.pathname !== "/login" && (
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              )
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
