Cypress.Commands.add('loginAsUser', () => {
  cy.request('POST', 'http://localhost:5000/api/auth/login', {
    email:    Cypress.env('USER_EMAIL')    || 'testuser@music.com',
    password: Cypress.env('USER_PASSWORD') || 'test123',
  }).then((res) => {
    localStorage.setItem('token', res.body.token);
    localStorage.setItem('role',  res.body.user.role);

    cy.intercept('GET', '**/api/auth/profile', {
      statusCode: 200,
      body: {
        _id:   'cypress-user',
        name:  'Cypress User',
        email: res.body.user.email || Cypress.env('USER_EMAIL') || 'testuser@music.com',
        role:  res.body.user.role,
      },
    }).as('profileStub');
  });
});

Cypress.Commands.add('loginAsAdmin', () => {
  cy.request('POST', 'http://localhost:5000/api/auth/login', {
    email:    Cypress.env('ADMIN_EMAIL')    || 'admin@musiclibrary.com',
    password: Cypress.env('ADMIN_PASSWORD') || 'Admin@1234',
  }).then((res) => {
    localStorage.setItem('token', res.body.token);
    localStorage.setItem('role',  res.body.user.role);

    cy.intercept('GET', '**/api/auth/profile', {
      statusCode: 200,
      body: {
        _id:   'cypress-admin',
        name:  'Cypress Admin',
        email: res.body.user.email || Cypress.env('ADMIN_EMAIL') || 'admin@musiclibrary.com',
        role:  res.body.user.role,
      },
    }).as('profileStub');
  });
});

Cypress.Commands.add('logout', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
});
