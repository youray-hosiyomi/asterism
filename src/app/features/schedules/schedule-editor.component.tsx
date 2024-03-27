import { Schedule_Req, scheduleApi } from "@/app/api/schedule.api";
import UIFormControl from "@/common/ui/form-control.ui";
import { DateUtil } from "@/common/utils/date.util";
import { FC, useEffect, useMemo, useState } from "react";

const ScheduleEditor: FC<{ initReq: Schedule_Req; onSave: () => void; onCancel: () => void }> = ({
  initReq,
  onSave,
  onCancel,
}) => {
  const [req, setReq] = useState(initReq);
  const isNew = useMemo(() => {
    return !initReq.id;
  }, [initReq]);
  const upsertSchedule = scheduleApi.mutation.useUpsert();
  const deleteSchedule = scheduleApi.mutation.useDelete();
  function save() {
    upsertSchedule.mutateAsync(req).then(() => {
      onSave();
    });
  }
  function remove() {
    if (req.id) {
      deleteSchedule.mutateAsync({ id: req.id }).then(() => {
        onSave();
      });
    }
  }
  function cancel() {
    onCancel();
  }
  useEffect(() => {
    setReq(initReq);
  }, [initReq]);
  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
      }}
    >
      <div>
        <UIFormControl labelText="Title">
          <input
            id="title"
            className="input input-bordered"
            value={req.title}
            onChange={(ev) => {
              setReq({
                ...req,
                title: ev.target.value,
              });
            }}
          />
        </UIFormControl>
        <UIFormControl labelText="Detail">
          <textarea
            id="detail"
            className="textarea textarea-bordered w-full"
            value={req?.detail ?? ""}
            rows={10}
            onChange={(ev) => {
              if (req)
                setReq({
                  ...req,
                  detail: ev.target.value,
                });
            }}
          />
        </UIFormControl>
        <UIFormControl labelText="Scheduled Start Datetime">
          <input
            id="start_at"
            type="datetime-local"
            className="input input-bordered"
            value={DateUtil.date2yyyymmddhhmm(DateUtil.timestamp2date(req.plan_from_at))}
            max={DateUtil.date2yyyymmddhhmm(DateUtil.timestamp2date(req.plan_to_at))}
            onChange={(ev) => {
              const from: Date | null = ev.target.value !== "" ? DateUtil.toDate(ev.target.value) : null;
              const to = DateUtil.timestamp2date(req.plan_to_at);
              const plan_to_at = DateUtil.date2timestamp(to);
              if (req) {
                if (!from) {
                  setReq({
                    ...req,
                    plan_from_at: plan_to_at,
                  });
                } else {
                  const plan_from_at = DateUtil.date2timestamp(from);
                  if (from.getTime() > to.getTime()) {
                    setReq({
                      ...req,
                      plan_to_at: plan_from_at,
                    });
                  } else {
                    setReq({
                      ...req,
                      plan_from_at,
                    });
                  }
                }
              }
            }}
          />
        </UIFormControl>
        <UIFormControl labelText="Scheduled End Datetime">
          <input
            id="end_at"
            type="datetime-local"
            className="input input-bordered"
            value={DateUtil.date2yyyymmddhhmm(DateUtil.timestamp2date(req.plan_to_at))}
            min={DateUtil.date2yyyymmddhhmm(DateUtil.timestamp2date(req.plan_from_at))}
            onChange={(ev) => {
              const from = DateUtil.timestamp2date(req.plan_from_at);
              const to: Date | null = ev.target.value !== "" ? DateUtil.toDate(ev.target.value) : null;
              const plan_from_at = DateUtil.date2timestamp(from);
              if (req) {
                if (!to) {
                  setReq({
                    ...req,
                    plan_to_at: plan_from_at,
                  });
                } else {
                  const plan_to_at = DateUtil.date2timestamp(to);
                  if (from.getTime() > to.getTime()) {
                    setReq({
                      ...req,
                      plan_from_at: plan_to_at,
                    });
                  } else {
                    setReq({
                      ...req,
                      plan_to_at,
                    });
                  }
                }
              }
            }}
          />
        </UIFormControl>
      </div>
      <div className="flex items-center justify-end space-x-2">
        {!isNew && (
          <>
            <button
              type="button"
              className="btn btn-outline btn-error btn-sm"
              onClick={() => {
                remove();
              }}
            >
              Delete
            </button>
          </>
        )}
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => {
            cancel();
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-outline btn-success btn-sm"
          onClick={() => {
            save();
          }}
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ScheduleEditor;
