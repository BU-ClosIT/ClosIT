# ClosIT

This is the main repo for Group 5's MET-CS 673 fall semester 2025 project - ClosIT

This repo is split into 2 parts -

## Frontend

Most Recent Deploy Status -

[![Netlify Status](https://api.netlify.com/api/v1/badges/f89a3b47-973f-4e9b-b140-b5c59afb1aaf/deploy-status)](https://app.netlify.com/projects/closit/deploys)

The frontend NextJS React App

Displays a header showing current location and weather data based on IP address
Provides a Dashboard, Manage Closet, and AI Chat page

### Dashboard
<img width="928" height="623" alt="image" src="https://github.com/user-attachments/assets/66074d28-2bbd-4e04-b2dd-74fcac33f02d" />

Suggests clothing outfits based on current weather

### Manage Closet
<img width="1244" height="614" alt="image" src="https://github.com/user-attachments/assets/996ce61a-944d-47cb-957f-be5135249cf8" />

Allows users to add, modify, or delete clothing items to their closet. Users can search by name and sort by category.

### AI Chat
WIP

## Backend

The backend server built using Firebase functions. Written in Python, using the Firebase Python SDK

Connects the frontend to the following APIs:
Geolocation from IP            # Retrieves location to be used for accessing weather information
Visual Crossing Weather Data   # Retrieves weather data from location
Google Gemini                  # Handle clothing suggestions in Dashboard page, gets clothing info from uploaded images on Closet page
Firebase Functions             # Retrieve, update, and delete clothing entries

## 3-Layer Architecture
```
React Frontend: ItemDetails > handleDelete()
      ↓
React Frontend: FirebaseServices.deleteClosetItemById()
      ↓
Next.js API route: /api/deleteClosetItem
      ↓
Next.js fetch(ENDPOINT_URL → Firebase Function)
      ↓
Firebase Cloud: deleteClosetItem (onRequest wrapper)
      ↓
Firebase Cloud: deleteClosetItemOnRequest 
      ↓
Firebase Cloud: Deletes item in Firebase realtime database, returns success 
      ↓
Next.js: returns JSON.stringify({ message: `Item deleted successfully: ${itemId}` }),
      ↓
React Frontend: receives response and updates UI accordingly
```
