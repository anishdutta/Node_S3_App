const express = require("express");
const app = express();

const multer = require('multer');

const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'ap-south-1' // region of your bucket
});

const s3 = new aws.S3();



const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'awon-banner-images',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + (file.originalname))
    }
  })
})
const singleUpload = upload.single('image')


app.post('/image-upload', function(req, res) {
  
  singleUpload(req, res, function(err, some) {
    if (err) {
      return res.status(422).send(err);
    }

    return res.json({'imageUrl': req.file.location});
  });
})
app.listen(process.env.PORT || 4000, () => {
  console.log(`Example app listening at http://localhost: 4000`);
});
