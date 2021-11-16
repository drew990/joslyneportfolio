import React from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import styles from "../styles/Navigation.module.css";
import { motion } from "framer-motion";

export default function NavBar() {
  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        style={{ backgroundColor: "#fff", color: "#000" }}
      >
        <Container>
          <Navbar.Brand>
            <a
              href="/"
              style={{
                fontSize: 24,
                fontWeight: "Bold",
                textDecoration: "none",
                color: "#000",
              }}
            >
              Joslyne Keehmer
            </a>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                passHref
                href="/gallery"
                className={styles.navLink}
              >
                Gallery
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                passHref
                href="/about"
                className={styles.navLink}
              >
                About
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                href="/contact"
                className={styles.navLink}
              >
                Contact
              </motion.a>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
