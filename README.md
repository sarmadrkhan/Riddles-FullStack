# "SolveMyRiddle"

## SARMAD RAEES KHAN

## React Client Application Routes

- Route `/`: Main layout get loaded here, it is populated with all the riddles from the data base
- Route `index` Index route is child route with no path that renders in the parent's outlet at the parent's URL
- Route `/my` shows riddles posted by the logged in user (empty for guest)
- Route `/open` shows open riddles
- Route `/closed` shows closed riddles
- Route `/rankings` shows rankings with gold silver and bronze for the 3 positions
- Route `/*` lost layout gets rendered here
- Route `/login` login layout gets rendered here if user is not logged in

## API Server

- POST `/api/sessions`
  - for authentication,
  - post for login, get for checking logged in state and delete for logout
- DELETE `/api/sessions/current`
  -removes the current user informations and performs logout
- GET `/api/riddles`
  - gets all riddles from riddles table
  - also fetches all replies associated with each riddle from the replies table(based on the riddleId)
- POST `/api/riddles`
  - adds a new riddle
- GET `/api/players`
  - gets all players (used for ranking)
- PUT `/api/riddles/:riddleId/close`
  - sets maxDuration = 0 and isClosed = true
- PUT `/api/riddles/:riddleId/addReply`
  - adds a new reply with author id to replies array for each riddle
- PUT `/api/players/:id/updateScore`
  - adds new score to existing score based on riddle difficulty

## Database Tables

- Table `users` - contains email password name score

| email               | password | name | score |
| ------------------- | -------- | ---- | ----- |
| user.one@domain.com | password | Uno  | ##    |

- Table `replies` - contains riddleId author(id) reply

| riddleId | author | reply   |
| -------- | ------ | ------- |
| 1        | 1      | reply 1 |

- Table `riddles` - contains riddleId text difficulty maxDuration answer hint1 hint2 isClosed author

| riddleId  | text               | difficulty             | maxDuration     | answer         | hint1  | hint2  | isClosed | author    |
| --------- | ------------------ | ---------------------- | --------------- | -------------- | ------ | ------ | -------- | --------- |
| riddleId# | sample riddle text | easy/average/difficult | time in seconds | correct answer | hint a | hint b | 0/1      | authorId# |

## Main React Components

- `RiddleTable` (in `Layout.js`): has all the riddle information for all filters except ranking
- `RankingTable` (in `Layout.js`): has the ranking information

others shown in screenshots

## Screenshot

### LoginScreen

![Login Screen](../exam2-riddles-sarmadrkhan/client/src/assets/jpg/loginSS.png)

### Guest Account

![Guest Account](../exam2-riddles-sarmadrkhan/client/src/assets/jpg/guestAccountSS.png)

### Registered Account

![Registered Account](../exam2-riddles-sarmadrkhan/client/src/assets/jpg/registeredAccountSS.png)

### Loading Layout

![Loading Layout](../exam2-riddles-sarmadrkhan/client/src/assets/jpg/loadingSS.png)

### Ranking Layout

![Ranking Layout](../exam2-riddles-sarmadrkhan/client/src/assets/jpg/rankingSS.png)

## Users Credentials

| usernames             | Passwords |
| --------------------- | --------- |
| user.one@domain.com   | password  |
| user.two@domain.com   | password  |
| user.three@domain.com | password  |
| user.four@domain.com  | password  |
| user.five@domain.com  | password  |
