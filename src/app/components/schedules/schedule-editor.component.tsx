import { Schedule, scheduleMutationApi } from "@/app/api/schedule.api";
import UIFormControl from "@/common/ui/form-control.ui";
import { DateUtil } from "@/common/utils/date.util";
import { FC, useEffect, useMemo, useState } from "react";

const ScheduleEditor: FC<{ initReq: Schedule; onSave: () => void; onCancel: () => void }> = ({
  initReq,
  onSave,
  onCancel,
}) => {
  const [req, setReq] = useState(initReq);
  const isNew = useMemo(() => {
    return initReq.isNew ?? false;
  }, [initReq]);
  const upsertSchedule = scheduleMutationApi.useUpsert();
  const deleteSchedule = scheduleMutationApi.useDelete();
  function save() {
    upsertSchedule.mutateAsync(req).then(() => {
      onSave();
    });
  }
  function remove() {
    if (!isNew) {
      deleteSchedule.mutateAsync(req).then(() => {
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
            value={DateUtil.date2yyyymmddhhmm(req.planAt.from)}
            max={DateUtil.date2yyyymmddhhmm(req.planAt.to)}
            onChange={(ev) => {
              const from: Date | null = ev.target.value !== "" ? DateUtil.toDate(ev.target.value) : null;
              const to = req.planAt.to;
              if (req) {
                if (!from) {
                  setReq({
                    ...req,
                    planAt: {
                      from: to,
                      to,
                    },
                  });
                } else if (from.getTime() > to.getTime()) {
                  setReq({
                    ...req,
                    planAt: {
                      from,
                      to: from,
                    },
                  });
                } else {
                  setReq({
                    ...req,
                    planAt: {
                      from,
                      to,
                    },
                  });
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
            value={DateUtil.date2yyyymmddhhmm(req.planAt.to)}
            min={DateUtil.date2yyyymmddhhmm(req.planAt.from)}
            onChange={(ev) => {
              const from = req.planAt.from;
              const to: Date | null = ev.target.value !== "" ? DateUtil.toDate(ev.target.value) : null;
              if (req) {
                if (!to) {
                  setReq({
                    ...req,
                    planAt: {
                      from,
                      to: from,
                    },
                  });
                } else if (from.getTime() > to.getTime()) {
                  setReq({
                    ...req,
                    planAt: {
                      from: to,
                      to,
                    },
                  });
                } else {
                  setReq({
                    ...req,
                    planAt: {
                      from,
                      to,
                    },
                  });
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
