import { gql } from "@apollo/client";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import client from "../apolloClient";
import RightArrow from "../public/Images/Home/rightArrow.png";
import { ScrollToTop } from "../components/Scroll";
import { motion } from "framer-motion";

export default function Home({ galleries }) {
  return (
    <div style={{ overflowX: "hidden" }}>
      <Head>
        <title>Joslyne Keehmer - Photographer</title>
        <meta
          name="description"
          content="Joshlyne is a travel photographer who's always on the go. No matter where my clients are located, I will do my best to visit them."
        />
        <link rel="icon" href="/static/favicon.ico" />
      </Head>
      <div className={styles.HeroImg}>
        <h1>
          Welcome! Here you'll find
          <div className={styles.introText}>
            <ul className={styles.flip4}>
              <li>Stories</li>
              <li>Beauty</li>
              <li>Legacies</li>
              <li>Memories</li>
            </ul>
          </div>
        </h1>
      </div>
      <div className={styles.container}>
        {galleries.map((gallery) => (
          <div className={styles.DisplayImg}>
            <h3>
              <motion.div
                whileHover={{ x: 50 }}
                whileTap={{ scale: 0.95, x: 0 }}
                transition={{ ease: "easeInOut", duration: 0.3 }}
                style={{ width: "100%" }}
              >
                <a
                  href={`/gallery/${gallery.slug}`}
                  style={{ color: "#000", textDecoration: "None" }}
                >
                  {gallery.category_id}
                  <Image src={RightArrow} alt="Arrow" width="25" height="20" />
                </a>
              </motion.div>
            </h3>
            <div className={styles.FlexImg}>
              {gallery.picture.map((picture, key) => {
                if (key < 6) {
                  return (
                    <div key={key}>
                      <img
                        src={picture.url}
                        alt="pic"
                        className={styles.ImgBackground}
                      />
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </div>
        ))}
      </div>
      <ScrollToTop />
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
