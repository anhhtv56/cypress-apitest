
describe('Test with backend', () => {
  const apiUrl = Cypress.env("apiUrl")
  beforeEach('login to application', ()=>{
    cy.intercept({method: 'Get', path: 'tags'}, {fixture: 'tags.json'})
    cy.loginToApplication()
  })

  it('verify correct request and response', () => {
    cy.intercept('POST', apiUrl+'/api/articles/').as('postCreateArticle')

    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type('This is the article')
    cy.get('[formcontrolname="description"]').type('This is a description')
    cy.get('[formcontrolname="body"]').type('this is a body of the article')
    cy.contains('Publish Article').click()

    cy.wait('@postCreateArticle').then(xhr => {
      console.log(xhr)
      expect(xhr.response.statusCode).to.equal(201)
      expect(xhr.request.body.article.body).to.equal('this is a body of the article')
      expect(xhr.request.body.article.description).to.equal('This is a description')
    })
  })

  it('intercepting and modifying the request and response', () => {
    // cy.intercept('POST', '**/articles/', (req)=>{
    //   req.body.article.description = "This is a description 2"
    // }).as('postCreateArticle')

    cy.intercept('POST', '**/articles/', (req)=>{
      expect(req.body.article.description).to.equal('This is a description')
      req.body.article.description = "This is a description 2"
      
    }).as('postCreateArticle')

    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type('This is the article 2')
    cy.get('[formcontrolname="description"]').type('This is a description')
    cy.get('[formcontrolname="body"]').type('this is a body of the article')
    cy.contains('Publish Article').click()

    cy.wait('@postCreateArticle').then(xhr => {
      console.log(xhr)
      expect(xhr.response.statusCode).to.equal(201)
      expect(xhr.request.body.article.body).to.equal('this is a body of the article')
      expect(xhr.request.body.article.description).to.equal('This is a description 2')
    })
  })

  it('verify popular tags are display', {retries: 2}, ()=>{
    cy.fixture('tags').then((tagList)  => {
      tagList.tags.forEach( (tagElement) => cy.get('.tag-list').should('contain', tagElement)
      )
    })
  })

  it('verify global feed like count', ()=>{
    cy.intercept('GET', apiUrl+'/api/feed*', {"articles":[],"articlesCount":0})
    cy.intercept('GET', apiUrl+'/api/articles*', {fixture: 'articles.json'})
    cy.contains('Global Feed').click()
    cy.get('app-article-list button').then(heartList => {
      expect(heartList[0]).to.contain('1')
      expect(heartList[1]).to.contain('5')
    })
  })

  it('delete a new article', () => {

    const bodyRequest = {
      "article": {
          "title": "Request from API",
          "description": "API testing is easy",
          "body": "hahahhah",
          "tagList": []
      }
  }
    cy.get('@token').then(token => {
      cy.request({
        method: 'POST',
        url: apiUrl+'/api/articles/',
        headers: {'Authorization': 'Token ' + token},
        body: bodyRequest
      }).then(response => {
        expect(response.status).to.equal(201)
      })

      cy.contains('Global Feed').click()
      cy.intercept(apiUrl+'/api/articles?limit=10&offset=0').as('getShortenedUrl');
      cy.wait('@getShortenedUrl');
      cy.get('.article-preview').first().click()
      cy.get('.article-actions').contains('Delete Article').click()

      cy.request({
        url: apiUrl+'/api/articles?limit=10&offset=0',
        headers: {'Authorization': 'Token ' + token},
        method: 'GET'
      }).its('body').then(body => {
        expect(body.articles[0].title).not.to.equal('Request from API')
      })

    })
  })
})