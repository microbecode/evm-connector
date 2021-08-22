import React, { useState, useEffect } from "react";
import { NavHashLink } from "react-router-hash-link";
import { useLocation } from "react-router-dom";
import {
  Col,
  Container,
  Nav,
  Navbar,
  Row,
  Image,
  Button,
} from "react-bootstrap";
import Logo from "../../images/binary-code.png";
import "../../styles/header.scss";

type Props = {
  connectWallet: () => void;
  selectedAddress?: string;
};

export function Header({ connectWallet, selectedAddress }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  return (
    <header className="header-container py-0">
      <Container fluid>
        <Row className="m-0 px-5">
          <Col className="p-0">
            <Navbar expand="xl" expanded={isExpanded} className="p-0">
              <Navbar.Brand href="/" className="py-2">
                <Image alt="" src={Logo} style={{ height: "50px" }} />
              </Navbar.Brand>
              <Navbar.Toggle
                aria-controls="basic-navbar-nav"
                onClick={() => setIsExpanded(!isExpanded)}
              />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto py-0"></Nav>
                {window.ethereum !== undefined ? (
                  selectedAddress ? (
                    <Button
                      variant="primary-outline"
                      className="d-blockmt-3 my-xl-0 mx-4"
                      title="Copy to clipboard"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedAddress);
                      }}
                    >
                      {selectedAddress.substring(0, 10) + "..."}
                    </Button>
                  ) : (
                    <Button
                      className="d-block filled arrow mt-3 my-xl-0 mx-4"
                      onClick={connectWallet}
                    >
                      Connect wallet to interact
                    </Button>
                  )
                ) : (
                  ""
                )}
              </Navbar.Collapse>
            </Navbar>
          </Col>
        </Row>
      </Container>
    </header>
  );
}
