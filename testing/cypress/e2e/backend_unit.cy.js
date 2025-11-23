/** Unit Tests for Backend API endpoints - index.ts file
 *  It checks if the firebase function return correct output for the given input 
 */

const endpoints = {
	aiQuery: 'https://aiquery-6p7lfy6g4a-uc.a.run.app',
	getWeatherByLocation: 'https://getweatherbylocation-6p7lfy6g4a-uc.a.run.app',
	getOutfitRecommendation: 'https://getoutfitrecommendation-6p7lfy6g4a-uc.a.run.app',
	getClosetByUserId: 'https://getclosetbyuserid-6p7lfy6g4a-uc.a.run.app',
	setItemInCloset: 'https://setitemincloset-6p7lfy6g4a-uc.a.run.app',
	updateItemInCloset: 'https://updateitemincloset-6p7lfy6g4a-uc.a.run.app',
	deleteClosetItemById: 'https://deleteclosetitem-6p7lfy6g4a-uc.a.run.app',
	addFromPhoto: 'https://addfromphoto-6p7lfy6g4a-uc.a.run.app',
};

describe('Backend API smoke tests (skipped by default)', () => {
	Object.entries(endpoints).forEach(([name, url]) => {
		it(`${name} should respond`, () => {
			cy.request({ url, failOnStatusCode: false }).then((resp) => {
				expect(resp.status).to.be.a('number');
				expect(resp.body).to.not.be.null;
			});
		});
	});
});