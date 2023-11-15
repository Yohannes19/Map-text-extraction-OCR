import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


function Navbarapp() {
  return (
    <Navbar expand="lg"   bg="dark"   className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="/" >
             <img
              alt=""
              src="./logo.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
          Map Comparsion Tool  </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav  className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="#link">Comparsion</Nav.Link>
            <Nav.Link href="#deets">Reports</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
              PaddleOCR
            </Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
              Sing In
            </Nav.Link>
          </Nav>
        
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbarapp;