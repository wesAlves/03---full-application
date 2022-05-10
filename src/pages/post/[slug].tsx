import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

export default function Post({ post }: Post) {
  // TODO
  return (
    <>
      {/* <img src={post.data.banner} alt="banner" /> */}
      <h1>{post.data.title}</h1>
      <p>{post.data.content}</p>
      <div>
        <ul>
          <li>{post.first_publication_date}</li>
          <li>{post.data.author}</li>
        </ul>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  return {
    paths: [{ params: { posts } }],
    fallback: 'blocking',
  };
  // TODO
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { uid } = params;

  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(uid));

  const post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: {
        heading: response.data.content.heading,
        body: {
          text: response.data.body.text,
        },
      },
    },
  };

  return {
    props: { post },
    redirect: 60 * 60 * 24 * 7,
  };
};
