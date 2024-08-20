# CapstoneBackEnd

This is the BackEnd of the Capstone Project

## Description

### CapstoneBackEnd/:

- **.env:** This file contains environment variables that are used to configure the application.
- **index.js:** The main entry point of the Node.js application.
- **package.json:** This file contains metadata about the project and manages the project's dependencies, scripts, and
  other configurations.

### config/:

- **db.js:** Database connection setup.
- **env.js:** Environment variables and configuration.

### controllers/:

- **gameController.js:** Handle game-related requests (start game, submit guess, get feedback).
- **userController.js:** Handle user-related requests (login, register, profile).
- **statsController.js:** Handle statistics-related requests (leaderboard, user stats).

### models/:

- **game.js:** Define game schema and model.
- **user.js:** Define user schema and model.
- **stats.js:** Define statistics schema and model.

### routes/:

- **gameRoutes.js:** Define routes for game-related endpoints.
- **userRoutes.js:** Define routes for user-related endpoints.
- **statsRoutes.js:** Define routes for statistics-related endpoints.

### services/:

- **gameService.js:** Business logic for game features.
- **userService.js:** Business logic for user management.
- **statsService.js:** Business logic for statistics.

### utils/:

- **auth.js:** Authentication middleware.
- **helpers.js:** Helper functions.

### index.js:

- **index.js:** Entry point of the application.