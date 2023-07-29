import { DatePipe } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DateTimeUtil {
  constructor(@Inject(LOCALE_ID) public locale: string) {}

  formatToUIDateTime(date: any): string {
    if(date == null){
      return null;
    }
    return new DatePipe(this.locale).transform(
      date,
      'yyyy-MM-ddTHH:mm:ss',
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
  }

  formatToServerDateTime(date: Date):Date {
    if(date == null){
      return null;
    }
    return new Date(
      (typeof date === 'string' ? new Date(date) : date).toLocaleString(
        this.locale,
        { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }
      )
    );
  }
}
