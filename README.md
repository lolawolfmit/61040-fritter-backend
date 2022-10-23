# Fritter

## API routes

#### `GET /`

This renders the `index.html` file that will be used to interact with the backend

#### `GET /api/freets` - Get all the freets

**Returns**

- An array of all freets sorted in descending order by date modified

#### `GET /api/freets?author=USERNAME` - Get freets by author

**Returns**

- An array of freets created by user with username `author`

**Throws**

- `400` if `author` is not given
- `404` if `author` is not a recognized username of any user

#### `POST /api/freets` - Create a new freet

**Body**

- `content` _{string}_ - The content of the freet
- `fact` _{boolean}_ - Whether the freet is a fact (true) or an opinion (false)

**Returns**

- A success message
- A object with the created freet

**Throws**

- `403` if the user is not logged in
- `400` If the freet content is empty or a stream of empty spaces
- `413` If the freet content is more than 140 characters long

#### `DELETE /api/freets/:freetId?` - Delete an existing freet

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in
- `403` if the user is not the author of the freet
- `404` if the freetId is invalid

#### `PUT /api/freets/:freetId?` - Update an existing freet

**Body**

- `content` _{string}_ - The new content of the freet

**Returns**

- A success message
- An object with the updated freet

**Throws**

- `403` if the user is not logged in
- `404` if the freetId is invalid
- `403` if the user is not the author of the freet
- `400` if the new freet content is empty or a stream of empty spaces
- `413` if the new freet content is more than 140 characters long

#### `POST /api/users/session` - Sign in user

**Body**

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password

**Returns**

- A success message
- An object with user's details (without password)

**Throws**

- `403` if the user is already logged in
- `400` if username or password is not in correct format format or missing in the req
- `401` if the user login credentials are invalid

#### `DELETE /api/users/session` - Sign out user

**Returns**

- A success message

**Throws**

- `403` if user is not logged in

#### `POST /api/users` - Create an new user account

**Body**

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password

**Returns**

- A success message
- An object with the created user's details (without password)

**Throws**

- `403` if there is a user already logged in
- `400` if username or password is in the wrong format
- `409` if username is already in use

#### `PUT /api/users` - Update a user's profile

**Body** _(no need to add fields that are not being changed)_

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password

**Returns**

- A success message
- An object with the update user details (without password)

**Throws**

- `403` if the user is not logged in
- `400` if username or password is in the wrong format
- `409` if the username is already in use

#### `PATCH /api/users/followers` - Follow a user

**Body**

- `following` _{string}_ - The username of the user to follow

**Returns**

- A success message
- An object with the updated user details (without password)

**Throws**

- `403` if the user is not logged in
- `409` if user is already following the user they are requesting to follow

#### `DELETE /api/users/followers` - Unfollow a user

**Body**

- `following` _{string}_ - The username of the user to unfollow

**Returns**

- A success message
- An object with the updated user details (without password)

**Throws**

- `403` if the user is not logged in
- `409` if user is not yet following the user they are requesting to unfollow

#### `PATCH /api/users/interests` - Add an interest to a user's profile

**Body**

- `interest` _{string}_ - The name of the interest

**Returns**

- A success message
- An object with the updated user details (without password)

**Throws**

- `403` if the user is not logged in
- `409` if the user already has that interest

#### `DELETE /api/users/interests` - Remove an interest from a user's profile

**Body**

- `interest` _{string}_ - The name of the interest

**Returns**

- A success message
- An object with the updated user details (without password)

**Throws**

- `403` if the user is not logged in
- `409` if the user does not have that interest

#### `GET /api/users/recommended` - Retrieve recommended users to follow based on a user's interests

**Returns**

- A success message
- An object with a list of recommended users

**Throws**

- `403` if the user is not logged in
- `404` if the user does not have any interests

#### `DELETE /api/users` - Delete user

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in


#### `GET /api/users/homepage` - Get the last 20 freets that accounts the author is following have posted.Returns fewer freets if there are less than 20.

**Returns**

- A success message
- <=20 of the most recent freets from accounts the user follows

**Throws**

- `403` if the user is not logged in

#### `PATCH /api/freets/endorsements` - Add the user to the list of users endorsing a freet

**Returns**

- A success message
- An object with the updated freet details

**Throws**

 - `403` if the user is not logged in
 - `404` if the freetId is not valid
 - `409` if the user has already endorsed or denounced the freet
 - `403` if freet is an opinion
 - `403` if user is not a VSP

#### `PATCH /api/freets/unendorsements` - Remove the user from the list of users endorsing a freet

**Returns**

- A success message
- An object with the updated freet details

**Throws**

- `403` if the user is not logged in
- `404` if the freetId is not valid
- `409` if the user has not yet endorsed the freet
- `403` if freet is an opinion
- `403` if user is not a VSP

#### `PATCH /api/freets/denouncements` - Add the user to the list of users denouncing a freet

**Returns**

- A success message
- An object with the updated freet details

**Throws**

 - `403` if the user is not logged in
 - `404` if the freetId is not valid
 - `409` if the user has already endorsed or denounced the freet
 - `403` if freet is an opinion
 - `403` if user is not a VSP

#### `PATCH /api/freets/undenouncements` - Remove the user from the list of users denouncing a freet

**Returns**

- A success message
- An object with the updated freet details

**Throws**

- `403` if the user is not logged in
- `404` if the freetId is not valid
- `409` if the user has not yet denounced the freet
- `403` if freet is an opinion
- `403` if user is not a VSP

#### `POST /api/vsprequest` - Send request to be considered as a Verified Scientific Professional

**Body**

- `content` _{string}_ - The argument for why a user should be a VSP

**Returns**

- A success message
- The new VSP request

**Throws**

- `403` if the user is not logged in
- `409` if the user is already a VSP or has already created a request

#### `PUT /api/vsprequest` - Accept a VSP request

**Body**

- `username` _{string}_ - The username of the user to be made a VSP

**Returns**

- A success message
- An object with the updated user details (without password) and the updated VSP request

**Throws**

- `403` if the user is not signed in
- `401` if the user does not have admin credentials
- `404` if the request does not exist
- `409` if the request was already accepted

#### `DELETE /api/users/VSP` - Remove a user's VSP status. This function makes the assumption that the user has created a VSP request that was granted.

**Body**

- `username` _{string}_ - The username of the user whose status is being revoked

**Returns**

- A success message
- An object with the updated user details (without password) and the updated VSP request

**Throws**

- `403` if the user is not signed in
- `401` if the user does not have admin credentials
- `404` if the request does not exist
- `409` if the request has not yet been granted

#### `GET /api/vsprequest` - Get all VSP requests that have not been accepted.

**Returns**

- A success message
- The list of requests that have not been accepted

**Throws**

- `403` if the user is not signed in
- `401` if the user does not have admin credentials

#### `DELETE /api/vsprequest` - Delete a VSP request.

**Body**

- `username` _{string}_ - The username of the user who made the request

**Returns**

- A success message

**Throws**
- `403` if the user is not signed in
- `401` if the user does not have admin credentials