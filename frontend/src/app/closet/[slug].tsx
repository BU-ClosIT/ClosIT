import PageLayout from "../../components/shared/PageLayout";
import { GetServerSideProps } from "next";

interface PageProps {
  slug: string;
}

const ClosetItemPage: React.FC<PageProps> = ({ slug }) => {
  return (
    <PageLayout>
      <h1>Page</h1>
      <p>This is ClosetItemPage for {slug}</p>
    </PageLayout>
  );
};

export default ClosetItemPage;
