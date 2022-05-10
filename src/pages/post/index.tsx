import Link from 'next/link';

interface PostsProps {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

export default function Posts({
  uid,
  first_publication_date,
  data,
}: PostsProps) {
  return (
    <>
      jaca
      {/* <Link href={`/post/${uid}`}>
        <div key={uid}>
          <h1>{data.title}</h1>
          <p>{data.subtitle}</p>
          <ul>
            <li>{first_publication_date}</li>
            <li>{data.author}</li>
          </ul>
        </div>
      </Link> */}
    </>
  );
}
