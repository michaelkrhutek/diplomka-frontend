import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatterService {

  constructor() { }

  defaultDateSeparator: string = '.';

  getRoundedNumberString(n: number): string {
    if (isNaN(n)) {
      return 'N/A';
    }
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  getPercentageString(n: number): string {
    if (isNaN(n)) {
      return 'N/A';
    }
    return Math.round(100 * n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '%';
  }

  getDayMonthYearString(date: Date, options?: { separator?: string, addZeroDigit?: boolean }): string {
    if (!date) {
      return 'N/A';
    }
    const d: number = date.getDate();
    const m: number = date.getMonth() + 1;
    const y: number = date.getFullYear();
    let separator: string = this.defaultDateSeparator;
    let addZeroDigit: boolean = true;
    if (options) {
      options.separator && (separator = options.separator);
      options.addZeroDigit = !!options.addZeroDigit; 
    }
    const dayOfTheMonth: string = addZeroDigit && d < 10 ? `0${d}` : d.toString();
    const month: string = addZeroDigit && m < 10 ? `0${m}` : m.toString();
    const year: string = y.toString();
    return `${dayOfTheMonth}${separator}${month}${separator}${year}`;
  }

  getDayMonthString(date: Date, options?: { separator?: string, addZeroDigit?: boolean }): string {
    if (!date) {
      return 'N/A';
    }
    const d: number = date.getDate();
    const m: number = date.getMonth() + 1;
    let separator: string = this.defaultDateSeparator;
    let addZeroDigit: boolean = true;
    if (options) {
      options.separator && (separator = options.separator);
      options.addZeroDigit = !!options.addZeroDigit; 
    }
    const dayOfTheMonth: string = addZeroDigit && d < 10 ? `0${d}` : d.toString();
    const month: string = addZeroDigit && m < 10 ? `0${m}` : m.toString();
    return `${dayOfTheMonth}${separator}${month}`;
  }

  getHoursMinutesString(date: Date): string {
    const h: number = date.getHours();
    const m: number = date.getMinutes();
    const hours: string = h < 10 ? `0${h}` : h.toString();
    const minutes: string = m < 10 ? `0${m}` : m.toString();
    return `${hours}:${minutes}`;
  }
}
