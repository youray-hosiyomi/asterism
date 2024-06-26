"use client";

import AuthProvider from "@/providers/auth.provider";
import { UILayout, UILayoutProps } from "@youray-hosiyomi/asterism-ui-react";
import { FC } from "react";

const BaseLayout: FC<UILayoutProps> = (props) => {
  return (
    <AuthProvider>
      <UILayout {...props} />
    </AuthProvider>
  );
};

export default BaseLayout;
