import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], term): any {
    console.log('term', term);

    return term
      ? items.filter(item => item.title.indexOf(term) !== -1)
      : items;
  }
}

@Pipe({
  name: 'user',
  pure: false
})
export class UserPipe implements PipeTransform {
  transform(items: any[], term): any {
    console.log('term', term);

    return term
      ? items.filter(item => item.user.name.indexOf(term) !== -1)
      : items;
  }
}

@Pipe({
  name: 'message',
  pure: false
})
export class MessagePipe implements PipeTransform {
  transform(items: any[], term): any {
    console.log('term', term);

    return term
      ? items.filter(item => item.text.indexOf(term) !== -1)
      : items;
  }
}

@Pipe({
  name: 'social',
  pure: false
})
export class SocialPipe implements PipeTransform {
  transform(items: any[], term): any {
    const filters = [];
    for (const key in term) {
      if (term[key]) {
        filters.push(key);
      }
    }
    return term && filters.length
      ? items.filter(item => filters.includes(item.social.name))
      : items;
  }
}
