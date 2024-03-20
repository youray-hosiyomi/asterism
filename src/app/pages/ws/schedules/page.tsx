import ScheduleList from "@/app/components/schedules/schedule-list.component";
import UIPage from "@/common/ui/page.ui";
import { AuthPageFC } from "@/common/type/page.type";
import { schedules_searchQuery } from "./search";
import { useAuthContext } from "@/app/hooks/auth.hook";

const WS_Schedules_Page: AuthPageFC = () => {
  const { userId } = useAuthContext();
  const { params, setParams } = schedules_searchQuery.useParams();
  return (
    <UIPage className="p-2 lg:p-3">
      <ScheduleList
        userId={userId}
        date={params.current ?? new Date()}
        onChangeDate={(nextCurrent) => {
          setParams({
            ...params,
            current: nextCurrent,
          });
        }}
      />
    </UIPage>
  );
};

export default WS_Schedules_Page;
