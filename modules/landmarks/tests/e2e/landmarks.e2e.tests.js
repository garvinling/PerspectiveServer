'use strict';

describe('Landmarks E2E Tests:', function () {
  describe('Test Landmarks page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/landmarks');
      expect(element.all(by.repeater('landmark in landmarks')).count()).toEqual(0);
    });
  });
});
