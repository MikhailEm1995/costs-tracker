export class DateStruct {
  day: number;
  month: number;
  year: number;
}

export class CategoryStruct {
  income_categories: string[];
  cost_categories: string[];
}

export class TrackDataStruct {
  type: string;
  number: number;
  category: string;
  date: DateStruct = new DateStruct();
}
