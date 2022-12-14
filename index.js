var SERVER_NAME = 'mapd713'
var PORT = 5000;
var HOST = '127.0.0.1';
var get_counter = 0;
var post_counter = 0;

var restify = require('restify')

  // Get a persistence engine for the images
  , imagesSave = require('save')('images')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
    console.log('\n=================================================================')
    console.log('Server is listening at ', server.name, server.url)
    console.log('Endpoints:')
    console.log(' http://127.0.0.1:5000/images method: GET, POST')
    console.log('------------------------------------------------------------------\n')
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all images in the system
server.get('/images', function (req, res, next) {
  // First, let's log in the console that we have received this GET request
  console.log('> images GET: received request')

  // Find every entity within the given collection
  imagesSave.find({}, function (error, images) {

    // Next, log in the console that we are sending a response
    console.log('< images GET: sending response')

    // Return all of the images in the system
    res.send(images)

    // increment request counter and display
    get_counter++;
    console.log('\n\nProcessed Request Count--> GET:' + get_counter + ', POST:' + post_counter + "\n");
  })
})

// Get a single image using the image id specified
server.get('/images/:id', function (req, res, next) {
  // First, let's log in the console that we have received this GET request
  console.log('> images GET: received request')

  // Then find a single image using the id within save
  imagesSave.findOne({ _id: req.params.id }, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (image) {
      // Send the image if no issues encountered
      // but log it in the console first
      console.log('< images GET: sending response')
      res.send(image)
    } else {
      // Send 404 header if the image doesn't exist
      res.send(404)

      // increment request counter and display
      get_counter++;
      console.log('\n\nProcessed Request Count--> GET:' + get_counter + ', POST:' + post_counter + "\n");
    }
  })
})

// Create a new image record
server.post('/images', function (req, res, next) {
  // First, let's log in the console that we have received this POST request
  console.log('> images POST: received request')

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
    // log in the console first
    console.log('< images POST: sending response')
    res.send(201, image)

    // increment request counter and display
    post_counter++;
    console.log('\n\nProcessed Request Count--> GET:' + get_counter + ', POST:' + post_counter + "\n");
  })
})

// Update a image by their id
server.put('/images/:id', function (req, res, next) {
  // First, let's log in the console that we have received this GET request
  console.log('> images PUT: received request')

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
    // Log it in the console first
    console.log('< images GET: sending response')
    res.send(200)

    // increment request counter and display
    post_counter++;
    console.log('\n\nProcessed Request Count--> GET:' + get_counter + ', POST:' + post_counter + "\n");
  })
})

// Delete image with the given id
server.del('/images/:id', function (req, res, next) {
  // First, let's log in the console that we have received this GET request
  console.log('> images DELETE: received request')

  // Delete the image with the persistence engine
  imagesSave.delete(req.params.id, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    // Log in the console first
    console.log('< images DELETE: sending response')
    res.send()
  })
})


