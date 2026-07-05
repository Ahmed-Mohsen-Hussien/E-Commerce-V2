import { Pipe, PipeTransform } from '@angular/core';
import { ProductsData } from '../../core/models/products/products-data.interface';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(prodcuts: ProductsData[], word: string): ProductsData[] {
    return prodcuts.filter((item) => item.title.toLocaleLowerCase().includes(word.toLowerCase()));
  }
}
