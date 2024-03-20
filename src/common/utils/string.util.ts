type strictValue = "\\" | "/" | ":" | "*" | "?" | '"' | ">" | "<" | "|";

const strictValues: strictValue[] = ["\\", "/", ":", "*", "?", '"', ">", "<", "|"];

export class StringUtil {
  static folderName(str: string): string {
    return strictValues.reduce((sum, v) => {
      return sum.replace(v, "");
    }, str);
  }
  static empty2null(str: string): string | null {
    if (str == "") {
      return null;
    } else {
      return str;
    }
  }
  static empty2undefined(str: string): string | undefined {
    if (str == "") {
      return undefined;
    } else {
      return str;
    }
  }
}
