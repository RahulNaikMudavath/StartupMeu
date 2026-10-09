# Requirements Document

## Introduction

CareerFlow is a MERN stack web application that allows students and job seekers to track their job and internship applications in one place. Users can add, view, edit, and delete applications, search and filter them, and view dashboard statistics — all without requiring authentication. The application is built with React.js (Vite) on the frontend, Node.js with Express.js on the backend, and MongoDB via Mongoose for data persistence.

## Glossary

- **Application**: A job or internship application record containing company, position, status, applicationDate, jobUrl, and notes.
- **Status**: The current state of an Application. One of: `Applied`, `Interview`, `Selected`, `Rejected`.
- **Dashboard**: The summary view displaying aggregate statistics about all Applications.
- **API**: The RESTful HTTP interface exposed by the Backend.
- **Backend**: The Node.js/Express.js server that handles business logic, validation, and database operations.
- **Frontend**: The React.js (Vite) single-page application that renders the UI and communicates with the Backend.
- **Database**: The MongoDB instance accessed via Mongoose.
- **Application_Service**: The frontend module responsible for all HTTP communication with the Backend API.
- **Application_Form**: The React component used to create or edit an Application.
- **Application_List**: The React component that renders the collection of Applications.
- **Application_Card**: The React component that displays a single Application's summary.
- **Stats_Panel**: The React component that renders Dashboard statistics.

---

## Requirements

### Requirement 1: Create a Job Application

**User Story:** As a student or job seeker, I want to add a new job application, so that I can start tracking it in CareerFlow.

#### Acceptance Criteria

1. WHEN a user submits the Application_Form with valid data, THE Backend SHALL create a new Application record in the Database and return the created Application with HTTP status 201.
2. THE Application_Form SHALL require the following fields: `company` (text), `position` (text), `status` (one of `Applied`, `Interview`, `Selected`, `Rejected`), and `applicationDate` (date).
3. THE Application_Form SHALL treat `jobUrl` and `notes` as optional fields.
4. IF the user submits the Application_Form with `company` or `position` empty, THEN THE Frontend SHALL display a validation error message and prevent form submission.
5. IF the Backend receives a POST /api/applications request with a missing required field, THEN THE Backend SHALL return HTTP status 400 with a descriptive error message.
6. IF the user provides a `jobUrl`, THEN THE Application_Form SHALL validate that the value is a well-formed URL before allowing submission.
7. WHEN the Backend successfully creates an Application, THE Application_List SHALL update to include the new Application without requiring a full page reload.

---

### Requirement 2: View All Job Applications

**User Story:** As a student or job seeker, I want to view all my recorded applications in a clean interface, so that I can get an overview of my job search progress.

#### Acceptance Criteria

1. WHEN the Frontend loads, THE Application_Service SHALL send GET /api/applications to the Backend and THE Application_List SHALL render all returned Applications.
2. THE Backend SHALL respond to GET /api/applications with an array of all Application records and HTTP status 200.
3. WHILE the Application_Service is awaiting a response, THE Frontend SHALL display a loading indicator.
4. IF the Database contains no Applications, THEN THE Application_List SHALL display an empty-state message indicating no applications have been added yet.
5. IF the Backend returns an error response, THEN THE Frontend SHALL display a user-readable error message.
6. THE Application_Card SHALL display at minimum: `company`, `position`, `status`, and `applicationDate` for each Application.

---

### Requirement 3: View a Single Job Application

**User Story:** As a student or job seeker, I want to view the full details of a specific application, so that I can review all recorded information.

#### Acceptance Criteria

1. WHEN a user selects an Application, THE Application_Service SHALL send GET /api/applications/:id to the Backend.
2. THE Backend SHALL respond to GET /api/applications/:id with the matching Application record and HTTP status 200.
3. IF no Application exists for the provided `:id`, THEN THE Backend SHALL return HTTP status 404 with a descriptive error message.
4. THE Frontend SHALL display all Application fields: `company`, `position`, `status`, `applicationDate`, `jobUrl`, and `notes`.

---

### Requirement 4: Edit a Job Application

**User Story:** As a student or job seeker, I want to edit an existing application, so that I can update details as my job search progresses.

#### Acceptance Criteria

1. WHEN a user submits the Application_Form for an existing Application with valid data, THE Application_Service SHALL send PUT /api/applications/:id to the Backend with the updated fields.
2. THE Backend SHALL respond to a valid PUT /api/applications/:id request with the updated Application record and HTTP status 200.
3. IF the user submits the Application_Form for an edit with `company` or `position` empty, THEN THE Frontend SHALL display a validation error and prevent submission.
4. IF no Application exists for the provided `:id` in a PUT request, THEN THE Backend SHALL return HTTP status 404 with a descriptive error message.
5. WHEN the Backend successfully updates an Application, THE Application_List SHALL reflect the updated data without requiring a full page reload.

---

### Requirement 5: Delete a Job Application

**User Story:** As a student or job seeker, I want to delete an application I no longer need to track, so that my list stays accurate and uncluttered.

#### Acceptance Criteria

1. WHEN a user confirms deletion of an Application, THE Application_Service SHALL send DELETE /api/applications/:id to the Backend.
2. THE Backend SHALL respond to a valid DELETE /api/applications/:id request with HTTP status 200 and a confirmation message.
3. IF no Application exists for the provided `:id` in a DELETE request, THEN THE Backend SHALL return HTTP status 404 with a descriptive error message.
4. WHEN the Backend confirms deletion, THE Application_List SHALL remove the deleted Application without requiring a full page reload.
5. THE Frontend SHALL present a confirmation prompt to the user before sending the DELETE request.

---

### Requirement 6: Search Applications

**User Story:** As a student or job seeker, I want to search my applications by company name or position, so that I can quickly find a specific application.

#### Acceptance Criteria

1. WHEN a user enters text in the search input, THE Application_List SHALL filter the displayed Applications to those whose `company` or `position` field contains the search text (case-insensitive).
2. THE search filter SHALL be applied on the Frontend against the already-loaded Application data without an additional API call.
3. IF the search text matches no Applications, THEN THE Application_List SHALL display an empty-state message indicating no matching results were found.
4. WHEN the user clears the search input, THE Application_List SHALL restore the full unfiltered list.

---

### Requirement 7: Filter Applications by Status

**User Story:** As a student or job seeker, I want to filter my applications by status, so that I can focus on a specific stage of my job search.

#### Acceptance Criteria

1. WHEN a user selects a status filter value (`Applied`, `Interview`, `Selected`, or `Rejected`), THE Application_List SHALL display only Applications whose `status` matches the selected value.
2. WHEN a user selects the "All" filter option, THE Application_List SHALL display all Applications regardless of status.
3. THE status filter SHALL be applied on the Frontend against the already-loaded Application data without an additional API call.
4. THE status filter and search filter SHALL be combinable, so that both constraints are applied simultaneously to the displayed Applications.

---

### Requirement 8: Dashboard Statistics

**User Story:** As a student or job seeker, I want to see summary statistics of my applications, so that I can understand my overall job search progress at a glance.

#### Acceptance Criteria

1. WHEN the Frontend loads, THE Application_Service SHALL send GET /api/applications/stats to the Backend.
2. THE Backend SHALL respond to GET /api/applications/stats with an object containing: `total` (count of all Applications), `applied` (count with status `Applied`), `interview` (count with status `Interview`), `selected` (count with status `Selected`), and `rejected` (count with status `Rejected`), along with HTTP status 200.
3. THE Stats_Panel SHALL display each of the five statistics from Requirement 8.2.
4. WHILE the Application_Service is awaiting the stats response, THE Stats_Panel SHALL display a loading indicator.
5. IF the Backend returns an error for the stats request, THEN THE Stats_Panel SHALL display a user-readable error message in place of the statistics.
6. WHEN a user creates, updates, or deletes an Application, THE Stats_Panel SHALL refresh its statistics to reflect the change.

---

### Requirement 9: Backend Structure and Error Handling

**User Story:** As a developer, I want the backend to be modular and maintainable, so that the codebase is easy to extend and debug.

#### Acceptance Criteria

1. THE Backend SHALL organize code into separate directories for models, controllers, and routes.
2. THE Backend SHALL use Mongoose schemas to define and enforce the Application data structure in the Database.
3. WHEN the Database is unavailable at startup, THE Backend SHALL log a descriptive error message and exit the process.
4. IF the Backend encounters an unhandled runtime error during request processing, THEN THE Backend SHALL return HTTP status 500 with a generic error message and log the error details server-side.
5. THE Backend SHALL use HTTP status codes consistently: 200 for successful retrieval and updates, 201 for successful creation, 400 for validation errors, 404 for not-found resources, and 500 for internal server errors.

---

### Requirement 10: Frontend Component Structure

**User Story:** As a developer, I want the frontend to be organized with reusable components and a dedicated service layer, so that the UI code is clean and maintainable.

#### Acceptance Criteria

1. THE Frontend SHALL isolate all API communication in the Application_Service module, separate from UI components.
2. THE Frontend SHALL use functional React components throughout.
3. THE Frontend SHALL display a responsive layout that is usable on both desktop and mobile screen sizes.
4. WHEN an API call is in progress, THE Frontend SHALL show a loading state to the user.
5. WHEN an API call returns an error, THE Frontend SHALL show a readable error message to the user.
6. WHERE a list of Applications is empty (either globally or after filtering/searching), THE Frontend SHALL show a distinct empty-state UI element.
