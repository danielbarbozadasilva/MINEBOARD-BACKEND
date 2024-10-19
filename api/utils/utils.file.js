const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, callback) =>
    callback(null, `${__dirname}/../utils/file/image`),
  filename: (req, file, callback) =>
    callback(null, `${file.fieldname}-${Date.now()}.jpg`)
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

const upload = multer({ storage })

module.exports = {
  upload,
  getAllFilesInFolder
}
