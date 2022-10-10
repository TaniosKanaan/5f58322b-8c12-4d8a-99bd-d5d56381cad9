import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private httpClient: HttpClient) { }


  public getEvents():Observable<Event[]> {
    return this.httpClient.get<Event[]>('https://tlv-events-app.herokuapp.com/events/uk/london');
  }
}
