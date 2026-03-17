describe('Playlists Page', () => {

  const testPlaylistName = `Cypress Playlist ${Date.now()}`;

  beforeEach(() => {
    cy.loginAsUser();
    cy.visit('/playlists');
  });

  it('should display the playlists page', () => {
    cy.contains('My Playlists', { timeout: 6000 }).should('be.visible');
  });

  it('should create a new playlist', () => {
    cy.get('input[placeholder*="playlist name"]', { timeout: 6000 }).type(testPlaylistName);
    cy.get('button').contains('Create Playlist').click();
    cy.contains(testPlaylistName, { timeout: 5000 }).should('be.visible');
  });

  it('should not create a playlist with empty name', () => {
    cy.get('input[placeholder*="playlist name"]').should('have.value', '');
    cy.get('button').contains('Create Playlist').click();
    cy.url().should('include', '/playlists');
  });

  it('should navigate into a playlist on click', () => {
    cy.get('input[placeholder*="playlist name"]').type(testPlaylistName);
    cy.get('button').contains('Create Playlist').click();
    cy.contains(testPlaylistName, { timeout: 5000 }).click();
    cy.url({ timeout: 5000 }).should('include', '/playlists/');
  });

  it('should rename a playlist using the pencil button', () => {
    const renamed = `${testPlaylistName} Renamed`;

    cy.get('input[placeholder*="playlist name"]').type(testPlaylistName);
    cy.get('button').contains('Create Playlist').click();
    cy.contains(testPlaylistName, { timeout: 5000 }).should('be.visible');

    cy.contains('h4', testPlaylistName)
      .closest('.col-md-4')
      .find('button[title="Rename playlist"]')
      .click();

    cy.get('.modal input[type="text"]', { timeout: 3000 }).clear().type(renamed);
    cy.get('.modal button').contains('Save').click();

    cy.contains(renamed, { timeout: 5000 }).should('be.visible');
  });

  it('should delete a playlist using the delete button', () => {
    const toDelete = `Delete Me ${Date.now()}`;

    cy.get('input[placeholder*="playlist name"]').type(toDelete);
    cy.get('button').contains('Create Playlist').click();
    cy.contains(toDelete, { timeout: 5000 }).should('be.visible');

    cy.contains('h4', toDelete)
      .closest('.col-md-4')
      .find('button[title="Delete playlist"]')
      .click();

    cy.get('.modal button').contains('Delete').click();

    cy.contains(toDelete, { timeout: 5000 }).should('not.exist');
  });

});