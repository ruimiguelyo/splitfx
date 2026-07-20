/// <reference types="@testing-library/cypress" />

describe('Rui Sá frontend portfolio', () => {
  it('takes a recruiter from the story to the working SplitFX product', () => {
    cy.visit('/');
    cy.findByTestId('portfolio').should('be.visible');
    cy.contains('h1', 'Complex logic.').should('be.visible');
    cy.contains('button', 'Explore the live product').click();

    cy.location('hash').should('equal', '#/splitfx');
    cy.findByTestId('splitfx-lab').should('be.visible');
    cy.contains('h1', 'Make the split obvious.').should('be.visible');
    cy.contains('Demo rate current').should('be.visible');
    cy.contains('Settlement plan').should('be.visible');
  });

  it('adds a mixed-currency expense and recalculates the ledger', () => {
    cy.visit('/#/splitfx');
    cy.contains('button', 'Add expense').click();
    cy.findByRole('dialog', { name: /what did you pay for/i }).within(() => {
      cy.findByLabelText('Description').type('Rooftop dinner');
      cy.findByLabelText('Amount').type('42.50');
      cy.findByLabelText('Currency').select('GBP');
      cy.findByLabelText('Paid by').select('maya');
      cy.contains('button', 'Add expense').click();
    });

    cy.contains('h1', 'One source of truth.').should('be.visible');
    cy.contains('Rooftop dinner').should('be.visible');
    cy.contains('£42.50').should('be.visible');
    cy.contains('5 expenses').should('be.visible');
  });

  it('keeps the last calculation understandable through quote failure states', () => {
    cy.visit('/#/splitfx');
    cy.contains('button', 'Expire rate').click();
    cy.contains('Quote expired').should('be.visible');
    cy.contains('Settlement plan').should('be.visible');

    cy.contains('button', 'Go offline').click();
    cy.contains('You are offline').should('be.visible');
    cy.contains('button', 'Reconnect').click();
    cy.contains('Quote expired').should('be.visible');
    cy.contains('button', 'Refresh quote').click();
    cy.contains('Demo rate current', { timeout: 3000 }).should('be.visible');
  });

  it('keeps the core journey usable on a narrow mobile viewport', () => {
    cy.viewport(390, 844);
    cy.visit('/');
    cy.contains('h1', 'Complex logic.').should('be.visible');
    cy.document().then((document) => {
      cy.wrap(document.documentElement.scrollWidth).should('be.lte', 390);
    });
    cy.contains('button', 'Explore the live product').click();
    cy.contains('h1', 'Make the split obvious.').should('be.visible');
    cy.contains('button', 'Add expense').should('be.visible');
  });
});
