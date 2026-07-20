/// <reference types="@testing-library/cypress" />

import '@testing-library/cypress/add-commands';

beforeEach(() => {
  cy.window().then((window) => {
    window.sessionStorage.clear();
  });
});
