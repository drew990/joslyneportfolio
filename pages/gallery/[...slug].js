import React from "react";
import client from "../../apolloClient";
import { gql } from "@apollo/client";
import Head from "next/head";
import Link from "next/link";
import styles from "../../styles/slug.module.css";
import { ScrollToTop } from "../../components/Scroll";

export default function GalleryPage({ gallery, key }) {
  return (
    <>
      <Head>
        <title>Joslyne Keehmer - Photographer - {gallery.category_id}</title>
        <meta
          name="description"
          content="Joshlyne is a travel photographer who's always on the go. No matter where my clients are located, I will do my best to visit them."
        />
        <link rel="icon" href="/static/favicon.ico" />
      </Head>
      <div className={styles.container} key={key}>
        <h1 style={{ textAlign: "center", padding: "2vh 0" }}>
          {gallery.category_id}
        </h1>
        <div className={styles.FlexImg}>
          {gallery.picture.map((picture) => (
            <img src={picture.url} alt="Pic" className={styles.ImgBackground} />
          ))}
        </div>

        <h4 style={{ textAlign: "center", padding: "7vh 0" }}>
          <Link href="/" style={{ color: "#000", textDecoration: "None" }}>
            Back to Home
          </Link>
        </h4>

        <ScrollToTop />
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const { data } = await client.query({
    query: gql`
      query {
        galleries {
          slug
        }
      }
    `,
  });
  const { galleries } = data;
  const paths = galleries.map((gallery) => ({
    params: { slug: [gallery.slug] },
  }));
  console.log(paths);
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const slug = params.slug[0];

  const { data } = await client.query({
    query: gql`
      query GalleryBySlug($slug: String!) {
        galleries(where: { slug: $slug }) {
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
    variables: { slug },
  });

  const { galleries } = data;
  const gallery = galleries[0];

  return { props: { gallery } };
}
