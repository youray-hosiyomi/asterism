export type Range<T> = {
  from: T;
  to: T;
};

export type DateRange = Range<Date | null>;
