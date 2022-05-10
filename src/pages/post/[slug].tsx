/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GetStaticPaths, GetStaticProps } from 'next';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

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

  const formatedDate = format(new Date(first_publication_date), 'dd MMM yyyy', {
    locale: ptBR,
  });

  return (
    <>
      <img src={data.banner.url} alt="banner" />
      <h1>{data.title}</h1>
      <div>
        <ul>
          <li>4 min</li>
          <li>{formatedDate}</li>
          <li>{data.author}</li>
        </ul>
      </div>

      {content !== undefined &&
        content.map(({ heading, body }) => {
          return (
            <>
              <h2>{heading}</h2>
              <p>{body.text}</p>
              {/* {body.map(bodyText => {
                return <p>{bodyText.text}</p>;
              })} */}
            </>
          );
        })}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  const uid = posts.results.map(post => {
    return post.uid;
  });

  return {
    // paths: [{ params: { slug: uid[0] } }, { params: { slug: uid[1] } }],
    paths: [],
    // { params: { slug: posts.results[1].uid } },
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
