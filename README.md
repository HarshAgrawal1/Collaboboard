# Collaborative Cloud Whiteboard

A real-time, cloud-based collaborative whiteboard that allows teams or individuals to collaborate visually with live drawing and meeting management. Built using Node.js, Express.js, WebRTC, MongoDB, and Socket.io, this project ensures secure authentication and real-time whiteboard synchronization.

## Features

- **User Authentication** – Secure login/signup with JWT tokens and Cookie-Parser, using Bcrypt for password encryption
- **Create & Join Meetings** – Users can create a new session (becoming the Admin) or join an existing one via a meeting code
- **Real-Time Whiteboard** – Live drawing, erasing, and annotation synchronized across all participants using Socket.io
- **Admin Controls** – Only the Admin can draw on the whiteboard, while participants can view changes
- **Whiteboard Tools** – Includes color selection, line width adjustment, clear canvas, and save as an image
- **Meeting Management** – The Admin can end the meeting, disconnecting all users
- **MongoDB Storage** – Secure storage of user credentials and meeting data

## Tech Stack

* **Backend:** Node.js, Express.js
* **Frontend:** EJS, HTML, CSS, JavaScript
* **Database:** MongoDB
* **Real-Time Communication:** Socket.io
* **Authentication:** JWT, Cookie-Parser, Bcrypt

## Installation & Setup

### 1. Clone the Repository

```sh
git clone https://github.com/your-repo-url.git
cd your-project-folder
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Set Up Environment Variables
Create a .env file in the root directory and configure it:
```sh
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4️. Start the Server
```sh
npm start
```
The app will run on http://localhost:10000.

## Usage Guide
### Creating a Meeting
  Click "Create a Meeting" on the home page.
  Share the meeting code with participants.
### Joining a Meeting
  Enter a valid meeting code in the "Join Meeting" section.
  You will be redirected to the whiteboard as a viewer.
### Whiteboard Controls (Admin Only)
  Draw using the mouse.
  Change color and line width using the toolbar.
  Click Clear to erase the whiteboard.
  Click Save to download the whiteboard as an image.
  Click End Meeting to close the session.
  
## Future Improvements
🚀 Add audio/video support for meetings
🚀 Improve UI/UX for better usability
🚀 Save whiteboard data in MongoDB for future access

## Contributing
Feel free to fork this repository and submit pull requests with improvements!


