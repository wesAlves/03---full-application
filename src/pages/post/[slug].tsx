/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import dynamic from 'next/dynamic';

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
    Content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function Post({ post }: Post) {
  // TODO

  const { data, first_publication_date } = post;

  const content = data.Content;

  return (
    <>
      <img src={data.banner.url} alt="banner" />
      <h1>{data.title}</h1>

      {content !== undefined &&
        content.map(({ heading, body }) => {
          return (
            <>
              <h2>{heading}</h2>
              {body.map(bodyText => {
                return <p>{bodyText.text}</p>;
              })}
            </>
          );
        })}

      <div>
        <ul>
          <li>{first_publication_date}</li>
          <li>{data.author}</li>
        </ul>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
  // TODO
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(slug));

  const post = response;

  return {
    props: { post },
    revalidate: 60 * 60 * 24 * 7,
  };
};
