import Layout from "@/components/shared/layout";
import { GetServerSideProps } from "next";

interface PageProps {
  slug: string;
}

const ManageClosetPage: React.FC<PageProps> = ({ slug }) => {
  return (
    <Layout>
      <h1>Page: {slug}</h1>
      <p>This is ManageClosetPage</p>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default ManageClosetPage;
