describe('Register Page', () => {

  beforeEach(() => {
    cy.logout();
    cy.visit('/register');
  });

  it('should display the registration form', () => {
    cy.contains('Create Account').should('be.visible');
    cy.get('input[placeholder="Enter your full name"]').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="tel"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
  });

  it('should show all validation errors on empty submit', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Full name is required').should('be.visible');
    cy.contains('Email address is required').should('be.visible');
    cy.contains('Phone number is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('should validate email format', () => {
    cy.get('input[type="email"]').type('bademail').blur();
    cy.contains('Enter a valid email address').should('be.visible');
  });

  it('should validate phone format — rejects letters', () => {
    cy.get('input[type="tel"]').type('abcde').blur();
    cy.contains('Phone must be 10').should('be.visible');
  });

  it('should validate phone format — rejects fewer than 10 digits', () => {
    cy.get('input[type="tel"]').type('12345').blur();
    cy.contains('Phone must be 10').should('be.visible');
  });

  it('should validate password minimum length', () => {
    cy.get('input[type="password"]').type('abc').blur();
    cy.contains('Password must be at least 6 characters').should('be.visible');
  });

  it('should clear field error when user corrects input', () => {
    cy.get('input[type="email"]').type('bad').blur();
    cy.contains('Enter a valid email address').should('be.visible');
    cy.get('input[type="email"]').clear().type('good@email.com');
    cy.contains('Enter a valid email address').should('not.exist');
  });

  it('should have a link to the login page', () => {
    cy.contains('Sign in').click();
    cy.url().should('include', '/login');
  });

});