export function cn(...classNames: (string | undefined | null)[]) {
  return classNames.filter((c) => !!c).join(" ");
}
