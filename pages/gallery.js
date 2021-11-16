import React from "react";
import client from "../apolloClient";
import { gql } from "@apollo/client";
import styles from "../styles/Gallery.module.css";
import { motion } from "framer-motion";
import Head from "next/head";

export default function gallerySection({ galleries }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Joslyne Keehmer - Photographer</title>
        <meta
          name="description"
          content="Gallery of the best Joshlyne Keehmer images."
        />
        <link rel="icon" href="/static/favicon.ico" />
      </Head>
      {galleries.map((gallery, key) => (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            margin: "2vh 3vw",
          }}
          key={key}
        >
          <a
            href={`/gallery/${gallery.slug}`}
            className={styles.displayImgLink}
          >
            <img
              src={gallery.picture[0].url}
              alt="Pics!"
              className={styles.displayImg}
            />

            <h3 className={styles.displayImgDarken}>{gallery.category_id}</h3>
          </a>
        </motion.div>
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query {
        galleries {
          category_id
          slug
          picture {
            url
            fileName
            id
          }
        }
      }
    `,
  });
  const { galleries } = data;
  return {
    props: {
      galleries,
    },
  };
}
