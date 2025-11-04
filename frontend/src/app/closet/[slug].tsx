import Layout from "@/components/shared/layout";
import { GetServerSideProps } from "next";

interface PageProps {
  slug: string;
}

const ClosetItemPage: React.FC<PageProps> = ({ slug }) => {
  return (
    <Layout>
      <h1>Page</h1>
      <p>This is ClosetItemPage for {slug}</p>
    </Layout>
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

export default ClosetItemPage;
