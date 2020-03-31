import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatterService {

  constructor() { }

  private defaultDateSeparator: string = '.';
  private defaultNumberSeparator: string = ' ';
  private defaultDecimalSeparator: string = ',';

  private addZeroesToStringToMatchLength(s: string, minimalLength: number, end: boolean = false): string {
    const validatedString: string = s || '';
    if (minimalLength <= 0 || validatedString.length >= minimalLength) {
      return validatedString;
    }
    const numberOfCharacterMissing: number = minimalLength - validatedString.length;
    const zeroesString: string = new Array(numberOfCharacterMissing).fill(0).join('');
    return end ? `${validatedString}${zeroesString}` : `${zeroesString}${validatedString}`;
  }

  getRoundedNumberString(n: number, precision = 0): string {
    if (isNaN(n)) {
      return 'N/A';
    }
    
    const roundedNumber: number = Math.round(n * (10 ** precision)) / (10 ** precision);
    const beforeDecimal: string = roundedNumber.toString().split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.defaultNumberSeparator);
    const afterDecimal: string = roundedNumber.toString().split('.')[1] || '';
    const updatedAfterDecimal: string = this.addZeroesToStringToMatchLength(afterDecimal, precision);
    console.log(n, roundedNumber, beforeDecimal, afterDecimal, updatedAfterDecimal);
    return `${beforeDecimal}${updatedAfterDecimal ? this.defaultDecimalSeparator + updatedAfterDecimal : ''}`;
  }

  getPercentageString(n: number): string {
    if (isNaN(n)) {
      return 'N/A';
    }
    return Math.round(100 * n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.defaultNumberSeparator) + '%';
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
