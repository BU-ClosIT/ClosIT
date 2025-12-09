describe('My First Test', () => {
  // it('Visits the Closet page', () => {
  //   cy.visit('http://localhost:3000/dashboard')
  //   cy.wait(2000)
  //   // Go to Closet page
  //   cy.contains('Manage Closet').click()
  //   // it should be on a new URL which includes '/closet'
  //   cy.url().should('include', '/closet')
  //   // wait for 2 seconds
  //   cy.wait(2000)

  //   // Go to the search bar and type 'hoodie'
  //   cy.get('.searchbar').type('hoodie')
  //   cy.wait(2000)
  //   cy.contains('Pullover Hoodie').should('be.visible').click()

  //   // Edit the Hoodie item

  // })


  it('Adds new Item from the gallery', () => {
    cy.visit('http://localhost:3000/dashboard')
    cy.wait(2000)
    // Go to Closet page
    cy.contains('Manage Closet').click()
    // it should be on a new URL which includes '/closet'
    cy.url().should('include', '/closet')
    // wait for 2 seconds
    cy.wait(2000)
    cy.contains('+').click()

    // should contain 'Import from Gallery' button
    cy.contains('Import from Gallery').should('be.visible').click()
    cy.wait(2000)
    
    cy.get('.image-input-field').should('be.visible').selectFile('cypress/woolen_coat.jpg', { force: true })

    cy.wait(2000)

    cy.get('.upload-btn').should('be.visible').click()
  })
})