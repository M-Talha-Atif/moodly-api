export enum TimeFilterEnum {
  TODAY = 'today',
  TOMORROW = 'tomorrow',
  WEEKEND = 'weekend',
  THIS_WEEK = 'this_week',
  NEXT_WEEK = 'next_week',
  THIS_MONTH = 'this_month',
  NEXT_MONTH = 'next_month',
  UPCOMING = 'upcoming',
  PAST = 'past',
}

export type TimeFilterKey = keyof typeof TimeFilterEnum;
