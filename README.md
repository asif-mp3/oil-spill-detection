> :warning: This service is still in production.

# Oil Spill Detection
Real Time Oil Spill Detection using AIS & Sentinel-1 SAR Imagery. Built for Smart India Hackathon by Euler6ix.<br>
![image](https://github.com/user-attachments/assets/60c8cbab-0437-4784-a707-c681a549f053)
_Our Front Page (temporary)_
<hr>

## Usage
First, Update the `/backend/app/API_key.txt` file with your API Key from [aisstream](https://aisstream.io/)

Navigate to the `/frontend` directory and run this command:<br>
```
npm run start
```

Then, navigate to the `/backend/app` directory and run:<br>
```
fastapi dev app.py
```

The app runs at `localhost:3000`.

## Todo:
- [x] Add Smooth Scrolling
- [ ] Add User Support (with Login Pages, MySQL backend, Custom User pages)
- [ ] Host the Server
