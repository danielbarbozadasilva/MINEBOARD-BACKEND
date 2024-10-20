const { upload } = require('../utils/utils.file');
const { uploadModPackController } = require('../useCases/UploadModPack');

module.exports = (app, db) => {
  app.post('/upload', upload.single('arquivoZip'), async (req, res) => {    
    await uploadModPackController.handle(req, res);
  });
}
