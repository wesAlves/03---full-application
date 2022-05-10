import next, { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import Header from '../components/Header';
import Post from './post/[slug]';
import Posts from './post';
import { JSXElementConstructor } from 'react';
import Link from 'next/link';
import el from 'date-fns/esm/locale/el/index.js';

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

export default function Home({ postsPagination }: HomeProps) {
  // TODO

  // const { posts } = props;
  // console.log(postsResponse);

  const  = postsPagination.results;
  const nextPage = posts?.next_page;

  return (
    <div className={styles.container}>
      <Header />

      {postsResults.map((post: Post) => {
        return (
          <Posts
            uid={post.uid}
            data={post.data}
            first_publication_date={post.first_publication_date}
          />
        );
      })}

      {nextPage !== null && <Link href="/" />}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});

  const postsResponse = await prismic.getByType('posts');

  const posts = postsResponse.results.map((post): Post => {
    return {
      uid: post.uid,
      data: {
        author: post.data.author,
        subtitle: post.data.subtitle,
        title: post.data.title,
      },
      first_publication_date: post.first_publication_date,
    };
  });

  return {
    props: {
      posts,
    },
  };

  // TODO
};
