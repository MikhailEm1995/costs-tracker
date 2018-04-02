export class DateStruct {
  day: number;
  month: number;
  year: number;
}

export class CategoryStruct {
  name: string;
  color: string;
}

export class TrackDataStruct {
  type: string;
  number: number;
  category: CategoryStruct;
  date: DateStruct;
}
