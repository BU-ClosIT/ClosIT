import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

interface PageProps {
  slug: string;
}

const SlugPage: React.FC<PageProps> = ({ slug }) => {
  return (
    <div>
      <h1>Page: {slug}</h1>
      <p>This is a dynamic page for the slug: {slug}</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };
  return {
    props: {
      slug,
    },
  };
};

export default SlugPage;
