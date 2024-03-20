import { cn } from "@/common/utils/classname.util";
import {
  ReactNode,
  CSSProperties,
  useState,
  useEffect,
  useMemo,
  useImperativeHandle,
  RefObject,
  Dispatch,
  SetStateAction,
  useRef,
  createRef,
  useCallback,
  KeyboardEventHandler,
  FocusEventHandler,
  HTMLInputTypeAttribute,
  FC,
} from "react";
import { UILoading } from "./loading.ui";

export type UIDataGridColumnHeaderRenderArg = {
  name: string;
  isGroup: boolean;
};

export type UIDataGridColumnRenderArg<Data> = {
  rowIndex: number;
  data: Data;
  initData: Data;
  selected: boolean;
};

export type UIDataGridColumnCellRenderArg<Data> = UIDataGridColumnRenderArg<Data> & {
  cellId: string;
  cellActionId: string;
  editing: boolean;
  toggleEditing: () => void;
  rowId: string;
  columnId: string;
  value: string;
  initValue: string;
  setData: (handler: (prevData: Data) => Data) => void;
  selectToggle: () => void;
};

type RenderReturns = {
  style?: CSSProperties;
  className?: string;
  element?: ReactNode;
};

export type UIDataGridColumnDef<Data> = {
  type: "group" | "node";
  id: string;
  name?: string;
  accessorFn?: (data: Data) => string;
  head?: (arg: UIDataGridColumnHeaderRenderArg) => RenderReturns;
  cell?: (arg: UIDataGridColumnCellRenderArg<Data>) => RenderReturns & {
    onKeyDown?: KeyboardEventHandler<HTMLTableCellElement>;
    onBlur?: FocusEventHandler<HTMLTableCellElement>;
  };
  foot?: () => RenderReturns;
  editable?: boolean;
  suppressEnter?: boolean;
  width?: number;
  children?: UIDataGridColumnDef<Data>[];
  hidden?: boolean;
};

export type UIDataGridRowDef<Data> = {
  rowId: (data: Data) => string;
  rowClassName?: (arg: UIDataGridColumnRenderArg<Data>) => string;
  rowStyle?: (arg: UIDataGridColumnRenderArg<Data>) => CSSProperties;
};

type Column<Data> = {
  id: string;
  def: UIDataGridColumnDef<Data>;
  parent: UIDataGridColumnDef<Data>[];
  colSpan?: number;
};

export type UIDataGridActiveCell<Data> = {
  rowId: string;
  columnId: string;
  column: Column<Data>;
  editable: boolean;
  editing?: boolean;
  loading?: boolean;
};

type RowHandler<Data> = {
  data: Data;
  initData: Data;
  setData: Dispatch<SetStateAction<Data>>;
  rowElement?: HTMLTableRowElement;
};

function getCellId<Data>(dataGridId: string | undefined, rowId: string, column: Column<Data>, isAction?: boolean) {
  const base = (dataGridId ?? "") + "_dataGridCell_" + rowId + "_" + column.id;
  if (isAction) {
    return base + "_action";
  } else {
    return base;
  }
}

const getColumnId = <Data,>(dataGridId: string, columnId: string, parent: UIDataGridColumnDef<Data>[]): string => {
  return [dataGridId]
    .concat(parent.map((c) => c.id))
    .concat(columnId)
    .join("_");
};

interface RowProps<Data> {
  dataGridId?: string;
  handlerRef?: RefObject<RowHandler<Data>>;
  rowId: string;
  rowIndex: number;
  initData: Data;
  flatColumns: Column<Data>[];
  rowDef: UIDataGridRowDef<Data>;
  activeCell: UIDataGridActiveCell<Data> | undefined;
  setActiveCell: Dispatch<SetStateAction<UIDataGridActiveCell<Data> | undefined>>;
  selected: boolean;
  selectToggle: () => void;
  onChange: (data: Data) => void;
}

const Row = <Data,>({
  dataGridId,
  initData,
  rowId,
  rowIndex,
  flatColumns,
  rowDef,
  activeCell,
  setActiveCell,
  selected,
  selectToggle,
  handlerRef,
  onChange,
}: RowProps<Data>): ReactNode => {
  const [data, setData] = useState<Data>(initData);
  const rowRef = useRef<HTMLTableRowElement | null>(null);
  const renderArg: UIDataGridColumnRenderArg<Data> = {
    rowIndex,
    data,
    initData,
    selected,
  };
  useEffect(() => {
    setData(initData);
  }, [initData]);
  useImperativeHandle(
    handlerRef,
    () => {
      return {
        data,
        initData,
        setData,
        rowElement: rowRef.current ?? undefined,
      };
    },
    [data, initData, rowRef],
  );
  return (
    <tr
      ref={rowRef}
      style={rowDef.rowStyle && rowDef.rowStyle(renderArg)}
      className={cn((rowDef.rowClassName && rowDef.rowClassName(renderArg)) ?? "bg-inherit", "")}
    >
      {flatColumns.map((column, columnIndex) => {
        const value: string = column.def.accessorFn ? column.def.accessorFn(data) : "";
        const initValue: string = column.def.accessorFn ? column.def.accessorFn(initData) : "";
        const columnId = column.id;
        const cellId = getCellId(dataGridId, rowId, column);
        const active = activeCell?.rowId == rowId && activeCell?.columnId == column.id;
        const editable = column.def.editable ?? false;
        const editing = active && (activeCell.editing ?? false);
        const toggleEditing = () => {
          if (activeCell && active && editable) {
            setActiveCell({
              ...activeCell,
              editing: !editing,
            });
          }
        };
        const r =
          column.def.cell &&
          column.def.cell({
            rowIndex,
            cellId,
            cellActionId: getCellId(dataGridId, rowId, column, true),
            rowId,
            editing,
            toggleEditing,
            columnId,
            data,
            initData,
            value,
            initValue,
            setData: (handler) => {
              setData(handler);
              onChange(handler(data));
            },
            selected,
            selectToggle,
          });
        return (
          <td
            tabIndex={0}
            key={columnIndex}
            id={cellId}
            style={{ ...r?.style }}
            className={cn(
              r?.className ?? "",
              "outline-none",
              active ? (editing ? "border-2 border-green-400" : "border-2 border-blue-400") : "border",
            )}
            onFocus={() => {
              if (!active) {
                setActiveCell({
                  rowId: rowId,
                  columnId,
                  editable,
                  column,
                  editing,
                });
              }
            }}
            onBlur={(ev) => {
              if (active) {
                if (!editing) {
                  setActiveCell(undefined);
                } else if (ev.currentTarget) {
                  if (r?.onBlur) {
                    r.onBlur(ev);
                  }
                }
              }
            }}
            onDoubleClick={() => {
              if (activeCell && editable && !editing) {
                setActiveCell({
                  ...activeCell,
                  editing: true,
                });
              }
            }}
            onKeyDown={r?.onKeyDown}
          >
            {r?.element ?? value}
          </td>
        );
      })}
    </tr>
  );
};

type ColumnParams<Data> = {
  columnsRows: Column<Data>[][];
  flatColumns: Column<Data>[];
  existFoot: boolean;
};

type GetListReturn<Data> = {
  data: Data;
  initData: Data;
};

export type UIDataGridHandler<Data> = {
  getList: () => GetListReturn<Data>[];
  activeCell: UIDataGridActiveCell<Data> | undefined;
  setActiveCell: Dispatch<SetStateAction<UIDataGridActiveCell<Data> | undefined>>;
  scrollByRowId: (rowId: string) => void;
};

type OnRowDataChangeArg<Data> = {
  rowId: string;
  rowIndex: number;
  data: Data;
  initData: Data;
};

export interface UIDataGridProps<Data> {
  id?: string;
  handlerRef?: RefObject<UIDataGridHandler<Data>>;
  initList?: Data[];
  columnDefs: UIDataGridColumnDef<Data>[];
  leftColumnDef?: UIDataGridColumnDef<Data>;
  rightColumnDef?: UIDataGridColumnDef<Data>;
  rowDef: UIDataGridRowDef<Data>;
  selectedRowIds?: string[];
  setSelectedRowIds?: Dispatch<SetStateAction<string[]>>;
  className?: string;
  style?: CSSProperties;
  emptyContent?: ReactNode;
  headerContent?: ReactNode;
  calcTableTotalWidth?: boolean;
  isLoading?: boolean;
  onRowDataChange?: (arg: OnRowDataChangeArg<Data>) => void;
}

export const UIDataGrid = <Data,>({
  id,
  handlerRef,
  initList,
  rowDef,
  className,
  style,
  columnDefs,
  selectedRowIds,
  setSelectedRowIds,
  emptyContent,
  headerContent,
  calcTableTotalWidth,
  isLoading,
  onRowDataChange,
}: UIDataGridProps<Data>): ReactNode => {
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const [activeCell, setActiveCell] = useState<UIDataGridActiveCell<Data> | undefined>(undefined);
  const rowHandlerRefs = useRef(initList?.map(() => createRef<RowHandler<Data>>()) ?? []);
  const getList = useCallback(() => {
    return (
      initList?.map((initData, rowIndex) => {
        const data = rowHandlerRefs.current[rowIndex].current?.data ?? initData;
        return {
          data,
          initData,
        };
      }) ?? []
    );
  }, [initList]);
  const getRowIndexByRowId = useCallback(
    (rowId: string): number => {
      return initList?.findIndex((data) => rowDef.rowId(data) == rowId) ?? -1;
    },
    [initList, rowDef],
  );
  const scrollByRowId = useCallback(
    (rowId: string): void => {
      const rowIndex = getRowIndexByRowId(rowId);
      const rowElm = rowHandlerRefs.current.at(rowIndex)?.current;
      if (rowElm?.rowElement) {
        rowElm.rowElement.scrollIntoView({ behavior: "smooth" });
      }
    },
    [getRowIndexByRowId],
  );
  useEffect(() => {
    initList?.forEach((_, rowIndex) => {
      rowHandlerRefs.current[rowIndex] = createRef<RowHandler<Data>>();
    });
  }, [initList]);
  const { columnsRows, flatColumns, existFoot }: ColumnParams<Data> = useMemo(() => {
    const columnsRows: Column<Data>[][] = [];
    const flatColumns: Column<Data>[] = [];
    const setParams = (
      columnDefs: UIDataGridColumnDef<Data>[],
      parent: UIDataGridColumnDef<Data>[] = [],
      depth: number = 0,
    ) => {
      if (!columnsRows[depth]) {
        columnsRows.push([]);
      }
      columnDefs.forEach((columnDef) => {
        if (columnDef.hidden) {
          return;
        }
        const newColumn: Column<Data> = {
          id: getColumnId(id ?? "", columnDef.id, parent),
          def: columnDef,
          parent,
        };
        if (columnDef.type == "group" && columnDef.children) {
          columnsRows[depth].push({ ...newColumn, colSpan: columnDef.children.length });
          setParams(columnDef.children, parent.concat(columnDef), depth + 1);
        } else if (columnDef.type == "node") {
          columnsRows[depth].push(newColumn);
          flatColumns.push(newColumn);
        }
      });
    };
    setParams(columnDefs);
    return {
      columnsRows,
      flatColumns,
      existFoot: flatColumns?.filter((c) => !!c.def.foot).length !== 0,
    };
  }, [columnDefs, id]);
  const tableTotalWidth: number | undefined = useMemo(() => {
    if (calcTableTotalWidth) {
      return flatColumns.reduce((sum, c) => {
        return sum + (c.def.width ?? 0);
      }, 0);
    } else {
      return undefined;
    }
  }, [flatColumns, calcTableTotalWidth]);
  useImperativeHandle(
    handlerRef,
    () => {
      return {
        getList,
        activeCell,
        setActiveCell,
        scrollByRowId,
      };
    },
    [activeCell, getList, scrollByRowId],
  );
  useEffect(() => {
    const keyboadHandler = (ev: KeyboardEvent) => {
      if (activeCell) {
        const { rowId, columnId, editable, editing, column } = activeCell;
        const navigateCell = (rowId: string, nextColumn: Column<Data>) => {
          const cellId = getCellId(id, rowId, nextColumn);
          const elm = document.getElementById(cellId);
          if (elm) {
            elm.focus();
          }
        };
        const addY = (addRowIndex: number = 0) => {
          const currentIndex = initList?.findIndex((data) => rowDef.rowId(data) == rowId) ?? -1;
          const nextRowId = initList?.map(rowDef.rowId)[currentIndex + addRowIndex] ?? rowId;
          navigateCell(nextRowId, column);
        };
        const addX = (addColumnIndex: number = 0) => {
          const currentIndex = flatColumns.findIndex((c) => c.id == columnId);
          const nextColumn = flatColumns[currentIndex + addColumnIndex] ?? null;
          if (nextColumn) {
            navigateCell(rowId, nextColumn);
          }
        };
        const toggleEditing = () => {
          if (editable) {
            setActiveCell({
              ...activeCell,
              editing: !editing,
            });
          }
        };
        if (ev.key === "Enter") {
          if (!column.def.suppressEnter) {
            toggleEditing();
          }
        } else if (ev.key == "Tab") {
          // ev.preventDefault();
          // toggleEditing();
        } else if (!activeCell.editing) {
          if (ev.key == "ArrowDown") {
            addY(1);
          } else if (ev.key == "ArrowUp") {
            addY(-1);
          } else if (ev.key == "ArrowRight") {
            addX(1);
          } else if (ev.key == "ArrowLeft") {
            addX(-1);
          } else {
            toggleEditing();
          }
        }
      }
    };
    document.addEventListener("keydown", keyboadHandler);
    return () => {
      document.removeEventListener("keydown", keyboadHandler);
    };
  }, [activeCell, flatColumns, initList, rowDef, id]);
  useEffect(() => {
    const tableBody = tableBodyRef.current;
    if (!tableBody) return;
    const clickHandler = (ev: MouseEvent) => {
      if (activeCell && !tableBody.contains(ev.target as Node)) {
        setActiveCell(undefined);
      }
    };
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, [activeCell, tableBodyRef]);
  useEffect(() => {
    if (activeCell?.editing) {
      const cellActionId = getCellId(id, activeCell.rowId, activeCell.column, true);
      const elm = document.getElementById(cellActionId) as
        | HTMLInputElement
        | HTMLButtonElement
        | HTMLTextAreaElement
        | null;
      if (elm) {
        elm.focus();
        if (elm.type == "text" || elm.type == "textarea") {
          // テキスト入力用
          const end = elm.value.length;
          elm.setSelectionRange(end, end); // 最後部にカーソル
        }
        return () => {
          elm.blur();
        };
      }
    }
  }, [activeCell, id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-52">
        <UILoading />
      </div>
    );
  }
  return (
    <table
      className={cn(
        "border border-gray-300 border-separate border-spacing-0",
        className ?? "break-all whitespace-break-spaces",
      )}
      style={{ ...style, width: (tableTotalWidth && tableTotalWidth + "px") ?? style?.width }}
    >
      <thead className="sticky top-0 bg-white z-[1]">
        {headerContent && (
          <tr>
            <th colSpan={flatColumns.length} className="">
              {headerContent}
            </th>
          </tr>
        )}
        {columnsRows.map((columns, depth) => {
          return (
            <tr key={depth} className="bg-inherit">
              {columns.map((column, columnIndex) => {
                const name = column.def.name ?? "";
                const isGroup = column.def.type == "group";
                const r = column.def.head
                  ? column.def.head({
                      name,
                      isGroup,
                    })
                  : undefined;
                return (
                  <th
                    key={columnIndex}
                    id={column.id}
                    style={{ ...r?.style, width: column.def.width ? column.def.width + "px" : undefined }}
                    className={cn(r?.className ?? "", "border text-start")}
                    rowSpan={isGroup ? 1 : columnsRows.length - depth}
                    colSpan={column.colSpan}
                  >
                    {r?.element ?? name}
                  </th>
                );
              })}
            </tr>
          );
        })}
      </thead>
      <tbody ref={tableBodyRef} className="bg-white">
        {initList?.map((initData, rowIndex) => {
          const rowId = rowDef.rowId(initData);
          const selected = selectedRowIds?.indexOf(rowId) == -1;
          return (
            <Row
              dataGridId={id}
              key={rowIndex}
              initData={initData}
              rowId={rowId}
              rowIndex={rowIndex}
              flatColumns={flatColumns}
              rowDef={rowDef}
              activeCell={activeCell}
              setActiveCell={setActiveCell}
              handlerRef={rowHandlerRefs.current[rowIndex]}
              selected={selected}
              selectToggle={() => {
                if (!setSelectedRowIds || !selectedRowIds) return;
                if (selected) {
                  setSelectedRowIds(selectedRowIds.filter((id) => id !== rowId));
                } else {
                  setSelectedRowIds(selectedRowIds.concat(rowId));
                }
              }}
              onChange={(data) => {
                if (onRowDataChange) {
                  onRowDataChange({
                    rowId,
                    rowIndex,
                    data,
                    initData,
                  });
                }
              }}
            />
          );
        })}
        {initList?.length == 0 && emptyContent && (
          <tr>
            <td className="border" colSpan={flatColumns.length}>
              {emptyContent}
            </td>
          </tr>
        )}
      </tbody>
      {existFoot ? (
        <tfoot>
          {flatColumns.map((column, columnIndex) => {
            const r = column.def.foot && column.def.foot();
            if (!r) return <th key={columnIndex} id={column.id}></th>;
            return (
              <th key={columnIndex} id={column.id} style={{ ...r.style }} className={cn(r.className ?? "", "border")}>
                {r.element}
              </th>
            );
          })}
        </tfoot>
      ) : null}
    </table>
  );
};

export type UIDataGridCellInputType = "textarea" | HTMLInputTypeAttribute;

interface UIDataGridCellInputProps<Data> {
  type?: UIDataGridCellInputType;
  cellArg: UIDataGridColumnCellRenderArg<Data>;
  toDataHandler: (prevData: Data, newValue: string) => Data;
  toFormatHandler?: (arg: UIDataGridColumnCellRenderArg<Data>) => ReactNode;
  className?: string;
}

export function UIDataGridCellInput<Data>({
  type = "text",
  cellArg,
  toDataHandler,
  toFormatHandler,
  className = "outline-none",
}: UIDataGridCellInputProps<Data>): ReactNode {
  const { editing, value, data, setData } = cellArg;
  if (!editing) {
    if (toFormatHandler) return toFormatHandler(cellArg);
    return value;
  }
  if (type == "textarea") {
    return (
      <>
        <textarea
          id={cellArg.cellActionId}
          className={cn(className)}
          value={value}
          onChange={(ev) => {
            const newValue = ev.target.value;
            setData(() => toDataHandler(data, newValue));
          }}
          onKeyDown={(ev) => {
            if (ev.key == "Enter") {
              ev.stopPropagation();
            }
          }}
        />
      </>
    );
  }
  return (
    <>
      <input
        id={cellArg.cellActionId}
        type={type}
        value={value}
        className={cn(className)}
        onChange={(ev) => {
          const newValue = ev.target.value;
          setData(() => toDataHandler(data, newValue));
        }}
      />
    </>
  );
}

export interface UIDataGridAreaProps {
  id?: string;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  style?: CSSProperties;
  contentStyle?: CSSProperties;
  children?: ReactNode;
}

export const UIDataGridArea: FC<UIDataGridAreaProps> = ({
  id: outerId,
  header,
  footer,
  className,
  style,
  contentStyle,
  children,
}) => {
  const id = useMemo(() => outerId ?? crypto.randomUUID(), [outerId]);
  const area = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);
  useEffect(() => {
    const updateSize = () => setWidth(area.current?.clientWidth);
    window.addEventListener("resize", updateSize); // 画面のサイズが変わった時のイベント
    window.addEventListener("orientationchange", updateSize); // スマホの画面を変えた時のイベント
  }, [area]);
  return (
    <>
      <div ref={area} className="w-full" />
      <div id={id} className={cn(className ?? "")} style={{ ...style }}>
        <div className="w-full border-t border-x border-gray-500">{header}</div>
        <div
          className="overflow-auto border border-gray-500"
          style={{ maxWidth: width && width + "px", ...contentStyle }}
        >
          {children}
        </div>
        {footer && <div className="w-full border-b border-x border-gray-500">{footer}</div>}
      </div>
    </>
  );
};
