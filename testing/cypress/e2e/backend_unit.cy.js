/** Unit Tests for Backend API endpoints - index.ts file
 *  It checks if the firebase function return correct output for the given input 
 */

// check aiQuery endpoint
describe('POST /aiQuery', () => {
  it('should fetch response from AI/LLM', () => {
    cy.request({
      method: 'POST',
      url: 'https://aiquery-6p7lfy6g4a-uc.a.run.app',
      headers: {
        authorization: Cypress.env('CLOSET_AUTH_TOKEN')
      }
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.exist;
    });
  });
});

// check getWeatherByLocation endpoint
describe('GET /getWeatherByLocation', () => {
  it('should fetch weather conditions of current location', () => {
    cy.request({
      method: 'GET',
      url: 'https://getweatherbylocation-6p7lfy6g4a-uc.a.run.app',
      headers: {
        authorization: Cypress.env('CLOSET_AUTH_TOKEN')
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.exist;
    });
  });
});

// check getOutfitRecommendation endpoint
describe('POST /getOutfitRecommendation', () => {
  it('should recommend an outfit based on weather and closet items', () => {
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
            currentWeather: ""
		}
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.exist;
    });
  });
});

// check getClosetByUserId endpoint
describe('POST /getClosetByUserId', () => {
  it('should fetch closet data for userId', () => {
    cy.request({
      method: 'POST',
      url: 'https://getclosetbyuserid-6p7lfy6g4a-uc.a.run.app',
      headers: {
        authorization: Cypress.env('CLOSET_AUTH_TOKEN')
      },
      body: {
        userId: 'sampleUserId'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.exist;
    });
  });
});

// check setItemInCloset endpoint
describe('POST /setItemInCloset', () => {
  it('should set item in the closet', () => {
    cy.request({
      method: 'POST',
      url: 'https://setitemincloset-6p7lfy6g4a-uc.a.run.app',
      headers: {
        authorization: Cypress.env('CLOSET_AUTH_TOKEN')
      },
      body: {
      "userId":"sampleUserId",
      "item": {
      "id": "xyzwx",
      "name": "New Item",
      "category": "Outerwear",
      "subCategory": "",
      "color": "#000000ff",
      "material": "",
      "size": "XXXXXL",
      "brand": "Tommy Hilfiger",
      "purchaseDate": "",
      "notes": "",
      "imageUrl": ""
      }
	}
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.exist;
    });
  });
});

// check updateItemInCloset endpoint
describe('POST /updateItemInCloset', () => {
  it('should update item in the closet', () => {
    cy.request({
      method: 'POST',
      url: 'https://updateitemincloset-6p7lfy6g4a-uc.a.run.app',
      headers: {
        authorization: Cypress.env('CLOSET_AUTH_TOKEN')
      },
      body: {
		"userId":"sampleUserId",
		"itemId": "-OfGZ_Sn6x-2jtZYHIdR",
		"updatedFields": {
			"name": "Updated Item Name",
			"size": "M"
		}
	}
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.exist;
    });
  });
});

// check deleteClosetItemById endpoint
describe('DELETE /deleteClosetItemById', () => {
  it('should delete item in the closet', () => {
    cy.request({
      method: 'POST',
      url: 'https://deleteclosetitem-6p7lfy6g4a-uc.a.run.app',
      headers: {
        authorization: Cypress.env('CLOSET_AUTH_TOKEN')
      },
      body: {
		"userId":"sampleUserId",
		"itemId": "-OfGmUoAZxiNemFWdcPu"
	}
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.exist;
    });
  });
});

// check addFromPhoto endpoint
describe('POST /addFromPhoto', () => {
  it('should add closet item by a new image', () => {
    cy.request({
      method: 'POST',
      url: 'https://addFromPhoto-6p7lfy6g4a-uc.a.run.app',
      headers: {
        authorization: Cypress.env('CLOSET_AUTH_TOKEN')
      },
      body: {   
			imgUrl: "https://thumbs.dreamstime.com/b/wildflowers-blooming-sunset-nature-scenery-wildflowers-blooming-sunset-nature-scenery-388164189.jpg", 
			userId: "sampleUserId", 
			imgId:"-OesFgahcq7NHgHoZCN7", 
			imgFileName: "Sunset.jpg"
		}
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.exist;
    });
  });
});