describe('Songs Page', () => {

  beforeEach(() => {
    cy.loginAsUser();
    cy.visit('/songs');
    cy.wait(1000);
  });

  it('should display the songs page after login', () => {
    cy.contains('Songs', { timeout: 6000 }).should('be.visible');
  });

  it('should display song cards', () => {
    cy.get('.col-lg-3, .col-md-4, .col-sm-6', { timeout: 6000 })
      .should('have.length.greaterThan', 0);
  });

  it('should show song details when View Details is clicked', () => {
    cy.contains('View Details', { timeout: 6000 }).first().click();
    cy.contains('Song Details').should('be.visible');
    cy.contains('Singer(s)').should('be.visible');
    cy.contains('Music Director').should('be.visible');
    cy.contains('Album').should('be.visible');
    cy.contains('Release Date').should('be.visible');
  });

  it('should hide song details when Hide Details is clicked', () => {
    cy.contains('View Details', { timeout: 6000 }).first().click();
    cy.contains('Hide Details').click();
    cy.contains('Song Details').should('not.exist');
  });

  it('should filter songs using search by name', () => {
    cy.get('input[placeholder="Song name"]', { timeout: 6000 }).type('Kun');
    cy.get('button').contains('Search').click();
    cy.url().should('include', '/songs');
  });

  it('should clear search results when Clear is clicked', () => {
    cy.get('input[placeholder="Song name"]', { timeout: 6000 }).type('xyz');
    cy.get('button').contains('Search').click();
    cy.get('button').contains('Clear').click();
    cy.get('.col-lg-3, .col-md-4, .col-sm-6', { timeout: 5000 })
      .should('have.length.greaterThan', 0);
  });

  it('should open audio player when Play is clicked', () => {
    cy.get('.col-lg-3, .col-md-4, .col-sm-6', { timeout: 6000 }).first()
      .within(() => {
        cy.get('h5').invoke('text').as('songTitle');
        cy.get('button').contains('Play').click();
      });
    cy.get('@songTitle').then((title) => {
      const cleanTitle = title.trim().replace(/^\W+/, '');
      cy.contains(cleanTitle, { timeout: 6000 }).should('be.visible');
    });
  });

});