var fs = require('fs');

    function generateSHA1ChecksumForFile(filePath) {
        return new Promise((resolve, reject) => {
          const sha1 = crypto.createHash('sha1');
          const stream = fs.createReadStream(filePath);
          stream.on('data', (data) => {
            sha1.update(data);
          });
    
          stream.on('end', () => {
            resolve(sha1.digest('hex'));
          });
      
          stream.on('error', (error) => {
            reject(error);
          });
        });
      }

module.exports = {
 generateSHA1ChecksumForFile,
}
