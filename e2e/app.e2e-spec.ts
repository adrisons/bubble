import { BubblePage } from './app.po';

describe('bubble App', () => {
  let page: BubblePage;

  beforeEach(() => {
    page = new BubblePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
