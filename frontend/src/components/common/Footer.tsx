import { Col, Container, Row } from "react-bootstrap";
import React, { useState } from "react";

import { PrivacyPolicy } from "../modals/PrivacyPolicy";
import { NFTDisclaimer } from "../modals/NFTDisclaimer";

import "../../styles/footer.scss";

export function Footer() {
  const [modalPrivacyPolicyShow, setModalPrivacyPolicyShow] = useState(false);
  const [modalNFTDisclaimerShow, setModalNFTDisclaimerShow] = useState(false);

  return (
    <footer className="footer-container">
      <Container fluid className="px-5">
        <Row className="m-0">
          <Col xs={12} md={6} lg={4}>
            <Row className="footer-logo justify-content-left">
      {/*         <a href="#" rel="noreferrer noopener">
                <img alt="" src={Logo} />
              </a> */}
            </Row>
          </Col>
          <Col xs={12} md={6} lg={4} className="mt-4 mt-md-0">
            <Row className="justify-content-center">
              <p>Got questions? Let's figure out later where you could ask...</p>
            </Row>
            <Row className="justify-content-center">
              
            </Row>
          </Col>
          <Col xs={12} md={12} lg={4} className="mt-4 mt-lg-0">
            <Row className="justify-content-center justify-content-lg-end">
              <p
                className="modal-link"
                onClick={() => setModalNFTDisclaimerShow(true)}
              >
                NFT Disclaimer
              </p>
            </Row>
            <Row className="justify-content-center justify-content-lg-end">
              <p
                className="modal-link"
                onClick={() => setModalPrivacyPolicyShow(true)}
              >
                Privacy policy
              </p>
            </Row>
          </Col>
        </Row>
      </Container>
      <PrivacyPolicy
        show={modalPrivacyPolicyShow}
        onHide={() => setModalPrivacyPolicyShow(false)}
      />
      <NFTDisclaimer
        show={modalNFTDisclaimerShow}
        onHide={() => setModalNFTDisclaimerShow(false)}
      />
    </footer>
  );
}
