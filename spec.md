# Partner Portal Prototype Specification

This document outlines the features and data model for the Dahlia Partners Portal prototype.

## Features

The prototype is a single-page application that allows partners to manage lists of applicants for housing opportunities.

### 1. Applicant List View

- **Paginated Table**: The main view is a paginated table displaying a list of applicants.
- **Data Columns**: The table shows the following information for each applicant:
  - Rank
  - Application ID
  - First Name
  - Last Name
  - Household Size (HH)
  - Accessibility Requests
  - Last Updated Date
  - Latest Substatus
  - An interactive Status menu

### 2. Pagination Controls

- Users can navigate through pages of applicants using "Previous" and "Next" buttons.
- A text input field allows users to jump directly to a specific page number.

### 3. Applicant Selection

- **Individual Selection**: Users can select one or more applicants using checkboxes in each row.
- **Select All**: A master checkbox in the table header allows users to select or deselect all applicants on the current page.
- **Shift-Select**: Users can select a range of applicants by holding the `Shift` key while clicking checkboxes.

### 4. Bulk Actions

Once applicants are selected, the following actions are available:

- **Set Status**: A button to change the status for all selected applicants (Note: UI is present, but bulk update logic is not yet implemented).
- **Add Comment**: A button to add a comment to the selected applications (Note: UI is present, but functionality is not yet implemented).
- **Send Email**: A dropdown menu with an "Invite to apply" option.
  - This action opens a confirmation dialog displaying the number of selected applicants and how many have an alternate contact.
  - Confirming the action simulates sending an email.

### 5. Individual Applicant Actions

- **Update Status**: Each applicant row contains a dropdown menu that allows for changing the applicant's status individually. When a status is changed, the "Updated" date for that applicant is set to the current date.

### 6. Search and Filtering

- UI elements for search and filtering are present, including a search bar and a "Show Filters" button, but the functionality is not yet implemented.

## Data Model

The application's data is structured around two main interfaces.

### `Applicant`

This interface represents a single housing applicant.

| Property              | Type      | Description                                                 |
| --------------------- | --------- | ----------------------------------------------------------- |
| `id`                  | `number`  | A unique identifier for the applicant.                      |
| `rank`                | `string`  | The applicant's rank in the lottery (e.g., "COP 1").      |
| `applicationId`       | `string`  | The unique ID for the application (e.g., "APP-00474767"). |
| `firstName`           | `string`  | The applicant's first name.                                 |
| `lastName`            | `string`  | The applicant's last name.                                  |
| `hh`                  | `number`  | The number of people in the applicant's household.          |
| `requests`            | `string`  | Any accessibility requests (e.g., "Hearing/Vision").      |
| `updated`             | `string`  | The date the record was last modified.                      |
| `substatus`     | `Status`  | The current status of the application.                      |
| `hasAlternateContact` | `boolean` | (Optional) Indicates if an alternate contact is available.  |

### `Status`

This type defines the possible statuses an application can have. Each status has associated display properties.

**Possible Values:**

- `Processing`
- `Withdrawn`
- `Appealed`
- `Waitlisted`
- `Disqualified`
- `Approved`
- `Lease Signed`

**Associated Properties:**

- `label`: The display text for the status.
- `textColor`: The CSS class for the text color.
- `backgroundColor`: The CSS class for the background color.
- `borderColor`: The CSS class for the border color.
