import { Col, Container, Row } from "react-bootstrap";

import "../../styles/footer.scss";

export function Footer() {
  return (
    <footer className="footer-container">
      <Container fluid className="px-5">
        <Row className="m-0">
          <Col xs={12} md={6} lg={4}>
            <Row className="footer-logo justify-content-left">
            </Row>
          </Col>
          <Col xs={12} md={6} lg={4} className="mt-4 mt-md-0">
            <Row className="justify-content-center">
              <p>Got questions or feedback? Have a look at the <a href='https://github.com/microbecode/evm-connector'>Github repo</a> or poke me in Telegram at http://t .me/Lauri_P .
              Icons made by <a href="https://www.flaticon.com/authors/dinosoftlabs" title="DinosoftLabs">DinosoftLabs</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
              </p>
            </Row>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
