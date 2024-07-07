const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

const app = express();
const s3 = new AWS.S3();

app.use(express.json());

// Upload file
app.post('/upload', upload.single('file'), (req, res) => {
  const fileContent = fs.readFileSync(req.file.path);
  const params = {
    Bucket: 'your-bucket-name',
    Key: req.file.originalname,
    Body: fileContent,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading file:', err);
      res.status(500).send(err);
    } else {
      res.send(`File uploaded successfully. ${data.Location}`);
    }
  });
});

// List files
app.get('/files', (req, res) => {
  const params = {
    Bucket: 'your-bucket-name',
  };

  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      console.error('Error listing files:', err);
      res.status(500).send(err);
    } else {
      res.send(data.Contents.map(file => file.Key));
    }
  });
});

// Download file
app.get('/download/:fileName', (req, res) => {
  const params = {
    Bucket: 'your-bucket-name',
    Key: req.params.fileName,
  };

  s3.getObject(params, (err, data) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).send(err);
    } else {
      res.send(data.Body.toString());
    }
  });
});

// Delete file
app.delete('/delete/:fileName', (req, res) => {
  const params = {
    Bucket: 'your-bucket-name',
    Key: req.params.fileName,
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.error('Error deleting file:', err);
      res.status(500).send(err);
    } else {
      res.send('File deleted successfully');
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});