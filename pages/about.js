import React from "react";
import styles from "../styles/about.module.css";
import Head from "next/head";
import { gql } from "@apollo/client";
import client from "../apolloClient";
import { Row, Col, Image } from "react-bootstrap";

export default function about({ aboutMes }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Joslyne Keehmer - About Me</title>
        <meta
          name="description"
          content="My name is Joslyne Keehmer and I am a freelance photographer from Sacramento, California."
        />
        <link rel="icon" href="/static/favicon.ico" />
      </Head>
      <h2 style={{ padding: "1vh 0 3vh 0" }}>About Page</h2>
      {aboutMes.map((aboutMe, key) => (
        <Row key={key}>
          <Col md={12}>
            <Image
              src={aboutMe.pic.url}
              alt="About Me Pic"
              className={styles.AboutMeImg}
            />
          </Col>
          <Col md>
            <div
              style={{ paddingTop: "7vh" }}
              dangerouslySetInnerHTML={{ __html: aboutMe.description.html }}
            />
          </Col>
        </Row>
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query {
        aboutMes {
          description {
            raw
            html
          }
          pic {
            url
          }
        }
      }
    `,
  });
  const { aboutMes } = data;
  return {
    props: {
      aboutMes,
    },
    revalidate: 10, // In seconds
  };
}
