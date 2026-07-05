import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split',
})
export class SplitPipe implements PipeTransform {
  transform(value: string, limit: number): string {
    return value.split(' ', limit).join(' ');
  }
}
