const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const fs = require("fs");
const path = require("path");
const VideoModel = require('./models/videos');
const RegisterModel = require("./models/register");
const SubscribeModel = require('./models/subscribe');
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/videoStreamingAppDb");

app.post('/subscribe', async (req, res) => {
    const { email, plan, amount } = req.body;
    const startDate = new Date();
    let expiryDate;

    if (plan === 30) {
        expiryDate = new Date(startDate);
        expiryDate.setDate(expiryDate.getDate() + 30);
    } else if (plan === 365) {
        expiryDate = new Date(startDate);
        expiryDate.setDate(expiryDate.getDate() + 365);
    } else {
        return res.status(400).json({ message: 'Invalid plan' });
    }

    try {
        const newSubscription = new SubscribeModel({
            email,
            plan,
            startDate,
            expiryDate,
            amount
        });

        await newSubscription.save();

        await RegisterModel.findOneAndUpdate(
            { email },
            { profileType: 'premium' }
        );

        res.status(200).json({ message: 'Subscription successful' });
    } catch (error) {
        console.error('Error processing subscription:', error);
        res.status(500).json({ message: 'Subscription failed. Please try again.' });
    }
});

// Update the reference to the correct model
app.get('/subscriptions', async (req, res) => {
  try {
    const subscriptions = await SubscribeModel.find();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscriptions', error });
  }
});



app.post('/login', (req, res)=>{
    const {email, password} = req.body;
    RegisterModel.findOne({email: email}).then(user=>{
        if(user){
         
        if(user.password === password && user.email === email){
            res.json("Success");
        }else{
            res.json("The password is incorrect!");
        }
    } else{
        res.json("No record existed");
    }
    })
});

app.post('/register', (req, res)=>{
    RegisterModel.create(req.body).then(register => {res.json(register)}).catch(err => {res.json(err)});
});

const regularStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './Videos');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

const premiumStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './PremiumVideos');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

const uploadRegular = multer({storage: regularStorage}).single('file');
const uploadPremium = multer({storage: premiumStorage}).single('file');

app.post('/upload', (req, res) => {
    uploadRegular(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ message: 'Error uploading regular video' });
        } else if (err) {
            return res.status(500).json({ message: 'Error uploading regular video' });
        }

        const { title, description } = req.body;
        const newVideo = new VideoModel({
            title,
            description,
            videoPath: req.file.filename, // Store only the filename
            videoType: 'standard',
            uploadDate: Date.now()
        });

        newVideo.save()
            .then(() => {
                res.status(200).json({ message: 'Standard video uploaded successfully' });
            })
            .catch((err) => {
                res.status(500).json({ message: 'Error saving video details' });
            });
    });
});

app.post('/uploadPremiumVideo', (req, res) => {
    uploadPremium(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ message: 'Error uploading premium video' });
        } else if (err) {
            return res.status(500).json({ message: 'Error uploading premium video' });
        }

        const { title, description } = req.body;
        const newVideo = new VideoModel({
            title,
            description,
            videoPath: req.file.filename, // Store only the filename
            videoType: 'premium',
            uploadDate: Date.now()
        });

        newVideo.save()
            .then(() => {
                res.status(200).json({ message: 'Premium video uploaded successfully' });
            })
            .catch((err) => {
                res.status(500).json({ message: 'Error saving video details' });
            }); 
    });
});

// In your Express backend, add this route
// Route to get users by profile type
app.get('/users/:profileType', (req, res) => {
  const profileType = req.params.profileType;
  RegisterModel.find({ profileType })
    .then(users => {
      if (users.length === 0) {
        return res.status(404).json("No record existed");
      }
      res.json(users);
    })
    .catch(err => {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

app.get('/videoFilenames', async (req, res) => {
  try {
      const videos = await VideoModel.find({}, 'videoPath -_id'); // Fetch only the videoPath field
      const filenames = videos.map(video => video.videoPath);
      res.json(filenames);
  } catch (err) {
      console.error("Error fetching video filenames:", err);
      res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/emails', async (req, res) => {
  try {
    const emails = await RegisterModel.find({}, 'email -_id'); // Fetch only the email field
    res.json(emails.map(email => email.email));
  } catch (err) {
    console.error("Error fetching emails:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/updateName/:email', async (req, res) => {
  const { email } = req.params;
  const { newName } = req.body;

  try {
    // Find user by email and update name
    const user = await RegisterModel.findOneAndUpdate(
      { email },
      { name: newName },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ name: user.name });
  } catch (error) {
    console.error('Error updating user name:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get all videos
app.get('/videos', (req, res) => {
    VideoModel.find()
        .then(videos => {
            res.json(videos);
        })
        .catch(err => {
            console.error("Error fetching videos:", err);
            res.status(500).json({ error: "Internal server error" });
        });
});

app.get('/stdVideos', (req, res) => {
    VideoModel.find({ videoType: 'standard' }) // Filter for standard videos
        .then(videos => {
            res.json(videos);
        })
        .catch(err => {
            console.error("Error fetching videos:", err);
            res.status(500).json({ error: "Internal server error" });
        });
});

app.get('/premVideos', (req, res) => {
    VideoModel.find({ videoType: 'premium' }) // Filter for standard videos
        .then(videos => {
            res.json(videos);
        })
        .catch(err => {
            console.error("Error fetching videos:", err);
            res.status(500).json({ error: "Internal server error" });
        });
});



app.post("/deleteVideo", async (req, res) => {
    const { videoId, videoPath, videoType } = req.body;
  
    try {
      const video = await VideoModel.findById(videoId);
  
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
  
      // Delete video file from the file system based on video type
      if (videoPath) {
        const filePath = path.join(__dirname, videoType === "standard" ? "Videos" : "PremiumVideos", videoPath);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting video file:", err);
          } else {
            console.log("Video file deleted successfully");
          }
        });
      }
  
      // Delete video record from the database
      await VideoModel.findByIdAndDelete(videoId);
  
      res.status(200).json({ message: "Video deleted successfully" });
    } catch (error) {
      console.error("Error deleting video:", error);
      res.status(500).json({ message: "Error deleting video" });
    }
  });
  

  app.get('/videos/:filename', (req, res) => {
    const filename = req.params.filename;
    const videoPath = path.join(__dirname, 'Videos', filename);
  
    fs.stat(videoPath, (err, stats) => {
      if (err) {
        console.error('Error fetching video file:', err);
        return res.status(404).send('Video not found!');
      }
  
      const fileSize = stats.size;
      const range = req.headers.range;
  
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        };
  
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        };
  
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
      }
    });
  });

  app.get('/videoByTitle/:title', (req, res) => {
    const title = req.params.title;
    VideoModel.findOne({ title })
        .then(video => {
            if (!video) {
                return res.status(404).json({ message: "Video not found" });
            }
            res.json(video);
        })
        .catch(err => {
            console.error("Error fetching video:", err);
            res.status(500).json({ error: "Internal server error" });
        });
});

// In your Express backend, add this route
app.get('/user/:email', (req, res) => {
  const email = req.params.email;
  RegisterModel.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    })
    .catch(err => {
      console.error("Error fetching user:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

// In your Express backend, add this route
app.delete('/user/:email', (req, res) => {
  const email = req.params.email;
  RegisterModel.findOneAndDelete({ email })
    .then(result => {
      if (!result) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "Your profile is deleted successfully, we feel sad about your leaving." });
    })
    .catch(err => {
      console.error("Error deleting user:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});


  app.get('/premiumvideos/:filename', (req, res) => {
    const filename = req.params.filename;
    const videoPath = path.join(__dirname, 'PremiumVideos', filename);
  
    fs.stat(videoPath, (err, stats) => {
      if (err) {
        console.error('Error fetching video file:', err);
        return res.status(404).send('Video not found!');
      }
  
      const fileSize = stats.size;
      const range = req.headers.range;
  
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        };
  
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        };
  
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
      }
    });
  });
  // Route to get video by title
  app.get('/videoByTitle/:title', (req, res) => {
    const title = req.params.title;
    VideoModel.findOne({ title })
      .then(video => {
        if (!video) {
          return res.status(404).json({ message: "Video not found" });
        }
        res.json(video);
      })
      .catch(err => {
        console.error("Error fetching video:", err);
        res.status(500).json({ error: "Internal server error" });
      });
  });
  
  
  app.get("/getVideo/:id", (req, res)=>{
    const id = req.params.id;
    VideoModel.findById({_id:id}).then((users)=> res.json(users)).catch((err)=>res.json(err));
});

app.post("/updateVideo/:id", (req, res)=>{
    const id = req.params.id;
    VideoModel.findByIdAndUpdate({_id:id}, {title: req.body.title, description: req.body.description}).then((users)=> res.json(users)).catch((err)=>res.json(err));
});  
  

app.listen(3001, () => {
    console.log("express server is running on port 3001");
});
