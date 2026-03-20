# Tomwm Personal Website

A minimalist personal website serving as a writing-focused digital home for Tom Wynne-Morgan.

## Core Features

### Public Pages
- **Home Page**: Displays a short introduction and features one selected essay
- **About Page**: Contains long-form biographical text
- **Writing Page**: Shows a list of essays with titles, publication dates, and tags
- **Contact Page**: Simple layout with contact information and links to email, LinkedIn, and Bluesky

### Admin Panel
- Password-protected administrative interface
- Tabbed navigation for editing each page (Home, About, Writing, Contact)
- Content editing capabilities for all page titles, subtitles, and main content with proper save functionality
- Essay management: add, edit, and delete essays with title, excerpt, and tags
- Ability to select which essay is featured on the home page
- **Save Button State Management**: Save Changes button must be disabled by default and only become active when content fields (title, subtitle, content) are modified
- **Proper Backend Integration**: Save button must correctly trigger updatePageContent backend call with proper page key ("home", "about", or "contact")
- **Save Feedback**: Display clear success or error toast notifications when saving content
- **Admin Role Validation**: Logged-in admin users must always be able to edit and save content with proper role verification
- **Consistent UX**: All editors (Home, About, Contact) must maintain consistent enabled/disabled button states reflecting real saving conditions
- **Instant Updates**: Content changes must be reflected immediately on public pages without refresh
- **Cache Management**: Properly update React Query cache after successful saves

### Admin Access Control
- **Header Navigation**: Admin link must appear in header navigation only when user has admin role
- **Role Verification**: Header must check `isCallerAdmin` backend query to determine admin status
- **Access Guard**: `/admin` route must be protected with proper access control
- **Unauthorized Access**: Users without admin privileges attempting to access `/admin` must be redirected to Home page with appropriate messaging
- **Dynamic UI**: Admin navigation link visibility must update based on current user's role status

## Data Storage
The backend must store:
- Page content (titles, subtitles, main text for each page)
- Essay collection (title, excerpt, tags, publication date, featured status)
- Contact information and social media links
- Admin authentication credentials
- Site branding information (site name: "Tomwm")

## Backend Requirements
- **updatePageContent** method: Must properly save page content updates for Home, About, and Contact pages with correct page key validation
- **updateContactInfo** method: Must properly save contact information updates
- **isCallerAdmin** query: Must return current caller's admin role status for frontend authorization checks
- **Site Owner Admin Assignment**: The backend must explicitly and persistently assign the currently logged-in Internet Identity principal as `#admin` when the user logs in or initializes, ensuring the site owner (Tom's logged-in identity) always has admin privileges
- **Persistent Admin Status**: Update the `AccessControl.initialize` or equivalent initialization logic to always call `state.userRoles.add(caller, #admin)` when the principal matches the site owner's identity, allowing re-establishment of admin status if the same principal reconnects
- **Safe Admin Management**: Include a safe check preventing multiple different admins from overwriting existing roles, but allow the same principal to re-establish admin status
- **Owner Identity Protection**: Ensure that the site owner's Internet Identity principal consistently maintains admin privileges and can manage all site content
- **Automatic Role Initialization**: All admin-only endpoints (`updatePageContent`, `updateContactInfo`, etc.) must automatically initialize new users with appropriate roles before performing authorization checks
- **Fixed AccessControl.initialize**: The initialization function must handle new users gracefully without trapping, ensuring that unregistered principals are assigned valid roles and stored in the system
- **Seamless Admin Access**: The site owner must be able to immediately access admin functionality without manual initialization or additional setup steps
- **Authorization Fix**: Role assignments must persist across all backend functions requiring authorization, preventing "Unauthorized" errors when updating page content or contact information
- **Admin role verification**: Backend must validate admin permissions for all update operations
- All update methods must return success/error status for frontend feedback with proper error handling
- Data persistence must be reliable and immediate

## Design Requirements
- Editorial typography using serif fonts for body text and sans-serif for navigation
- Generous white space with consistent vertical rhythm
- Background gradient from white to subtle purple-blue
- Responsive design optimized for readability
- Fast-loading and lightweight implementation
- **Consistent Layout**: All pages (Home, About, Writing, Contact) must share identical horizontal and vertical margins, padding, and content centering
- Site name "Tomwm" displayed in header and title across all pages
- Layout styling must remain consistent after content edits

## Technical Notes
- All content editing happens through the admin panel
- No user registration - single admin access only
- Static essay list initially (no full essay content storage required)
- Contact links should be clickable and properly formatted
- Site language: English
- Admin panel editors must properly integrate with backend save methods
- React Query cache invalidation required after successful saves
- Form state management must track content modifications to control save button activation
- Admin panel access must be properly guarded with role-based authorization
- Frontend routing must handle unauthorized admin access attempts gracefully
- Automatic user initialization ensures seamless role assignment for the site owner's authenticated identity without manual setup
- Backend authorization logic must include appropriate comments clarifying that this ensures the site owner (Tom's logged-in identity) always has admin privileges and can manage all site content
