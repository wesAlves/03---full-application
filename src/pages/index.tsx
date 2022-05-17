import { GetStaticProps } from 'next';
import Link from 'next/link';
import Header from '../components/Header';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useState } from 'react';
import Post from './post/[slug]';

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
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [results, setResults] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  // const { results } = postsPagination;

  // const { next_page } = postsPagination;

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleLoadMorePosts = (value: string) => {
    fetch(value)
      .then(response => response.json())
      .then(data => {
        setResults(data.results);
        setNextPage(data.next_page);
      });
  };

  return (
    <div>
      <Header />

      {results.map(post => {
        const formatedDate = format(
          new Date(post.first_publication_date),
          'dd MMM yyyy',
          {
            locale: ptBR,
          }
        );
        return (
          <Link href={`/post/${post.uid}`} key={post.uid}>
            <a>
              <h1>{post.data.title}</h1>
              <p>{post.data.subtitle}</p>
              <ul>
                <li>{formatedDate}</li>
                <li>{post.data.author}</li>
              </ul>
            </a>
          </Link>
        );
      })}

      {!!nextPage && (
        <button
          type="button"
          value="Carregar mais posts"
          onClick={() => handleLoadMorePosts(nextPage)}
        >
          Carregar mais posts
        </button>
      )}
    </div>
  );
}

export const getStaticProps = async () => {
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
  };
};
