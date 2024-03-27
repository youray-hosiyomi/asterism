import UIPage from "@/common/ui/page.ui";
import { AuthPageFC } from "@/common/type/page.type";
import { useState } from "react";
import { RenderRuleObject } from "@/app/types/render-rule.type";
import RepositoryRenderRuleField from "@/app/features/repositories/table/render-rule-field.component";

const WS_Projects_Page: AuthPageFC = () => {
  const [req, setReq] = useState<RenderRuleObject>({ type: "string", kind: "value", value: "" });
  return (
    <UIPage className="p-2 lg:p-3">
      <RepositoryRenderRuleField req={req} onChange={setReq} />
    </UIPage>
  );
};

export default WS_Projects_Page;
