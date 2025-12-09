describe('My First Test', () => {
  it('Visits the Closet page', () => {
    cy.visit('http://localhost:3000/dashboard')
    cy.wait(12000)
    
    cy.contains('Try Again').should('be.visible').click()
    cy.wait(12000)
    
  })


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
    // upload an image
    cy.get('.image-input-field').should('be.visible').selectFile('cypress/woolen_coat.jpg', { force: true })

    cy.wait(2000)
    // hit the upload button
    cy.get('.upload-btn').should('be.visible').click()
    cy.wait(7000)
  })

  it('Edits an Item in the Closet', () =>{
    cy.visit('http://localhost:3000/dashboard')
        cy.wait(1500)
        // Go to Closet page
        cy.contains('Manage Closet').click()
        // it should be on a new URL which includes '/closet'
        cy.url().should('include', '/closet')
        cy.wait(1500)
        // hit the search bar and type 'wool'
        cy.get('.searchbar').type('wool')
        cy.wait(1000)
        // click on the item
        cy.contains(/.*wool.*/i).click()
        cy.wait(1000)
        // hit edit
        cy.get('.edit-save-btn').click()
        cy.wait(1000)
        // select size M from the size dropdown
        cy.get('#size').should('be.visible').select('Medium')
        cy.wait(1000)
        // put brand name as 'Tommy Hilfiger'
        cy.get('#brand').should('be.visible').clear().type('Tommy Hilfiger')
        cy.wait(1000)
        // select season as 'Winter'
        cy.contains('Winter').click()
        cy.wait(1000)
        // hit save
        cy.get('.edit-save-btn').click()
        cy.wait(2000)

        // cross-verify
        cy.get('.searchbar').clear().type('wool')
        cy.wait(3000)
  })

  it('Deletes an Item in the Closet', () =>{
    cy.visit('http://localhost:3000/dashboard')
    cy.wait(1500)
    // Go to Closet page
    cy.contains('Manage Closet').click()
    // it should be on a new URL which includes '/closet'
    cy.url().should('include', '/closet')
    cy.wait(1500)
    // hit the search bar and type 'wool'
    cy.get('.searchbar').type('wool')
    cy.wait(1000)
    // click on the item
    cy.contains(/.*wool.*/i).click()
    cy.wait(1000)
    // hit edit
    cy.contains('Edit').click()
    cy.wait(1000)
    // hit delete
    cy.contains('Delete').click()


    // cross-verify
    cy.get('.searchbar').clear().type('wool')
    cy.wait(3000)
    
  })

  it('Chats with AI', ()=>{
    cy.visit('http://localhost:3000/dashboard')
    cy.wait(1000)

    cy.contains('AI Chat').click()
    cy.wait(1000)

    cy.get('#ai-input').type('Suggest me outfit for cold temp weather with -10°C')
    cy.wait(500)
    cy.contains('Send').click()
    cy.wait(12000)

    cy.get('#ai-input').type('Now suggest me outfit for temp weather with 45°C')
    cy.wait(500)
    cy.contains('Send').click()
    cy.wait(10000)
  })
})