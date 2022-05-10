/* eslint-disable @typescript-eslint/explicit-function-return-type */
import next, { GetStaticProps } from 'next';

import { JSXElementConstructor } from 'react';
import Link from 'next/link';
import el from 'date-fns/esm/locale/el/index.js';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import Header from '../components/Header';
import Post from './post/[slug]';
import Posts from './post';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results?: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Home({ postsPagination }: HomeProps) {
  // eslint-disable-next-line prefer-destructuring
  const results = postsPagination.results;

  // eslint-disable-next-line prefer-destructuring
  const next_page = postsPagination.next_page;

  return (
    <div className={styles.container}>
      <Header />

      {results !== undefined &&
        results.map((post: Post) => {
          return (
            <>
              <Link href={`/post/${post.uid}`}>
                <div key={post.uid}>
                  <h1>{post.data.title}</h1>
                  <p>{post.data.subtitle}</p>
                  <ul>
                    <li>{post.first_publication_date}</li>
                    <li>{post.data.author}</li>
                  </ul>
                </div>
              </Link>
            </>
          );
        })}

      {next_page !== null && <Link href="/" />}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});

  const postsResponse = await prismic.getByType('posts');

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results,
  };

  return {
    props: {
      postsPagination,
    },
    revalidate: 60 * 60 * 24 * 7,
  };
};
