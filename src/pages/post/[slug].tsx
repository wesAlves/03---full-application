import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

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

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  const formatedDate = format(
    new Date(post.first_publication_date),
    'dd MMM yyyy',
    {
      locale: ptBR,
    }
  );

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }
  return (
    <>
      <img src="data.banner.url" alt="banner" />
      <h1>{post.data.title}</h1>
      <div>
        <ul>
          <li>4 min</li>
          <li>{formatedDate}</li>
          <li>{post.data.author}</li>
        </ul>
      </div>

      {post.data.content !== undefined &&
        post.data.content.map(({ heading, body }) => {
          return (
            <>
              <h2>{heading}</h2>
              {body.map(b => {
                return <p>{b.text}</p>;
              })}
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

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { uid } = params;

  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', uid as string);

  const post = response;

  return { props: { post }, revalidate: 1 };
};
