class UploadModPackUseCase {
  constructor(s3) {
    this.s3 = s3;
  }

  async execute(path) {
    if (!path) {
      throw new Error('O caminho do arquivo não pode ser vazio.');
    }
    return await this.s3.saveFile(path);
  }
}

module.exports = { UploadModPackUseCase };
