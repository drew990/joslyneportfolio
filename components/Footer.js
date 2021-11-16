import React from "react";
import Insta from "../public/Images/instagram.png";
import Image from "next/image";

function Footer() {
  return (
    <div
      style={{
        backgroundColor: "#000",
        height: "224px",
        textAlign: "center",
        color: "#fff",
        padding: "6vh 15vw 5vh 15vw",
      }}
    >
      <a
        href="https://www.instagram.com/jayy.bird_/"
        style={{ color: "#fff", textDecoration: "underline" }}
      >
        <Image src={Insta} alt="Instagram" width="40px" height="40px" />
      </a>
      <h4>© 2021 Joslyne Keehmer</h4>
      <p>
        Made by&nbsp;
        <a
          href="https://andrewbanagas.com/"
          style={{ color: "#fff", textDecoration: "underline" }}
        >
          Andrew Banagas
        </a>
      </p>
    </div>
  );
}

export default Footer;
