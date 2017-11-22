import { browser, element, by } from 'protractor';

export class BubblePage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.scss('app-root h1')).getText();
  }
}
