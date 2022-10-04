var SERVER_NAME = 'user-api'
var PORT = 5000;
var HOST = '127.0.0.1';


var restify = require('restify')

  // Get a persistence engine for the images
  , imagesSave = require('save')('images')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server is listening at ', server.name, server.url)
  console.log('Endpoints:')
  console.log(' http://127.0.0.1:5000/images method: GET, POST')
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all images in the system
server.get('/images', function (req, res, next) {

  // Find every entity within the given collection
  imagesSave.find({}, function (error, images) {

    // Return all of the images in the system
    res.send(images)
  })
})

// Get a single image using the image id specified
server.get('/images/:id', function (req, res, next) {

  // Find a single image using the id within save
  imagesSave.findOne({ _id: req.params.id }, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (image) {
      // Send the image if no issues encountered
      res.send(image)
    } else {
      // Send 404 header if the image doesn't exist
      res.send(404)
    }
  })
})

// Create a new image record
server.post('/images', function (req, res, next) {

  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('You need to provide the Image name'))
  }
  if (req.params.url === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('You need to provide the Image URL'))
  }
  if (req.params.size === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('You need to provide the size of the image'))
  }
  var newImage = {
		name: req.params.name, 
		url: req.params.url,
    size: req.params.size,
	}

  // Create the user using the persistence engine
  imagesSave.create( newImage, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the image if no issues encountered
    res.send(201, image)
  })
})

// Update a image by their id
server.put('/images/:id', function (req, res, next) {

  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('You need to provide the Image name'))
  }
  if (req.params.url === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('You need to provide the Image URL'))
  }
  if (req.params.size === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('You need to provide the size of the image'))
  }
  
  var newImage = {
		_id: req.params.id,
		name: req.params.name, 
		url: req.params.url,
    size: req.params.size
	}
  
  // Update the image with the persistence engine
  imagesSave.update(newImage, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send(200)
  })
})

// Delete image with the given id
server.del('/images/:id', function (req, res, next) {

  // Delete the image with the persistence engine
  imagesSave.delete(req.params.id, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
})


