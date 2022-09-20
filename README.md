# FFXIV Collection Tracker

https://ffxiv-collectables-average-alien.koyeb.app/

Website where you can search for and view various collectables in the critically acclaimed MMORPG Final Fantasy XIV Online. By creating an account, users can also add collectables to a list and mark them as obtained or unobtained. Users can view their list on their profile page for easier tracking of all the goodies they want to get.


## API
https://ffxivcollect.com/

https://ffxivcollect.com/api/docs

API that provides data on all (if not most) of the collectables in the game. No API key is needed and there doesn't seem to be any form of rate limiting. Will mostly be using the API to get and show data on the collectables (ex. names, descriptions, and how to get them).


## ERD
![ERD](./media/readme/ERD.drawio.svg)

Similar tables can be added for each additional collectable category I add


## RESTful Routing Chart
| VERB | URL | ACTION | DESCRIPTION |
|------|-----|--------|-------------|
| GET | /users/new | READ | display a sign up form
| POST | /users | CREATE | create a new user in the DB
| GET | /users/login | READ | display a login form
| POST | /users/login | CREATE? | log in the user and save them in a cookie
| GET | /users/:id | READ | display the logged in user's profile page
| GET | /users/logout | READ? | logout the user
| GET | /mounts | READ | mount index
| GET | /mounts/:id | READ | show page for specific mount
| POST | /mounts/users/:id | CREATE | add mount to user's list
| PUT | /mounts/:id | UPDATE | mark mount as obtained or not
| DELETE | /mounts/:id | DESTROY | remove mount from list
| GET | /minions | READ | minion index
| GET | /minions/:id | READ | show page for specific minion
| POST | /minions/users/:id | CREATE | add minion to user's list
| PUT | /minions/:id | UPDATE | mark minion as obtained or not
| DELETE | /minions/:id | DESTROY | remove minion from list

Similar routes can be added for extra collectable categories I add to the DB

## Wireframes
### forms
![form wireframe](./media/readme/form.drawio.svg)

### indexes
![index wireframe](./media/readme/index.drawio.svg)

### shows
![show wireframe](./media/readme/show.drawio.svg)

### user profile
![profile wireframe](./media/readme/profile.drawio.svg)


## User Stories
- As a user, I want to view all the collectables in a category
- As a user, I want to search for collectables in a category
- As a user, I want to view details on a specific collectable
- As a user, I want to add certain collectables to my personal list
- As a user, I want to mark collectables I have as obtained in my list
- As a user, I want to remove collectables from my list that I no longer want to track


## MVP / Stretch Goals
### MVP
- [x] Display an index page for each collectable category
- [x] Allow users to search for collectables by name within each category
- [x] Display a show page with details on a specific colelctable
- [x] Let users create accounts and log in with them (with secured auth)
- [x] Let users add collectables to their personal track list
- [x] Let users mark those collectables as obtained or not
- [x] Let users remove collectables from their track list

### Stretch
- [x] Add more collectable categories (WIP)
- [] Give users the ability to search through their personal lists
- [] Allow users to track multiple characters (players can have multiple characters which have unique collection progress)
- [] 

## Tech used
- 
- Bootstrap for CSS


## Approch Taken
I split the project up into a few different aspects that I could tackle one by one. The first one that I worked on was the database and models. Using sequelize, I set up the database I would need for my project and did some testing to verify that it was working as intended. Then I moved onto setting up my routes with express by following my RESTful routing chart. I tested each route with simple responses to ensure that each route was doing what I wanted (hitting the API appropriately and receiving the expected data response or performing CRUD operations on my database correctly). From here I moved onto setting up some basic views for each route. I verified what information from each route I wanted to display to the user and laid it out in a way that made most sense to me. With a basic view rendering for each route, I moved on to CSS and styling. I decided to make use of Bootstrap for my CSS framework and used the project as a bit of a learning tool for Bootstrap. This is where I spent most of the rest of my time on the project, tinkering and experimenting with everything that Bootstrap has to offer while occasionally taking detours to implement new features I thought of or extra models as part of my stretch goals.

## Post-project Reflection
This was a pretty fun project to work on and I definitely learned a lot from it. While I’m sure there are many apps like the one I made, I’m glad I didn’t let that deter me from choosing it for my project because it allowed me to work with something I’m passionate about which gives me more motivation to keep working on it. And there are a lot of things that could use some work on this app. For the future I can continue incorporating more models so that I can confidently declare the app a full collectables tracker. Adding some filters or sorting options would be great as well. And the overall design and layout is still a work in progress.