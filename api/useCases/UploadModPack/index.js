const { UploadModPackController } = require('./UploadModPackController');
const { UploadModPackUseCase } = require('./UploadModPackUseCase');
const S3Storage = require('../../providers/implementations/S3Storage');

const s3 = new S3Storage();
const uploadModPackUseCase = new UploadModPackUseCase(s3);
const uploadModPackController = new UploadModPackController(uploadModPackUseCase);

module.exports = { uploadModPackUseCase, uploadModPackController };
