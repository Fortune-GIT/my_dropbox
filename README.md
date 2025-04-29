# Welcome to My Dropbox
***
NB THIS APP HAS BEEN DEPLOYED ON FIREBASE @ https://dropbox-2be05.web.app/login AND NETLIFY @ https://dropbo.netlify.app/login
YOU CAN VIEW IT THERE

## Task
Build a fully functional Dropbox Clone — a cloud storage web application that allows users to upload, organize, download, preview, and manage files and folders securely.
The challenge was to implement:
Authentication (Signup/Login/Signout)
File Upload and Download (with file size tracking)
Folder Creation and Navigation (including folder backtracking)
Storage Usage Tracking (visual analysis of used space)
Versioning (timestamped filenames for upload history)
Move to Trash and Restore from Trash
Permanent Deletion from Trash
Sharing file links easily
Optimized deployment to Firebase Hosting


## Description
This project provides users with a personal cloud storage platform.
Once signed in, users can:
Create folders to organize files
Upload multiple files at once with live upload progress tracking (MB and %)
Search files and folders easily
Download files instantly
Share file links by copying them to clipboard
Move unwanted files to a Trash/Deleted Files section
Restore deleted files back to their previous folders
Permanently delete files from Trash to free up space
View images in a dedicated Pictures Gallery layout
Track overall storage usage visually
Protect all private files behind a secure login system

The full app was built with:
React + Vite for frontend
Firebase Authentication for signup/login/logout
Firebase Firestore for database management
Firebase Storage for actual file uploads
Firebase Hosting for deployment
Custom Hooks and Context API for clean React state management
Modular Components (Sidebar, Topbar, FileTable, etc.)
CSS for styling 


## Installation
NB THIS APP HAS BEEN DEPLOYED ON FIREBASE @ https://dropbox-2be05.web.app/login AND NETLIFY @ https://dropbo.netlify.app/login
YOU CAN VIEW IT THERE

Installation
Clone the repository:
git clone https://github.com/Fortune-GIT/my_dropbox.git
navigate to the directory

Install dependencies:
npm install
Set up Firebase:
Create a Firebase Project
Enable Authentication (Email/Password)
Set up Firestore Database
Set up Firebase Storage
Copy your Firebase config keys
Replace the config inside src/firebase.js

Run locally:
npm run dev

Build for production:
npm run build

Deploy to Firebase Hosting:
firebase deploy

## Usage
Authentication
Go to /signup to create a new account.
Go to /login to access an existing account.
After login, you are redirected to your cloud file dashboard.

### The Core Team
File & Folder Management
Create Folder: Click Create Folder button on Topbar.
Upload Files: Click Choose Files → then Upload button.
Drag and Drop: Drag files into folders to move them.
Search: Use search bar to find files or folders.
Bulk Delete: Select multiple files using checkboxes and delete them at once.

Pictures Gallery
Navigate to Pictures in Sidebar to view only images (JPG, JPEG, PNG).

Trash Management
Files moved to trash appear in the Deleted Files section.
Restore a file back to original folder by right-clicking inside Trash and selecting Restore.
Empty Trash permanently deletes all trashed files.

Download and Sharing
Download: Click the download icon next to any file to save it locally.
Copy Link: Click the link icon to copy file URL for sharing.

Navigation Guide
Button/Section	What it does
Home	                 View all your files and root folders
Pictures	             View uploaded images only
Shared Files	         (Optional future expansion)
Deleted Files	         Manage trash: restore or empty
Sidebar	                 Quick access to sections
Topbar                 	 Upload files, create folders, logout
Storage Usage	         Visualize used storage

NB THIS APP HAS BEEN DEPLOYED ON FIREBASE @ https://dropbox-2be05.web.app/login AND NETLIFY @ https://dropbo.netlify.app/login
YOU CAN VIEW IT THERE

### The Core Team
Fortune Anosike Ugochukwu

<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>

