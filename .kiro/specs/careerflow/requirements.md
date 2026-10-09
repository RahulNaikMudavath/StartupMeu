# Requirements Document

## Introduction

CareerFlow is a job application tracking tool designed for students and job seekers. It allows users to create, view, edit, delete, search, and filter job applications, while also providing dashboard statistics that give an at-a-glance summary of their job search progress. The system consists of a React frontend and a Node.js/Express backend backed by a MongoDB database.

## Glossary

- **Application**: A record representing a single job application, containing fields such as `company`, `position`, `status`, `applicationDate`, `jobUrl`, and `notes`.
- **Application_Form**: The UI form component used to create or edit an Application.
- **Application_List**: The UI component that renders the collection of Application records.
- **Application_Card**: The UI component that displays summary information for a single Application within the Application_List.
- **Application_Service**: The frontend service module responsible for all API communication with the Backend.
- **Backend**: The Node.js/Express server that handles HTTP requests, business logic, and Database interactions.
- **Database**: The MongoDB instance used to persist Application records.
- **Frontend**: The React-based client application.
- **Stats_Panel**: The UI component that displays aggregated statistics about the user's Applications.

## Requirements

### Requirement 1: Create a Job Application

**User Story:** As a student or job seeker, I want to add a new job application, so that I can start tracking it in CareerFlow.

#### Acceptance Criteria

1. WHEN a user submits the Application_Form with valid data, THE Backend SHALL create a new Application record in the Database and return the created Application with HTTP status 201.
2. THE Application_Form SHALL require the following fields: `company` (text, max 255 characters), `position` (text, max 255 characters), `status` (one of `Applied`, `Interview`, `Selected`, `Rejected`), and `applicationDate` (date in YYYY-MM-DD format).
3. THE Application_Form SHALL treat `jobUrl` and `notes` as optional fields.
4. IF the user submits the Application_Form with `company` or `position` empty or containing only whitespace, THEN THE Frontend SHALL display a validation error message identifying which field is invalid and prevent form submission.
5. IF the Backend receives a POST /api/applications request with a missing required field, THEN THE Backend SHALL return HTTP status 400 with an error message indicating which required field is missing.
6. IF the user provides a `jobUrl`, THEN THE Application_Form SHALL validate that the value begins with `http://` or `https://`; if invalid, THE Frontend SHALL display a validation error message and prevent form submission.
7. WHEN the Backend successfully creates an Application, THE Application_List SHALL update to include the new Application without requiring a full page reload.
8. IF the user provides an `applicationDate` that is not a valid calendar date or is in an unrecognized format, THEN THE Frontend SHALL display a validation error message and prevent form submission.

---

### Requirement 2: View All Job Applications

**User Story:** As a student or job seeker, I want to view all my recorded applications in a clean interface, so that I can get an overview of my job search progress.

#### Acceptance Criteria

1. WHEN the Frontend loads, THE Application_Service SHALL send a GET request to the applications endpoint and THE Application_List SHALL render all returned Applications.
2. THE Backend SHALL respond to a successful GET applications request with an array of all Application records, where each record contains at minimum the `company`, `position`, `status`, and `applicationDate` fields, and a success HTTP status 200.
3. WHILE the Application_Service is awaiting a response, THE Frontend SHALL display a loading indicator that remains visible until a response is received or a timeout of 10 seconds is reached.
4. IF the Database contains no Applications, THEN THE Application_List SHALL display an empty-state message indicating no applications have been added yet.
5. IF the Backend returns an error response, THEN THE Frontend SHALL display a user-readable error message indicating the request failed and hide the loading indicator.
6. IF the Application_Service receives no response within 10 seconds, THEN THE Frontend SHALL display a user-readable error message indicating a connection timeout and hide the loading indicator.
7. THE Application_Card SHALL display the `company`, `position`, `status`, and `applicationDate` fields for each Application, where `company` and `position` are truncated at 100 characters if exceeded.

---

### Requirement 3: View a Single Job Application

**User Story:** As a student or job seeker, I want to view the full details of a specific application, so that I can review all recorded information.

#### Acceptance Criteria

1. WHEN a user selects an Application, THE Application_Service SHALL send a request to retrieve the Application record identified by its unique id to the Backend.
2. IF the Backend successfully locates the Application record for the provided id, THEN THE Backend SHALL respond with the matching Application record containing the fields `company`, `position`, `status`, `applicationDate`, `jobUrl`, and `notes`, and HTTP status 200.
3. IF no Application exists for the provided id, THEN THE Backend SHALL return HTTP status 404 and an error message indicating the Application was not found, without modifying any stored data.
4. IF the provided id is not a valid identifier format, THEN THE Backend SHALL return HTTP status 400 and an error message indicating the request is invalid, without modifying any stored data.
5. WHEN the Frontend receives a successful response, THE Frontend SHALL display all Application fields: `company`, `position`, `status`, `applicationDate`, `jobUrl`, and `notes`.
6. IF the Frontend receives an error response for the Application retrieval request, THEN THE Frontend SHALL display an error message indicating the Application could not be loaded.

---

### Requirement 4: Edit a Job Application

**User Story:** As a student or job seeker, I want to edit an existing application, so that I can update details as my job search progresses.

#### Acceptance Criteria

1. WHEN a user submits the Application_Form for an existing Application with valid data, THE Application_Service SHALL send PUT /api/applications/:id to the Backend with the updated `company`, `position`, `status`, `applicationDate`, `jobUrl`, and `notes` fields.
2. THE Backend SHALL respond to a valid PUT /api/applications/:id request with the complete updated Application record and HTTP status 200.
3. IF the user submits the Application_Form for an edit with `company` or `position` empty or containing only whitespace, THEN THE Frontend SHALL display a validation error identifying the invalid field and prevent submission.
4. IF the `company` or `position` field exceeds 200 characters, THEN THE Frontend SHALL display a validation error identifying the invalid field and prevent submission.
5. IF no Application exists for the provided `:id` in a PUT request, THEN THE Backend SHALL return HTTP status 404 with an error message indicating the Application was not found, leaving all other Application records unchanged.
6. IF the Backend returns an error for the PUT request, THEN THE Frontend SHALL display an error message and retain the unsaved edits in the Application_Form so the user can retry.
7. WHEN the Backend successfully updates an Application, THE Application_List SHALL reflect the updated data within 2 seconds without requiring a full page reload.

---

### Requirement 5: Delete a Job Application

**User Story:** As a student or job seeker, I want to delete an application I no longer need to track, so that my list stays accurate and uncluttered.

#### Acceptance Criteria

1. WHEN a user initiates deletion of an Application, THE Frontend SHALL present a confirmation prompt containing a confirm option and a cancel option before submitting the deletion request.
2. IF the user selects the cancel option on the confirmation prompt, THEN THE Frontend SHALL dismiss the prompt and leave the Application unchanged in the Application_List.
3. WHEN a user confirms deletion, THE Application_Service SHALL submit a DELETE /api/applications/:id request to the Backend.
4. WHEN the Backend receives a valid DELETE request, THE Backend SHALL permanently remove the Application record and return HTTP status 200 with a confirmation message.
5. IF no Application exists for the provided `:id` in a DELETE request, THEN THE Backend SHALL return HTTP status 404 with an error message indicating the Application was not found.
6. WHEN the Backend confirms deletion, THE Application_List SHALL remove the deleted Application without requiring a full page reload.
7. IF the deletion request fails due to a network or server error, THEN THE Frontend SHALL display an error message indicating the deletion could not be completed and SHALL retain the Application in the Application_List.

---

### Requirement 6: Search Applications

**User Story:** As a student or job seeker, I want to search my applications by company name or position, so that I can quickly find a specific application.

#### Acceptance Criteria

1. WHEN a user enters text in the search input starting from the first character, THE Application_List SHALL filter the displayed Applications to those whose `company` or `position` field contains the search text (case-insensitive).
2. THE search filter SHALL be applied on the Frontend against the already-loaded Application data without an additional API call, within 300 milliseconds of the last keystroke.
3. IF the search text matches no Applications, THEN THE Application_List SHALL display an empty-state message indicating no matching results were found, and this message SHALL persist as long as the non-matching search text remains in the input.
4. WHEN the user clears the search input, THE Application_List SHALL restore the full unfiltered list in its original order within 300 milliseconds.
5. THE search input SHALL accept a maximum of 200 characters; IF the user attempts to enter more than 200 characters, THEN THE Frontend SHALL prevent additional input beyond the limit.

---

### Requirement 7: Filter Applications by Status

**User Story:** As a student or job seeker, I want to filter my applications by status, so that I can focus on a specific stage of my job search.

#### Acceptance Criteria

1. WHEN a user selects a status filter value (`Applied`, `Interview`, `Selected`, or `Rejected`), THE Application_List SHALL display only Applications whose `status` field exactly matches the selected value (case-sensitive), within 300 milliseconds of the selection.
2. WHEN a user selects the "All" filter option, THE Application_List SHALL display all Applications regardless of status within 300 milliseconds of the selection.
3. THE Application_List SHALL apply the status filter on the Frontend against the already-loaded Application data without issuing an additional API call.
4. WHEN both a status filter value and a search filter term are active simultaneously, THE Application_List SHALL display only Applications that satisfy both constraints at the same time, updating within 300 milliseconds of either filter changing.
5. IF the status filter yields zero matching Applications, THEN THE Application_List SHALL display a message indicating no Applications match the selected status, with the list area showing zero Application entries.

---

### Requirement 8: Dashboard Statistics

**User Story:** As a student or job seeker, I want to see summary statistics of my applications, so that I can understand my overall job search progress at a glance.

#### Acceptance Criteria

1. WHEN the Frontend loads, THE Application_Service SHALL send GET /api/applications/stats to the Backend within 3 seconds of page load.
2. THE Backend SHALL respond to GET /api/applications/stats with an object containing: `total` (count of all Applications), `applied` (count with status `Applied`), `interview` (count with status `Interview`), `selected` (count with status `Selected`), and `rejected` (count with status `Rejected`), along with HTTP status 200. The `total` value SHALL equal the sum of `applied`, `interview`, `selected`, and `rejected`.
3. THE Stats_Panel SHALL display each of the five statistics with numeric values ≥ 0 and a visible label for each counter.
4. WHILE the Application_Service is awaiting the stats response, THE Stats_Panel SHALL display a loading indicator that persists until a response is received or the request fails.
5. IF the Backend returns an error for the stats request, THEN THE Stats_Panel SHALL display a user-readable error message in place of the statistics and offer a retry option.
6. WHEN a user creates, updates, or deletes an Application, THE Application_Service SHALL re-request GET /api/applications/stats and THE Stats_Panel SHALL reflect the updated statistics within 3 seconds.
7. IF the Application_Service receives no response to the stats request within 10 seconds, THEN THE Frontend SHALL cancel the request, hide the loading indicator, and display an error message indicating a timeout.

---

### Requirement 9: Backend Structure and Error Handling

**User Story:** As a developer, I want the backend to be modular and maintainable, so that the codebase is easy to extend and debug.

#### Acceptance Criteria

1. THE Backend SHALL organize code into separate directories for models, controllers, and routes, such that each directory contains only files relevant to its responsibility.
2. THE Backend SHALL use Mongoose schemas to define and enforce the Application data structure in the Database, including field types, required fields, and validation constraints for each model.
3. WHEN the Database is unavailable at startup, THE Backend SHALL log an error message indicating the connection failure and the reason returned by the Database driver, and exit the process with a non-zero exit code within 10 seconds of the failed connection attempt.
4. IF the Backend encounters an unhandled runtime error during request processing, THEN THE Backend SHALL return HTTP status 500 with a response body containing a generic error message, and log the full error stack trace server-side without exposing stack trace details to the client.
5. THE Backend SHALL use HTTP status codes consistently: 200 for successful retrieval and updates, 201 for successful creation, 400 for validation errors, 404 for not-found resources, and 500 for internal server errors.
6. IF the Backend receives a request with a malformed or unparseable request body, THEN THE Backend SHALL return HTTP status 400 with a response body containing an error message indicating the body is invalid.
7. WHEN the Backend starts successfully and establishes a Database connection, THE Backend SHALL log a message confirming the service is running, the Database connection is active, and the port number on which the server is listening.

---

### Requirement 10: Frontend Component Structure

**User Story:** As a developer, I want the frontend to be organized with reusable components and a dedicated service layer, so that the UI code is clean and maintainable.

#### Acceptance Criteria

1. THE Frontend SHALL isolate all API communication in the Application_Service module, separate from UI components, such that no UI component directly issues HTTP requests.
2. THE Frontend SHALL use functional React components throughout, with no class-based components.
3. THE Frontend SHALL display a responsive layout usable at screen widths ≥ 1024px (desktop) and between 320px and 1023px (mobile), with no horizontal scrollbar appearing at these widths.
4. WHEN an API call is in progress, THE Frontend SHALL show a visible loading indicator that is distinct from normal content and remains visible until the response is received or fails.
5. WHEN an API call returns an error, THE Frontend SHALL show an error message that describes the nature of the failure (e.g., "Failed to load applications" or "Could not save changes").
6. WHERE a list of Applications is empty (either globally or after filtering/searching), THE Frontend SHALL show a message describing the empty state and a visual indicator (such as an icon or illustration) distinct from error messages.
