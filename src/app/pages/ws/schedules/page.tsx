import UIPage from "@/app/ui/page.ui";
import { wsPageLinkConfig } from "@/common/config/page-link.config";
import { AuthPageFC } from "@/common/type/page.type";

const WS_Schedules_Page: AuthPageFC = () => {
  return (
    <UIPage className="p-2 lg:p-3">
      <div className="text-red-500 h-[200vh]">{wsPageLinkConfig["/ws/schedules"].name}</div>
    </UIPage>
  );
};

export default WS_Schedules_Page;
