import { OptionItem } from "@/common/type/option-item.type";
import {
  RenderRuleType,
  RenderRuleNumberOperator,
  RenderRuleStringOperator,
  RenderRuleValueKind,
} from "../types/render-rule.type";

export const renderRuleTypes: OptionItem<RenderRuleType>[] = [
  {
    value: "number",
    label: "数値",
  },
  {
    value: "string",
    label: "文字列",
  },
];
export const renderRuleValueKinds: OptionItem<RenderRuleValueKind>[] = [
  {
    value: "value",
    label: "値",
  },
  {
    value: "column",
    label: "列(値)",
    disabled: true,
  },
  {
    value: "fkColumn",
    label: "列(FK)",
    disabled: true,
  },
  {
    value: "renderColumn",
    label: "列(表示)",
    disabled: true,
  },
  {
    value: "group",
    label: "グループ",
    disabled: true,
  },
];
export const renderRuleStringOperators: RenderRuleStringOperator[] = ["+"];
export const renderRuleNumberOperators: RenderRuleNumberOperator[] = ["+", "-", "*", "/"];
