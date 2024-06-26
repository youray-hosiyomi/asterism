"use client";

import { UILoading } from "@youray-hosiyomi/asterism-ui-react";
import { FC } from "react";

const Loading: FC = () => {
  return (
    <div className="w-full py-10 flex items-center justify-center">
      <UILoading className="h-10 w-10" />
    </div>
  );
};

export default Loading;
