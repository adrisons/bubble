import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], term): any {
    console.log('term', term);
    if ((term && items.length > 0)) {
      return term
        ? items.filter(item => item.title.indexOf(term) !== -1)
        : items;
    }
  }
}

@Pipe({
  name: 'user',
  pure: false
})
export class UserPipe implements PipeTransform {
  transform(items: any[], term): any {
    if (term && items.length > 0) {
      console.log('term', term);
      return items.filter(item => item.user.name.toLowerCase().indexOf(term.toLowerCase()) !== -1);
    } else { return items; }
  }
}

@Pipe({
  name: 'message',
  pure: false
})
export class MessagePipe implements PipeTransform {
  transform(items: any[], term): any {

    if (term && items.length > 0) {
      console.log('term', term);
      return items.filter(item => {
        if (item.text) { return item.text.toLowerCase().indexOf(term.toLowerCase()) !== -1; } else { return false; }
      });
    } else { return items; }
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
      ? items.filter(item => filters.includes(item.socialType.name))
      : items;
  }
}


import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeurl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
