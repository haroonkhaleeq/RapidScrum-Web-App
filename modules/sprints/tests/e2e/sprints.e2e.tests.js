'use strict';

describe('Sprints E2E Tests:', function () {
  describe('Test sprints page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sprints');
      expect(element.all(by.repeater('sprint in sprints')).count()).toEqual(0);
    });
  });
});
