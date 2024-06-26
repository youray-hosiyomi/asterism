"use client";

import AppTitle from "@/components/app-title.component";
import AuthorImg from "@/components/author-img.component";
import { UILayout, UIPage } from "@youray-hosiyomi/asterism-ui-react";
import Link from "next/link";

export default function IndexPage() {
  return (
    <UILayout
      header={{
        leftItems: <AppTitle title="YOURAY-HOSIYOMI" />,
        rightItems: (
          <>
            <Link href={"/ws"}>
              <button className="btn btn-sm btn-outline">ワークスペース</button>
            </Link>
          </>
        ),
      }}
    >
      <UIPage className="p-2 lg:p-4">
        <div>
          <AuthorImg height={200} width={200} className="bg-gray-500 rounded-2xl" />
        </div>
      </UIPage>
    </UILayout>
  );
}
