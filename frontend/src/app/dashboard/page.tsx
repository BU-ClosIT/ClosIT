"use client";

import { useState } from "react";
import PageLayout from "../../components/shared/PageLayout";
import Loader from "@/src/components/shared/Loader";
import RecommendationCard from "@/src/components/cards/RecommendationCard";

export default function Dashboard() {
  return (
    <PageLayout>
      <div className="w-full flex flex-col items-center justify-center">
        <RecommendationCard />
      </div>
    </PageLayout>
  );
}
