# Requirements Document

## Introduction

This feature adds the ability for users to assign individual upload URLs to each selected applicant before sending invitation emails. The system will display a dialog showing all selected applicants in a table format, allowing users to enter or paste upload URLs for each applicant. These URLs will be stored with each applicant and included in the email invitations.

## Requirements

### Requirement 1

**User Story:** As a user sending invitation emails, I want to assign individual upload URLs to each selected applicant, so that each applicant receives a personalized upload link in their invitation email.

#### Acceptance Criteria

1. WHEN the user clicks the "Invite" button with selected applicants THEN the system SHALL display an upload URL assignment dialog before showing the send dialog
2. WHEN the upload URL assignment dialog is displayed THEN the system SHALL show a table with columns for rank, application ID, full name, and upload URL input field
3. WHEN the user enters or pastes a URL in an applicant's upload URL field THEN the system SHALL validate the URL format and store it temporarily
4. WHEN the user clicks "Next" in the upload URL dialog THEN the system SHALL save all entered URLs to the respective applicants and proceed to the send dialog
5. WHEN the user clicks "Cancel" in the upload URL dialog THEN the system SHALL discard any entered URLs and cancel the send process

### Requirement 2

**User Story:** As a user managing applicant data, I want upload URLs to be persisted with each applicant record, so that the URLs are available for future reference and email sends.

#### Acceptance Criteria

1. WHEN upload URLs are saved from the dialog THEN the system SHALL update each applicant's data structure to include the upload URL
2. WHEN the upload URL dialog is opened for applicants who already have URLs THEN the system SHALL pre-populate the input fields with existing URLs
3. WHEN an applicant's upload URL is updated THEN the system SHALL replace the previous URL with the new one
4. WHEN viewing applicant details THEN the system SHALL display the assigned upload URL if one exists

### Requirement 3

**User Story:** As a user reviewing upload URL assignments, I want clear visual feedback about which applicants have URLs assigned, so that I can ensure all necessary URLs are provided before sending emails.

#### Acceptance Criteria

1. WHEN an applicant has no upload URL assigned THEN the input field SHALL appear empty with placeholder text
2. WHEN an applicant has a valid upload URL assigned THEN the input field SHALL display the URL
3. WHEN a user enters an invalid URL format THEN the system SHALL provide visual feedback indicating the error
4. WHEN all required URLs are entered THEN the "Next" button SHALL be enabled
5. WHEN some required URLs are missing THEN the system SHALL provide clear indication of which applicants need URLs

