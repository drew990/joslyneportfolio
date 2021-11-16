import React from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import styles from "../styles/Contact.module.css";

function contact() {
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [message, setMessage] = useState("");

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const data = {
  //     name,
  //     email,
  //     message,
  //   };

  //   fetch("/api/mail", {
  //     method: "post",
  //     body: JSON.stringify(data),
  //   });

  //   console.log(data);
  // };

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
      <form
        className={styles.formContainer}
        name="contact"
        method="POST"
        data-netlify="true"
      >
        <input type="hidden" name="form-name" value="contact" />
        <p>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            placeholder="Full Name"
            required
            name="fullname"
            className={styles.inputStyle}
          />
        </p>
        <p>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Full Email"
            required
            className={styles.inputStyle}
          />
        </p>
        <p>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            type="text"
            placeholder="Full Message"
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
          >
            Submit
          </motion.button>
        </p>
      </form>
    </div>
  );
}

export default contact;
