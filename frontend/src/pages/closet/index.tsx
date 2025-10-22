import Layout from "@/components/shared/layout";
import ClosetItem from "@/model/closet/ClosetItem";
import { FirebaseServices } from "@/services/firebase-services";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

interface PageProps {
  slug: string;
}

const ManageClosetPage: React.FC<PageProps> = ({ slug }: { slug: string }) => {
  const [closetItems, setClosetItems] = useState<ClosetItem[]>([]);
  const [user, setUser] = useState<User>({});

  const getClosetItems = async () => {
    const items = await FirebaseServices.getClosetByUserId({ userId: user.id });
    setClosetItems(items);
  };
  useEffect(() => {
    getClosetItems();
  }, [user]);

  return (
    <Layout>
      <h1>Page: {slug}</h1>

      <p>This is ManageClosetPage</p>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      slug: "ManageCloset",
    },
  };
};

export default ManageClosetPage;
