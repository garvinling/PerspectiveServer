'use strict';

describe('Photofavorites E2E Tests:', function () {
  describe('Test Photofavorites page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/photofavorites');
      expect(element.all(by.repeater('photofavorite in photofavorites')).count()).toEqual(0);
    });
  });
});
