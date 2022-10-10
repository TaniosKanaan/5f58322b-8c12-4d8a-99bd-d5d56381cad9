import { Artist } from './artist';
import { Pick } from './pick';
import { Venue } from './venue';
export class Event {
  public _id: string;
  public title: string;
  public contentUrl: string;
  public attending: string;
  public flyerFront: string;
  public city: string;
  public country: string;
  public date: Date;
  public startTime: Date;
  public endTime: Date;
  public venue: Venue;
  public pick: Pick;
  public artists: Artist[];
  public private: boolean;
  public __v: number;
}
