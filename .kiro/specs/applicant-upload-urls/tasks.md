# Implementation Plan

- [x] 1. Update data structure to support individual upload URLs


  - Extend the Applicant interface in src/data.ts to include uploadUrl field
  - Ensure the new field is optional to maintain backward compatibility
  - _Requirements: 2.1, 2.2_

- [x] 2. Rename existing shared upload URL dialog for clarity


  - Rename UploadURLDialog.tsx to SharedUploadURLDialog.tsx
  - Update all imports in App.tsx to use the new component name
  - Update component name and interface names within the renamed file
  - _Requirements: 2.1_

- [x] 3. Create the new individual upload URLs dialog component


  - Create src/components/UploadURLsDialog.tsx with table layout
  - Implement props interface for receiving selected applicants
  - Add state management for URL mappings and validation
  - Include basic URL validation with inline error display
  - _Requirements: 1.1, 1.2, 1.3, 3.1, 3.2, 3.3_

- [x] 4. Implement dialog UI with table structure

  - Create table with columns for rank, application ID, full name, and URL input
  - Style the dialog to match existing dialog patterns (modal overlay, header, footer)
  - Add responsive table layout with proper spacing and typography
  - Implement Cancel and Next buttons with appropriate styling
  - _Requirements: 1.2, 3.1, 3.4_

- [x] 5. Add URL input handling and validation

  - Implement handleUrlChange method for updating individual applicant URLs
  - Add basic URL format validation (HTTP/HTTPS)
  - Display inline validation errors below input fields
  - Enable/disable Next button based on validation state (optional URLs)
  - _Requirements: 1.3, 3.2, 3.3_

- [x] 6. Integrate dialog into the send workflow


  - Modify handleOpenConfirm in App.tsx to show UploadURLsDialog first
  - Update dialog state management to handle the new dialog in the chain
  - Implement onNext handler to save URLs and proceed to SendDialog
  - Implement onCancel handler to properly clean up and exit workflow
  - _Requirements: 1.1, 1.4, 1.5_

- [x] 7. Implement URL persistence to applicant data

  - Create method to update applicant records with new upload URLs
  - Ensure URLs are saved to the pagedApplicants state
  - Pre-populate dialog inputs with existing URLs when reopening
  - Maintain URL data across page navigation and app state changes
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 8. Add keyboard and accessibility support

  - Implement ESC key handler to close dialog
  - Add proper tab navigation through input fields
  - Include ARIA labels and descriptions for screen readers
  - Ensure proper focus management (focus first input on open)
  - _Requirements: 3.1, 3.4_

- [x] 9. Test and refine the complete workflow



  - Test the full flow from applicant selection to send dialog
  - Verify URL persistence across different scenarios
  - Test cancel behavior and proper state cleanup
  - Ensure visual consistency with existing dialogs
  - _Requirements: 1.1, 1.4, 1.5, 2.1, 2.2, 2.3_