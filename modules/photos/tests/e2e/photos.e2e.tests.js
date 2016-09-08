'use strict';

describe('Photos E2E Tests:', function () {
  describe('Test Photos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/photos');
      expect(element.all(by.repeater('photo in photos')).count()).toEqual(0);
    });
  });
});
