export type RenderRuleType = "number" | "string";
export type RenderRuleValueKind = "value" | "column" | "fkColumn" | "renderColumn" | "group";
export type RenderRuleStringOperator = "+";
export type RenderRuleNumberOperator = "+" | "-" | "*" | "/";
export type RenderRuleValue<value, item, leastItem extends item = item> =
  | {
      kind: "value";
      value: value;
    }
  | {
      kind: "column";
      columnId: string;
    }
  | {
      kind: "fkColumn";
      fkColumnId: string;
      targetFkColumnId: string;
    }
  | {
      kind: "renderColumn";
      renderColumnId: string;
    }
  | {
      kind: "group";
      firstItem: item;
      leastItems: leastItem[];
    };

export type RenderRuleObject = RenderRuleStringObject | RenderRuleNumberObject;

export type RenderRuleStringObject = {
  type: "string";
} & RenderRuleValue<string, RenderRuleObjectStringItem>;

export type RenderRuleNumberObject = {
  type: "number";
} & RenderRuleValue<
  number,
  RenderRuleObjectNumberItem,
  RenderRuleObjectNumberItem & {
    operator: RenderRuleNumberOperator;
  }
>;

export type RenderRuleObjectNumberItem = {
  obj: RenderRuleNumberObject;
};

export type RenderRuleObjectStringItem = {
  obj: RenderRuleObject;
};
