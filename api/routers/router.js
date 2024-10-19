const { upload, s3 } = require('../utils/utils.file');
const unzipper = require('unzipper');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const { PassThrough } = require('stream');

module.exports = (app, db) => {
  app.post('/upload', upload.single('arquivoZip'), async (req, res) => {
    if (!req.file) {
      return res.status(400).send('Nenhum arquivo enviado.');
    }
  
    const zipFilePath = req.file.path;
  
    let uploadPromises = [];
  
    fs.createReadStream(zipFilePath)
      .pipe(unzipper.Parse())
      .on('entry', (entry) => {
        const caminhoRelativo = entry.path;
        const type = entry.type;
  
        if (type === 'File') {
          // Criar um hash SHA1
          const hash = crypto.createHash('sha1');
  
          // Criar um PassThrough stream para calcular o hash e enviar para o S3
          const pass = new PassThrough();
  
          // Atualizar o hash conforme os dados passam
          entry.on('data', (chunk) => {
            hash.update(chunk);
          });
  
          // Quando o entry stream termina, obter o hash SHA1
          const entryEndPromise = new Promise((resolve, reject) => {
            entry.on('end', () => {
              const sha1 = hash.digest('hex');
              resolve(sha1);
            });
            entry.on('error', (err) => {
              reject(err);
            });
          });
  
          // Configuração para upload no Amazon S3 (sem o ACL)
          const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: caminhoRelativo,
            Body: pass,
          };
  
          // Iniciar o upload para o S3
          const uploadPromise = s3.upload(params).promise();
  
          // Pipe o entry para o PassThrough
          entry.pipe(pass);
  
          // Combinar as promessas de upload e cálculo de hash
          const combinedPromise = Promise.all([uploadPromise, entryEndPromise])
            .then(([uploadData, sha1]) => {
              return {
                // URL pública baseada no caminho do objeto
                url: `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${encodeURIComponent(caminhoRelativo)}`,
                size: entry.vars.uncompressedSize, // Tamanho original do arquivo
                hash: sha1,
                path: caminhoRelativo,
              };
            })
            .catch(err => {
              console.error('Erro ao fazer upload para o S3 ou calcular o hash:', err);
              throw err;
            });
  
          // Adicionar o combinedPromise ao array de promessas
          uploadPromises.push(combinedPromise);
  
        } else {
          // É um diretório, descartar
          entry.autodrain();
        }
      })
      .on('close', async () => {
        // Aguarda todos os uploads e cálculos de hash terminarem
        try {
          // Espera todas as promessas serem resolvidas e coleta as informações dos arquivos
          const listaArquivos = await Promise.all(uploadPromises);
  
          // Excluir o arquivo zipado do disco após o processamento
          fs.unlink(zipFilePath, (err) => {
            if (err) console.error('Erro ao deletar o arquivo zipado:', err);
          });
  
          // Retornar a lista em formato JSON
          res.json(listaArquivos);
  
        } catch (err) {
          console.error('Erro ao fazer upload para o S3:', err);
          res.status(500).send('Erro ao fazer upload para o S3.');
        }
      })
      .on('error', (err) => {
        console.error('Erro ao processar o arquivo zipado:', err);
        res.status(500).send('Erro ao processar o arquivo.');
      });
  });
}
