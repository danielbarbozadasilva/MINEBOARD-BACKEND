class UploadModPackController {
  constructor(uploadModPackUseCase) {
    this.uploadModPackUseCase = uploadModPackUseCase;
  }

  async handle(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: 'Nenhum arquivo enviado.' });
      }

      const zipFilePath = req.file.path;
      const resultJson = await this.uploadModPackUseCase.execute(zipFilePath);

      return res.status(200).send({ message: 'Sucesso!', data: resultJson });
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message || 'Ocorreu um erro inesperado!' });
    }
  }
}

module.exports = { UploadModPackController };