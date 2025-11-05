"use client";

import { useEffect, useState } from "react";
import { FirebaseServices } from "../../services/firebase-services";
import { useUser } from "../../components/providers/UserProvider";
import ClosetItem from "../../model/closet/ClosetItem";
import PageLayout from "../../components/shared/PageLayout";
import AddButton from "../../components/closet-management/AddButton";

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
    <PageLayout>
      <h1 className="">Page: {slug}</h1>

      <p>This is ManageClosetPage</p>

      <AddButton />
    </PageLayout>
  );
};

export default ManageClosetPage;
