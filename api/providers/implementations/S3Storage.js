const unzipper = require('unzipper');
const crypto = require('crypto');
const fs = require('fs');
const { PassThrough } = require('stream');
const AWS = require('aws-sdk');
const { s3 } = require('../../utils/utils.file');

class S3Storage {
  
  constructor () {
    this.client = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_BUCKET_REGION
    })
  }

  async saveFile(filepath) {
    let uploadPromises = [];
  
    fs.createReadStream(filepath).pipe(unzipper.Parse()).on('entry', (entry) => {
        const caminhoRelativo = entry.path;
        const type = entry.type;
  
        if (type === 'File') {

          const hash = crypto.createHash('sha1');
          const pass = new PassThrough();
  
          entry.on('data', (chunk) => {
            hash.update(chunk);
          });
  
          const entryEndPromise = new Promise((resolve, reject) => {
            entry.on('end', () => {
              const sha1 = hash.digest('hex');
              resolve(sha1);
            });
            entry.on('error', (err) => {
              reject(err);
            });
          });
  
          const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: caminhoRelativo,
            Body: pass,
          };
  
          const uploadPromise = s3.upload(params).promise();
  
          entry.pipe(pass);
  
          const combinedPromise = Promise.all([uploadPromise, entryEndPromise])
            .then(([uploadData, sha1]) => {
              return {
                url: `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${encodeURIComponent(caminhoRelativo)}`,
                size: entry.vars.uncompressedSize,
                hash: sha1,
                path: caminhoRelativo,
              };
            })
            .catch(err => {
              throw new Error('Erro ao fazer upload para o S3 ou calcular o hash:', err);
            });
  
          uploadPromises.push(combinedPromise);
  
        } else {
          entry.autodrain();
        }
      })
      .on('close', async () => {
        try {
          const listaArquivos = await Promise.all(uploadPromises);
          fs.unlink(filepath, (err) => {
            if (err) console.error('Erro ao deletar o arquivo zipado:', err);
          });
          
          console.log(listaArquivos);
          
          // TODO: NÃO RETORNA A LISTA
          return listaArquivos;
  
        } catch (err) {
          throw new Error('Erro ao fazer upload para o S3.', err);
        }
      })
    }
}

module.exports = S3Storage;
