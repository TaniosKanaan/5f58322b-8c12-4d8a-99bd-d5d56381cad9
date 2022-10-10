import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { State, Store } from '@ngrx/store';
import { Dictionary, groupBy } from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Event } from './../../models/event';
import { EventService } from './../../services/event.service';
import { addItemToBasket, removeItemFromBasket } from './../../store/app.actions';
import { AppState } from './../../store/app.reducer';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.sass']
})
export class EventsComponent implements OnInit {

  events: Event[];
  filteredEvents: Event[];
  $basket: Observable<Event[]>;
  search = new FormControl('');
  groupedEvents: Dictionary<Event[]>;
  sortedKeys: string[] = [];


  constructor(private eventService: EventService, private store: Store<AppState>, private state: State<AppState>) {
  }

  ngOnInit(): void {
    this.$basket = this.store.select(state => state.basket)
    this.$basket.subscribe(console.log);
    this.eventService.getEvents().subscribe(e => {
      this.events = this.filteredEvents = e;
      this.setGroupedEvents();
    });
    this.search.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(1000),
      map(value => value.toLowerCase())
    ).subscribe(value => this.filterEvents(value))
  }

  getArtists(event: Event) {
    return event.artists ? event.artists.map(artist => artist.name).join(', ') : '';
  }

  isDate(input: string): boolean {
    return moment(input).isValid() && moment(input).year() !== 9999;
  }

  setGroupedEvents() {
    this.groupedEvents = groupBy(this.filteredEvents.map(e => {
      if (!e.startTime) {
        e.startTime = new Date();
        e.startTime.setFullYear(9999);
      }
      return e;
    }), (e => {
      const date = new Date(e.startTime);
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      return date;
    }));
    this.sortedKeys = Object.keys(this.groupedEvents).sort((k1, k2) => new Date(k1).getTime() - new Date(k2).getTime());
  }
  navigateTo(url: string) {
    window.open(url, "blank");
  }

  addEvent(event: Event) {
    this.store.dispatch(addItemToBasket(event));
    this.filterEvents(this.search.value);
  }

  removeEvent(event: Event) {
    this.store.dispatch(removeItemFromBasket(event));
    this.filterEvents(this.search.value);
  }

  filterEvents(search: string = '') {
    const ids = (this.getBasketEvent()).map((e: Event) => e._id);
    this.filteredEvents = this.events.filter(event =>
      (!search || event.title.toLowerCase().includes(search)) &&
      !ids.includes(event._id)
    )
    this.setGroupedEvents();
  }

  getBasketEvent(): Event[] {
    return this.state.getValue().app.basket || [];
  }
}

