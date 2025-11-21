/** Unit tests for frontend components 
 * It check if the components render correct elements on the screen
 * 
 */

describe('cypress demo', () => {
  it('renders logo on the screen', () => {
    cy.visit('http://localhost:3000/dashboard')
    
    // check if the logo is present and check if the text is correct
    cy.get('[data-testid="cypress-logo"]')
    .should('exist')
    .should('have.text', 'ClosIT')
  })

  it('renders navbar on the screen', () => {
    cy.visit('http://localhost:3000/dashboard')

    // check if the dashboard link is present and check its text is correct
    cy.get('[data-testid="cypress-nav-dashboard-link"]')
    .should('exist')
    .should('have.text', 'Dashboard')

    // check if the manage closet link is present and check its text is correct
    cy.get('[data-testid="cypress-nav-closet-link"]')
    .should('exist')
    .should('have.text', 'Manage Closet')
  })

  it('renders current weather on the screen', () => {
    cy.visit('http://localhost:3000/dashboard')

    // check if the datetime is present
    cy.get('[data-testid="cypress-currentweather-datetime"]')
    .should('exist')

    // check if the location is present
    cy.get('[data-testid="cypress-currentweather-location"]')
    .should('exist')

    // check if the temperature is present
    cy.get('[data-testid="cypress-currentweather-temp"]')
    .should('exist')
  })
}) 

// Test 

// Make request to Gemini API with cold weather and check if it suggests warm clothes


// Make request to Gemini API with hot weather and check if it suggests light clothes