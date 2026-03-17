describe('Login Page', () => {

  beforeEach(() => {
    cy.logout();
    cy.visit('/login');
  });

  it('should display the login form', () => {
    cy.contains('Music Library').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').contains('Sign In').should('be.visible');
  });

  it('should show validation errors when submitting empty form', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Email address is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('should show validation error for invalid email format', () => {
    cy.get('input[type="email"]').type('notanemail').blur();
    cy.contains('Enter a valid email address').should('be.visible');
  });

  it('should show validation error for short password', () => {
    cy.get('input[type="password"]').type('abc').blur();
    cy.contains('Password must be at least 6 characters').should('be.visible');
  });

  it('should show error message for wrong credentials', () => {
    cy.get('input[type="email"]').type('wrong@music.com');
    cy.get('input[type="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();
    cy.get('.mb-3.p-3.rounded-2', { timeout: 5000 }).should('be.visible');
  });

  it('should redirect to /songs after successful user login', () => {
    cy.get('input[type="email"]').type(Cypress.env('USER_EMAIL') || 'testuser@music.com');
    cy.get('input[type="password"]').type(Cypress.env('USER_PASSWORD') || 'test123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 6000 }).should('include', '/songs');
  });

  it('should have a link to the register page', () => {
    cy.contains('Create an account').click();
    cy.url().should('include', '/register');
  });

});