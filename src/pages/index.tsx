import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import Header from '../components/Header';
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
  results?: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(props) {
  // TODO
  return (
    <div className={styles.container}>
      <Header />

      <div>
        <h1>Title</h1>
        <p>Content</p>
        <div>
          <ul>
            <li>Date</li>
            <li>Author</li>
          </ul>
        </div>
      </div>
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
