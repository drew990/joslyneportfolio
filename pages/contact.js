import React, { useState } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import styles from "../styles/Contact.module.css";
import axios from "axios";

function Contact() {
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleServerResponse = (ok, msg) => {
    if (ok) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: msg },
      });
      setInputs({
        name: "",
        email: "",
        message: "",
      });
    } else {
      setStatus({
        info: { error: true, msg: msg },
      });
    }
  };

  const handleOnChange = (e) => {
    e.persist();
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setStatus({
      submitted: false,
      submitting: false,
      info: { error: false, msg: null },
    });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));
    axios({
      method: "POST",
      url: "https://formspree.io/f/xoqygkkz",
      data: inputs,
    })
      .then((response) => {
        handleServerResponse(
          true,
          "Thank you, your message has been submitted."
        );
      })
      .catch((error) => {
        handleServerResponse(false, error.response.data.error);
      });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Joslyne Keehmer - Contact Form</title>
        <meta
          name="description"
          content="Contact Joshlyne Keehmer using this form"
        />
        <link rel="icon" href="/static/favicon.ico" />
      </Head>
      <h2 style={{ paddingBottom: "1rem" }}> Contact Page </h2>
      <style jsx>
        {`
          label {
            display: block;
          }
        `}
      </style>
      <form className={styles.formContainer} onSubmit={handleOnSubmit}>
        <p>
          <label htmlFor="name">Full Name</label>
          <input
            onChange={handleOnChange}
            value={inputs.name}
            name="name"
            id="name"
            placeholder="Full Name"
            type="text"
            required
            className={styles.inputStyle}
          />
        </p>
        <p>
          <label htmlFor="email">Email</label>
          <input
            onChange={handleOnChange}
            value={inputs.email}
            id="email"
            name="_replyto"
            placeholder="Full Email"
            type="email"
            required
            className={styles.inputStyle}
          />
        </p>
        <p>
          <label htmlFor="message">Message</label>
          <textarea
            onChange={handleOnChange}
            value={inputs.message}
            id="message"
            name="message"
            placeholder="Full Message"
            type="text"
            required
            rows="1"
            className={styles.textAreaStyle}
          ></textarea>
        </p>
        <p style={{ textAlign: "center" }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            type="submit"
            style={{
              background: "#fff",
              color: "#000",
              padding: "8px",
              width: "200px",
              border: " 1.75px solid black;",
            }}
            disabled={status.submitting}
          >
            {!status.submitting
              ? !status.submitted
                ? "Submit"
                : "Submitted"
              : "Submitting..."}
          </motion.button>
        </p>
      </form>
      {status.info.error && (
        <div className="error">Error: {status.info.msg}</div>
      )}
      {!status.info.error && status.info.msg && <p>{status.info.msg}</p>}
    </div>
  );
}

export default Contact;
