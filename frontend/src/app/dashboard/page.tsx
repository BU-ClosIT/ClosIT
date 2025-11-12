"use client";

import PageLayout from "../../components/shared/PageLayout";
import RecommendationCard from "../../components/cards/RecommendationCard";

export default function Dashboard() {
  return (
    <PageLayout currentPage="Dashboard">
      <div className="w-full flex flex-col items-center justify-center">
        <RecommendationCard />
      </div>
    </PageLayout>
  );
}
