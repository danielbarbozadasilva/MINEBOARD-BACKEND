const { UploadModPackUseCase } = require('./UploadModPackUseCase');

class UploadModPackController {
  constructor(uploadModPackUseCase) {
    this.uploadModPackUseCase = UploadModPackUseCase;
  }

  async handle(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: 'Nenhum arquivo enviado.' });
      }

      const zipFilePath = req.file.path;
      
      const result = await this.uploadModPackUseCase.execute(zipFilePath);

      return res.status(200).send({ message: 'Sucesso!', data: result });
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message || 'Ocorreu um erro inesperado!' });
    }
  }
}

module.exports = { UploadModPackController };
