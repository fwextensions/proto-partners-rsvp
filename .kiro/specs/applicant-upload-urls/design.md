# Design Document

## Overview

This feature introduces an "Applicant Upload URLs" dialog that appears in the email sending workflow, positioned between the user's selection of applicants and the existing send dialog. The dialog presents a table interface where users can assign individual upload URLs to each selected applicant. This design integrates seamlessly with the existing dialog system and maintains consistency with current UI patterns.

## Architecture

### Component Structure
The feature will be implemented as a new React component `UploadURLsDialog` that follows the existing dialog patterns in the application. The component will:

- Receive selected applicants as props
- Manage URL input state for each applicant
- Validate URL formats
- Persist URLs to applicant data
- Integrate with the existing send workflow

### Data Flow
1. User selects applicants and clicks "Invite"
2. System opens `UploadURLsDialog` instead of the existing `SharedUploadURLDialog` or `SendDialog`
3. User enters individual URLs for each applicant
4. On "Next", URLs are saved to applicant records
5. System proceeds to existing `SendDialog`
6. On "Cancel", workflow is terminated and selections are cleared

**Note**: The existing `UploadURLDialog` will be renamed to `SharedUploadURLDialog` to distinguish it from the new individual URL dialog. The shared URL dialog will be preserved for future use but bypassed in the current workflow.

### Integration Points
- **App.tsx**: Modify `handleOpenConfirm` to show the new `UploadURLsDialog` first, bypassing the existing `SharedUploadURLDialog`
- **Component Renaming**: Rename existing `UploadURLDialog` to `SharedUploadURLDialog` for clarity
- **Applicant Data Structure**: Extend the `Applicant` interface to include `uploadUrl` field
- **Send Workflow**: Update the dialog chain to include the new individual URL assignment step

## Components and Interfaces

### UploadURLsDialog Component

**Props Interface:**
```typescript
interface UploadURLsDialogProps {
  applicants: Applicant[];
  onClose: () => void;
  onNext: (urlMappings: { [applicantId: number]: string }) => void;
}
```

**State Management:**
```typescript
interface DialogState {
  urlMappings: { [applicantId: number]: string };
  validationErrors: { [applicantId: number]: string };
  isNextEnabled: boolean;
}
```

**Key Methods:**
- `handleUrlChange(applicantId: number, url: string)`: Updates URL for specific applicant
- `validateUrl(url: string)`: Validates URL format
- `handleNext()`: Saves URLs and proceeds to send dialog
- `handleCancel()`: Closes dialog and cancels workflow

### Updated Applicant Interface

```typescript
interface Applicant {
  id: number;
  rank: string;
  applicationId: string;
  firstName: string;
  lastName: string;
  hh: number;
  requests: string;
  updated?: string;
  substatus?: string;
  status?: Status;
  hasAlternateContact?: boolean;
  noEmail?: boolean;
  uploadUrl?: string; // New field
}
```

## Data Models

### URL Mapping Structure
The dialog will maintain a mapping of applicant IDs to their assigned URLs:
```typescript
type UrlMappings = { [applicantId: number]: string };
```

### Validation Rules
- URLs must be valid HTTP/HTTPS format
- Empty URLs are allowed (optional field)
- Invalid URLs will show inline error messages
- "Next" button is enabled regardless of validation state (URLs are optional)

## Error Handling

### URL Validation
- **Invalid Format**: Show inline error message below input field
- **Network Validation**: Not implemented (client-side validation only)
- **Duplicate URLs**: Allowed (no restriction on duplicate URLs across applicants)

### Dialog State Management
- **Unsaved Changes**: No confirmation dialog on cancel (matches existing pattern)
- **Navigation Away**: Dialog closes if user navigates away from page
- **Keyboard Shortcuts**: ESC key closes dialog

### Error Recovery
- **Failed Save**: Show error message and allow retry
- **Component Errors**: Use React error boundaries to prevent app crash
- **State Corruption**: Reset to initial state on component remount

## Testing Strategy

Since this is a prototype application, formal testing will be limited to manual testing during development to ensure basic functionality works as expected.

## UI Design Specifications

### Dialog Layout
- **Modal Overlay**: Semi-transparent black background (matches existing dialogs)
- **Dialog Container**: White rounded container with shadow
- **Header**: Title and close button (X)
- **Content Area**: Scrollable table with applicant data and URL inputs
- **Footer**: Cancel and Next buttons

### Table Structure
| Column | Width | Content |
|--------|-------|---------|
| Rank | Auto | Applicant rank (e.g., "COP 1") |
| Application ID | Auto | Application ID (e.g., "APP-00474767") |
| Full Name | Auto | First + Last name |
| Upload URL | Flexible | Text input field |

### Styling Consistency
- **Colors**: Use existing blue theme (#0077da for primary actions)
- **Typography**: Match existing font sizes and weights
- **Spacing**: Follow existing padding/margin patterns
- **Borders**: Use existing border colors and styles
- **Focus States**: Match existing focus ring styles

### Responsive Behavior
- **Desktop**: Full table layout with all columns visible
- **Tablet**: Maintain table layout with horizontal scroll if needed
- **Mobile**: Stack columns vertically or use horizontal scroll

### Accessibility Features
- **Keyboard Navigation**: Tab through inputs, ESC to close
- **Screen Readers**: Proper ARIA labels and descriptions
- **Focus Management**: Focus first input on open, return focus on close
- **Color Contrast**: Ensure sufficient contrast for all text elements