import { Schedule, scheduleMutationApi } from "@/app/api/schedule.api";
import UIFormControl from "@/common/ui/form-control.ui";
import { DateUtil } from "@/common/utils/date.util";
import { FC, useEffect, useState } from "react";

const ScheduleEditor: FC<{ initReq: Schedule; onSave: () => void; onCancel: () => void }> = ({
  initReq,
  onSave,
  onCancel,
}) => {
  const [req, setReq] = useState(initReq);
  const upsert = scheduleMutationApi.useUpsert();
  function save() {
    upsert.mutateAsync(req).then(() => {
      onSave();
    });
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
        <UIFormControl labelText="PlanAt">
          <div className="flex flex-col space-y-2">
            <input
              id="start_at"
              type="datetime-local"
              className="input input-bordered"
              value={req?.planAt?.from ? DateUtil.date2yyyymmddhhmm(req.planAt.from) : ""}
              max={req?.planAt?.to ? DateUtil.date2yyyymmddhhmm(req.planAt.to) : ""}
              onChange={(ev) => {
                const from: Date | null = ev.target.value !== "" ? DateUtil.toDate(ev.target.value) : null;
                if (req) {
                  if (!from) {
                    setReq({
                      ...req,
                      planAt: undefined,
                    });
                  } else if (req.planAt) {
                    setReq({
                      ...req,
                      planAt: {
                        ...req.planAt,
                        from,
                      },
                    });
                  } else {
                    setReq({
                      ...req,
                      planAt: {
                        from,
                        to: from,
                      },
                    });
                  }
                }
              }}
            />
            <input
              id="end_at"
              type="datetime-local"
              className="input input-bordered"
              value={req?.planAt?.to ? DateUtil.date2yyyymmddhhmm(req.planAt.to) : ""}
              min={req?.planAt?.from ? DateUtil.date2yyyymmddhhmm(req.planAt.from) : ""}
              onChange={(ev) => {
                const to: Date | null = ev.target.value !== "" ? DateUtil.toDate(ev.target.value) : null;
                if (req) {
                  if (!to) {
                    setReq({
                      ...req,
                      planAt: undefined,
                    });
                  } else if (req.planAt) {
                    setReq({
                      ...req,
                      planAt: {
                        ...req.planAt,
                        to,
                      },
                    });
                  } else {
                    setReq({
                      ...req,
                      planAt: {
                        from: to,
                        to,
                      },
                    });
                  }
                }
              }}
            />
          </div>
        </UIFormControl>
      </div>
      <div className="flex items-center justify-end space-x-2">
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
