import user from '../fixtures/user.json';

describe('POST /api/users', () => {
  it('Successful request', () => {
    let authToken;
    //sends the login request and stores the received token
    cy.request({
      method: 'POST',
      url: '/api/users/login',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        "user": {
          "email": user.valid_user.email,
          "password": user.valid_user.password,
          "username": user.valid_user.username
        }
      }
    }).then((response) => {
      cy.log(response.body);
      expect(response.status).to.eq(200);
      expect(response.body.user.username).to.eq(user.valid_user.name);
      expect(response.body.user.email).to.eq(user.valid_user.email);
      expect(response.body.user.email).to.exist;
      expect(response.body.user.image).to.not.be.null;
      expect(response.body.user.token).to.exist;

      authToken = response.body.user.token;
      cy.log(authToken)
      cy.request({
        method: 'GET',
        url: '/api/user',
        failOnStatusCode: false, //it avoids breaking the test execution
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).then((response) => {
        cy.log(response.body);
        expect(response.status).to.eq(200);
        expect(response.body.user.username).to.eq(user.valid_user.name);
        expect(response.body.user.email).to.eq(user.valid_user.email);
        expect(response.body.user.email).to.exist;
        expect(response.body.user.image).to.not.be.null;
        expect(response.body.user.token).to.not.be.null;
      });
    });
    cy.request({
      method: 'PUT',
      url: '/api/users',
      failOnStatusCode: false,//it avoids breaking the test execution
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        "user": {
          "email": "updatedemail@mail.com",
          "username": "updatedusername"
        }
      }
    }).then((response) => {
      cy.log(response.body);
      expect(response.status).to.eq(200);
      expect(response.body.user.email).to.eq("updatedemail@mail.com");
      expect(response.body.user.username).to.eq("updatedusername");
    });
    const slug = "testt-178841"
    cy.request({
      method: 'DELETE',
      url: `/api/articles/${slug}`,
      failOnStatusCode: false,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then((response) => {
      cy.log(response.body);
      expect(response.status).to.eq(200);

    });
  });
});


