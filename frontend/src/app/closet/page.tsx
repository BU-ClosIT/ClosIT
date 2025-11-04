"use client";

import Layout from "@/components/shared/layout";
import { useUser } from "@/components/UserProvider";
import ClosetItem from "@/model/closet/ClosetItem";
import { User } from "@/model/User";
import { FirebaseServices } from "@/services/firebase-services";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

interface PageProps {
  slug: string;
}

const ManageClosetPage: React.FC<PageProps> = ({ slug }: { slug: string }) => {
  const [closetItems, setClosetItems] = useState<ClosetItem[]>([]);
  const user = useUser();

  const getClosetItems = async () => {
    if (!user) return;
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

export default ManageClosetPage;
