import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';

interface TimeDate {
  dayName: string;
  dayNumber: number;
  month: string;
  hours: number;
  minutes: string;
  seconds: string;
  amOrPm: string;
}

@Component({
    selector: 'app-clock',
    templateUrl: './clock.component.html',
    styleUrls: ['./clock.component.scss'],
    standalone: false
})
export class ClockComponent implements OnInit, OnDestroy {
  timeDate: TimeDate = {
    dayName: '',
    dayNumber: 0,
    month: '',
    hours: 0,
    minutes: '00',
    seconds: '00',
    amOrPm: 'AM',
  };
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.startTimeUpdate();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private startTimeUpdate(): void {
    const timeSub = interval(1000).subscribe(() => {
      const date = new Date();
      this.updateTimeDate(date);
    });
    this.subscriptions.push(timeSub);
  }

  private updateTimeDate(date: Date): void {
    this.timeDate = {
      dayName: date.toLocaleString('default', { weekday: 'long' }),
      dayNumber: date.getDate(),
      month: date.toLocaleString('default', { month: 'long' }),
      hours: date.getHours() > 12 ? date.getHours() - 12 : date.getHours(),
      minutes: this.padNumber(date.getMinutes()),
      seconds: this.padNumber(date.getSeconds()),
      amOrPm: date.getHours() >= 12 ? 'PM' : 'AM',
    };
  }

  private padNumber(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }
}
