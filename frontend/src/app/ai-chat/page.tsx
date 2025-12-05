"use client";

import PageLayout from "../../components/shared/PageLayout";
import AiChatCard from "@/src/components/cards/AiChatCard";

export default function AiChatPage() {
  return (
    <PageLayout currentPage="AI Chat">
      <div className="w-full flex flex-col items-center justify-center pt-4">
        <AiChatCard />
      </div>
    </PageLayout>
  );
}
