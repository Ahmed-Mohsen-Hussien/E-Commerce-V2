import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'onSale',
})
export class OnSalePipe implements PipeTransform {
  transform(value: string): string {
    return 'mr.' + value;
  }
}
