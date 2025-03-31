import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isNumber'
})
export class IsNumberPipe implements PipeTransform {

  transform(value: any, args?: any): boolean {
    return /\d/.test(value);
  }

}
