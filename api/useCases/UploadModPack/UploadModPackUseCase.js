const S3Storage = require('../../providers/implementations/S3Storage');

class UploadModPackUseCase {
  constructor(s3) {
    this.s3 = S3Storage;
  }

  async execute(path) {
      await this.s3.saveFile(path);
  }
}

module.exports = { UploadModPackUseCase };
