/** Functional Tests 
 * It checks if the observed behavior is the same as the expected behavior of the endpoints/features
 * */ 

// Make request to Gemini API with cold weather and check if it suggests warm clothes
describe('gets correct outfit recommendation as per weather conditions', () => {
  it('should recommend outfit for cold weather', () => {
    cy.request({
      method: 'POST',
      url: 'https://getoutfitrecommendation-6p7lfy6g4a-uc.a.run.app',
      headers: {
        authorization: Cypress.env('CLOSET_AUTH_TOKEN')
      },
      body: {
            userId:"sampleUserId",
            userPreferences:"",
            context: "",
            currentWeather:{
                  temp: "23 F",                 // °F
                  feelslike: "10 F",            // °F (windchill)
            }

		}
    }).then((response) => {
        console.log(response.body);
        
      expect(response.status).to.eq(200);

      expect(response.body).to.exist;

      expect(response.body.outfit.length).to.be.at.least(4);
    });
  });


  // Make request to Gemini API with hot weather and check if it suggests light clothes
  it('should recommend outfit for hot weather', () => {
    cy.request({
      method: 'POST',
      url: 'https://getoutfitrecommendation-6p7lfy6g4a-uc.a.run.app',
      headers: {
        authorization: Cypress.env('CLOSET_AUTH_TOKEN')
      },
      body: {
            userId:"sampleUserId",
            userPreferences:"",
            context: "",
            currentWeather:{
                  temp: "102 F",                // °F
                  feelslike: "108 F"           // °F (heat index)                
            }
            
		}
    }).then((response) => {
      console.log(response.body);
        
      expect(response.status).to.eq(200);

      expect(response.body).to.exist;
      
      expect(response.body.outfit.length).to.be.lessThan(4);
    });
  });

});

