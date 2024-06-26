"use client";

import AppTitle from "@/components/app-title.component";
import { AuthUserBtn } from "@/components/auth/auth-user-btn.component";
import BaseLayout from "@/components/base-layout.component";
import Link from "next/link";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <BaseLayout
      header={{
        leftItems: (
          <>
            <Link href={"/ws"}>
              <AppTitle />
            </Link>
          </>
        ),
        rightItems: (
          <>
            <AuthUserBtn />
          </>
        ),
      }}
    >
      {children}
    </BaseLayout>
  );
}
