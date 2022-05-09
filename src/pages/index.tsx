import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import Header from '../components/Header';
import Post from './post/[slug]';
import { JSXElementConstructor } from 'react';
import Link from 'next/link';

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

export default function Home(props): JSXElement {
  // TODO

  const { postsResponse } = props;

  const { results } = postsResponse;

  return (
    <div className={styles.container}>
      <Header />

      {results.map((post: Post) => {
        return (
          <div key={post.uid}>
            <Link href={`/post/${post.uid}`}>
              <h1>{post.data.title}</h1>
            </Link>
            <p>{post.data.subtitle}</p>
            <ul>
              <li>{post.first_publication_date}</li>
              <li>{post.data.author}</li>
            </ul>
          </div>
        );
      })}

      <a href="">Carregar mais posts</a>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});

  const postsResponse = await prismic.getByType('posts');

  return {
    props: {
      postsResponse,
    },
  };

  // TODO
};
