## NextJS Frontend

```bash

npm run install
npm run dev

```

### Frontend Folder Structure

.
├── public
└── src
    ├── app                           # uses nextjs `app` folder structure for automatic routing
    │   ├── ai-chat                   # screen for interacting directly with the chat-bot
    │   ├── api                       # reverse proxy to firebase functions
    │   │   ├── addFromPhoto
    │   │   ├── deleteClosetItem
    │   │   ├── getClosetByUserId
    │   │   ├── getCurrentWeather
    │   │   └── getRecommendation
    │   │   ├── setItemInCloset
    │   │   ├── updateItemInCloset
    │   ├── closet                    # closet management screen
    │   └── dashboard                 # main screen for the whole app
    ├── components                    # individual components are stored here for reusability
    │   ├── cards 
    │   ├── closet-management
    │   ├── providers
    │   └── shared
    │       └── nav
    │   └── weather
    ├── hooks                         # reusable react hooks
    ├── model                         # types and classes, some are shared with the backend
    │   ├── closet
    ├── services                      # services for interacting with external apis (primarily firebase functions backend)
    └── util                          # utils and helper functions


## Navigation Bar
fullNav.tsx: Displays pages and UserId
CurrentWeather.tsx: Lists date/time, location, and current weather conditions

## Dashboard Page
### RecommendationCard
currentWeather = useWeather();    # Weather retrieved from GeoIP and Weather APIs
getRec(): Retrieves recommendation using FirebaseServices.getRecommendation()
FirebaseServices.getRecommendation(): passes userId, userPreferences, context, and currentWeather
Displays a ClosetItemCard for each recommended item

## Closet Page
### Retrieve closet
fetchCloset(): gets Closet array via FirebaseServices.getClosetByUserId

### Handling ID from URL
searchParams = useSearchParams();
itemIdFromUrl = searchParams.get("id");     # pass `?id=#` in url
useEffect(..[itemIdFromUrl, userCloset]);   # updates current item when param or selection changes

### Adding items
addItem: Provides UI from AddItemModal
addItemFromCamera / addItemFromGallery: UI provided by corresponding modal, uses handleUpload() for images
handleUpload(): creates item via FirebaseServices.uploadFileAndCreateItem, data fields extracted from image via Google Gemini

### Editing items
handleSave(): saves changes to database
handleRevert(): finds original item, reverts fields to original values
handleDelete(): creates confirmation popup, deletes item in database
