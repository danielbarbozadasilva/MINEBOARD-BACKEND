


const updateCategoryController = async (req, res) => {
  const { files } = req
  console.log(files);
 
  const code = resultService.success ? 200 : 400
  const message = resultService.success
    ? { message: resultService.message }
    : { details: resultService.details }
  const data = resultService.data ? resultService.data : ''
  return res.status(code).send({ message, data })
}


module.exports = {

  updateCategoryController,
}
