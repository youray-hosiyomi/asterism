import { Schedule, Schedule_Req, scheduleApi } from "@/app/api/schedule.api";
import { DateUtil } from "@/common/utils/date.util";
import { ArrowLeftIcon, ArrowRightIcon, Circle, CircleCheck } from "lucide-react";
import { FC, useRef, useState } from "react";
import ScheduleEditor from "./schedule-editor.component";
import UIDialog, { UIDialogHandler } from "@/common/ui/dialog.ui";
import dayjs from "dayjs";
import { UILoading } from "@/common/ui/loading.ui";
import "./schedule-list.css";
import { NullableValue } from "@/common/obj/values.obj";
import { StringUtil } from "@/common/utils/string.util";

type OnChangeDate = (nextCurrent: Date) => void;
type OnStartEdit = (schedule: Schedule) => void;

const ScheduleDayList: FC<{ date: Date; onStartEdit: OnStartEdit }> = ({ date, onStartEdit }) => {
  const { data: schedules, isLoading } = scheduleApi.query.useList({
    orderAscending: true,
    range: { from: dayjs(date).startOf("date").toDate(), to: dayjs(date).add(1, "day").startOf("date").toDate() },
  });
  if (!schedules || isLoading) {
    return (
      <div className="flex items-center justify-center">
        <UILoading />
      </div>
    );
  }
  return (
    <ul className="timeline timeline-vertical timeline-compact animate-fadein schedule-timeline">
      {schedules.map((sche, index) => {
        return (
          <li key={index.toString()} className="">
            {index !== 0 && <hr />}
            <div className="timeline-middle">
              {true && <Circle className="w-5 h-5 p-0.5" />}
              {false && <CircleCheck className="w-5 h-5 p-0.5 text-success" />}
            </div>
            <div
              className="timeline-end timeline-box hover:shadow-md schedule-timeline-card"
              onClick={() => {
                onStartEdit(sche);
              }}
            >
              <div className="flex items-center space-x-1">
                <span className="text-sm">
                  {DateUtil.dateFormat(
                    new NullableValue(StringUtil.empty2null(sche.plan_from_at))
                      .map((v) => DateUtil.timestamp2date(v))
                      .getVal(),
                    "HH:mm",
                  )}
                </span>
                <span className="text-sm">~</span>
                <span className="text-sm">
                  {DateUtil.dateFormat(
                    new NullableValue(StringUtil.empty2null(sche.plan_to_at))
                      .map((v) => DateUtil.timestamp2date(v))
                      .getVal(),
                    "HH:mm",
                  )}
                </span>
              </div>
              <div className="text-md font-semibold">{sche.title}</div>
              {/* <div className="hidden-area flex items-center justify-end w-full">
                <button
                  className="btn btn-xs btn-circle btn-success btn-outline"
                  onClick={() => {
                    onStartEdit(sche);
                  }}
                >
                  <PenIcon className="h-4 w-4" />
                </button>
              </div> */}
            </div>
            {index !== schedules.length - 1 && <hr />}
          </li>
        );
      })}
    </ul>
  );
};

const ScheduleList: FC<{ userId: string; date: Date; onChangeDate: OnChangeDate }> = ({
  userId,
  date,
  onChangeDate,
}) => {
  const dialogHandler = useRef<UIDialogHandler>(null);
  const [initReq, setInitReq] = useState<Schedule_Req>(scheduleApi.empty(userId));
  const add = () => {
    setInitReq(scheduleApi.empty(userId));
    dialogHandler.current?.open();
  };
  const startEdit: OnStartEdit = (schedule) => {
    setInitReq(schedule);
    dialogHandler.current?.open();
  };
  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between max-md:hidden">
          <div className="join">
            <button
              className="btn btn-sm btn-neutral join-item"
              onClick={() => {
                onChangeDate(dayjs(date).add(-1, "day").toDate());
              }}
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
            <select
              id="schedule-list-kind"
              className="select select-sm select-bordered join-item"
              value={"Day"}
              onChange={(ev) => {
                ev;
              }}
            >
              <option>Day</option>
              <option>Week</option>
              <option>Month</option>
            </select>
            <input
              id="schedule-list-date"
              className="input input-sm input-bordered join-item"
              type="date"
              value={DateUtil.date2yyyymmdd(date)}
              onChange={(ev) => {
                if (ev.target.value !== "") {
                  onChangeDate(DateUtil.toDate(ev.target.value));
                } else {
                  onChangeDate(new Date());
                }
              }}
            />
            <button
              className="btn btn-sm btn-neutral join-item"
              onClick={() => {
                onChangeDate(dayjs(date).add(1, "day").toDate());
              }}
            >
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
          <div>
            <button
              className="btn btn-sm btn-success btn-outline"
              onClick={() => {
                add();
              }}
            >
              <span>Add</span>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between md:hidden">
          <div>
            <input
              id="schedule-list-date"
              className="input input-sm input-bordered join-item"
              type="date"
              value={DateUtil.date2yyyymmdd(date)}
              onChange={(ev) => {
                if (ev.target.value !== "") {
                  onChangeDate(DateUtil.toDate(ev.target.value));
                } else {
                  onChangeDate(new Date());
                }
              }}
            />
          </div>
          <div>
            <button
              className="btn btn-sm btn-success btn-outline"
              onClick={() => {
                add();
              }}
            >
              <span>Add</span>
            </button>
          </div>
        </div>
        <ScheduleDayList date={date} onStartEdit={startEdit} />
      </div>
      <UIDialog ref={dialogHandler}>
        <ScheduleEditor
          initReq={initReq}
          onSave={() => {
            dialogHandler.current?.close();
          }}
          onCancel={() => {
            dialogHandler.current?.close();
          }}
        />
      </UIDialog>
    </>
  );
};

export default ScheduleList;
