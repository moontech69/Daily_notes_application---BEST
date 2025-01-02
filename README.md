# Note-Taking Application with Audio Recording

### [Watch the video](https://screenrec.com/share/9e2ViRMHlz)

## Project Overview

This application is a secure, user-friendly, full-stack solution for managing text and audio notes. It provides seamless note-taking and audio recording capabilities while ensuring high standards of data privacy, security, and usability. Designed for scalability and maintainability, the application adheres to best practices in both frontend and backend development.

Key features include secure JWT-based authentication, encrypted audio storage, and a responsive UI for creating, managing, and viewing notes. The application is ideal for users who require a robust platform to manage their daily notes and recordings with confidence in data protection.

---

## Assumptions and Implementations

### 1. **Data Privacy and Security**
   - **Assumption:** Users' notes and audio may contain sensitive information requiring high-level protection.
   - **Implementation:** Audio files are encrypted before storage, and only authenticated users with valid short-lived tokens (5-minute lifespan) can access media files. To further enhance security, an auto sign-out feature logs users out after 10 minutes of inactivity, preventing unauthorized access.

### 2. **JWT Authentication**
   - **Assumption:** Authentication should be secure, seamless, and handle token expiration efficiently.
   - **Implementation:** The app uses JWT tokens stored in HTTP-only cookies. Tokens are refreshed 1 minute before expiration for uninterrupted sessions. If an API call returns a 401 error, the app automatically retries the request after refreshing tokens.

### 3. **Time Zone Handling**
   - **Assumption:** Users across different time zones need consistent timestamp displays.
   - **Implementation:** Timestamps are stored in UTC for consistency. The frontend converts them to the user's local time zone and displays relative timestamps (e.g., "5 minutes ago").

### 4. **Interruptions During Recording**
   - **Assumption:** Users may need to pause or resume audio recording due to interruptions.
   - **Implementation:** The in-app audio recorder supports pause and resume functionality, allowing users to manage recordings seamlessly.

### 5. **Concurrent Updates**
   - **Assumption:** The app is primarily designed for single-user scenarios, making concurrent editing rare.
   - **Implementation:** A conflict resolution mechanism is omitted to keep the application lightweight, focusing on independent user operations.

### 6. **Premium Features**
   - **Assumption:** This premium version offers unrestricted note creation and audio length.
   - **Implementation:** Users can create unlimited text notes and record audio of any duration without restrictions.

---

## Technical Design Overview

### Frontend

- **Framework:** React 17 for a responsive and dynamic user interface.
- **State Management:** React Query for efficient server state handling.
- **Global State:** React Context for managing user authentication and global application state.
- **Audio Recording:** React-mic for seamless in-app audio recording.
- **Form Handling:** Formik and Yup for building and validating user input forms.
- **Testing:** Jest and React Testing Library for unit and integration tests.

### Backend

- **Framework:** Django with Django REST Framework (DRF) for secure API development.
- **Database:** MySQL for efficient storage of user data and notes.
- **Authentication:** JWT-based authentication with HttpOnly cookies for secure token storage.
- **Storage:** Encrypted audio storage to ensure data security.
- **Testing:** Pytest for automated backend testing.

---

## Features

### User Authentication (JWT)
- Secure registration and login.
- Authenticated access to create, view, update, and delete notes.
- Auto sign-out after 10 minutes of inactivity.
- Short-lived signed URLs (5-minute lifespan) for accessing encrypted audio files.

### Daily Notes Management
- Create, read, update, and delete text notes, with each note tied to an authenticated user.
- Fetch notes with filters and sorting by creation time or alphabetical order.

### Audio Notes
- Record audio directly in the app using React-mic.
- Securely store audio files on the server with encryption.

---

## 📽 Project Structure

```
daily-notes/
├── frontend_react/        # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── contexts/      # React context for global state
│   │   ├── hooks/         # Custom React hooks
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── ...
├── backend_django/        # Django backend application
│   ├── notes/             # Notes app
│   ├── users/             # User authentication
│   └── ...
└── docker-compose.yml     # Docker composition
```

---

## Instructions for Running and Testing the Application

### Prerequisites

1. Install Docker and Docker Compose.

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/moontech69/Daily_notes_application---BEST.git
   cd Daily_notes_application---BEST
   ```
2. Build images using Docker Compose:
   ```bash
   docker-compose build
   ```
   **Once you building images, you don't need to rebuild images.*
3. Building and run the containers using Docker Compose:
   ```bash
   docker-compose up
   ```
   **Once you build the images, when you are restarting server, you can start here.*
4. Access the application:
   - **Backend:** `http://localhost:8000`
   - **Frontend:** `http://localhost:3000`
5. Stop running and removing the containers:
   ```bash
   docker-compose down
   ```

### Testing
**Before testing you should run your container using below command.**
   ```bash
   docker-compose up
   ```

#### Backend Tests

   ```bash
   docker exec -it backend_django pytest
   ```

#### Frontend Tests

   ```bash
   docker exec -it frontend_react npm test
   ```
---

## Conclusion

This note-taking application integrates secure user authentication, encrypted media storage, and user-friendly features for text and audio notes. Designed for scalability and reliability, it ensures data privacy while delivering a seamless experience to users across different platforms.
