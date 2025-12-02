# backend

If developing in node with typescript -

    npm install -g firebase-tools

## functions > src > model
Contains .ts files defining types for the following

ClosetItem: Fields reflected in frontend closet and firebase database
ClosetItemCategories: 8 categories for items, used in sorting and outfit recommendations
GeoIp: IP address query along with geolocation details (longitude/latitude, region, timezone, etc.)
JsonBlob: Loose helper for key/value pairs
OutfitRequest: Reflects shape of frontend request via currentWeather, userPreferences, and userId
VisualCrossing: Weather conditions from specified location

## functions > src > on-request
addFromPhotoOnRequest: Reads image via Google Gemini and populates corresponding ClosetItem fields
aiQueryOnRequest: Handles user queries to Gemini on Dashboard and Ai Chat pages
deleteClosetItemOnRequest: Handles deleting items from database
getClosetByUserIdOnRequest: Handles retrieval of whole closet from userId
outfitRecommendationOnRequest: Handles outfit recommendations using closet information, requester's IP, and gemini response
setItemInClosetOnRequest: Handles adding new items to closet
updateItemOnRequest: Handles updating corresponding changed fields in closet
weatherByLocationOnRequest: Retrieves IP from user request, grabs location from GeoIP, and gets weather from latitude/longitude

## functions > src > services
firebase-services: holds project-id and database URL
gemini-services.ts: biulds agent and allows users to query via text/image
geoip-services.ts: fetches latitude/longitude for given IP
visualcrossing-services.ts: get current weather by city key
