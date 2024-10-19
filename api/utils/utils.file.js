const multer = require('multer');
const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs-sync');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, `${__dirname}/uploads`);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});

const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 1024 }});

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_BUCKET_REGION
})

function getAllFilesInFolder(folderPath, toIgnore) {
  const files = [];
  function traverseDirectory(currentPath) {
    const items = fs.readdirSync(currentPath);
    items.forEach((item) => {
      if(toIgnore && toIgnore.includes(item)){
        return
      }
      const itemPath = path.join(currentPath, item);
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory()) {
        traverseDirectory(itemPath);
      } else {
        files.push(itemPath);
      }
    });
  }
  traverseDirectory(folderPath);
  return files;
}

module.exports = { upload, s3, getAllFilesInFolder }
