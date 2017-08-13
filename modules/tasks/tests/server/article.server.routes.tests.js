'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Article = mongoose.model('Article'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, project;

/**
 * Article routes tests
 */
describe('Article CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new project
    user.save(function () {
      project = {
        title: 'Article Title',
        content: 'Article Content'
      };

      done();
    });
  });

  it('should be able to save an project if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new project
        agent.post('/api/projects')
          .send(project)
          .expect(200)
          .end(function (articleSaveErr, articleSaveRes) {
            // Handle project save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Get a list of projects
            agent.get('/api/projects')
              .end(function (articlesGetErr, articlesGetRes) {
                // Handle project save error
                if (articlesGetErr) {
                  return done(articlesGetErr);
                }

                // Get projects list
                var projects = articlesGetRes.body;

                // Set assertions
                (projects[0].user._id).should.equal(userId);
                (projects[0].title).should.match('Article Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an project if not logged in', function (done) {
    agent.post('/api/projects')
      .send(project)
      .expect(403)
      .end(function (articleSaveErr, articleSaveRes) {
        // Call the assertion callback
        done(articleSaveErr);
      });
  });

  it('should not be able to save an project if no title is provided', function (done) {
    // Invalidate title field
    project.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new project
        agent.post('/api/projects')
          .send(project)
          .expect(400)
          .end(function (articleSaveErr, articleSaveRes) {
            // Set message assertion
            (articleSaveRes.body.message).should.match('Title cannot be blank');

            // Handle project save error
            done(articleSaveErr);
          });
      });
  });

  it('should be able to update an project if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new project
        agent.post('/api/projects')
          .send(project)
          .expect(200)
          .end(function (articleSaveErr, articleSaveRes) {
            // Handle project save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Update project title
            project.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing project
            agent.put('/api/projects/' + articleSaveRes.body._id)
              .send(project)
              .expect(200)
              .end(function (articleUpdateErr, articleUpdateRes) {
                // Handle project update error
                if (articleUpdateErr) {
                  return done(articleUpdateErr);
                }

                // Set assertions
                (articleUpdateRes.body._id).should.equal(articleSaveRes.body._id);
                (articleUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of projects if not signed in', function (done) {
    // Create new project model instance
    var articleObj = new Article(project);

    // Save the project
    articleObj.save(function () {
      // Request projects
      request(app).get('/api/projects')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single project if not signed in', function (done) {
    // Create new project model instance
    var articleObj = new Article(project);

    // Save the project
    articleObj.save(function () {
      request(app).get('/api/projects/' + articleObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', project.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single project with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/projects/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Article is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single project which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent project
    request(app).get('/api/projects/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No project with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an project if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new project
        agent.post('/api/projects')
          .send(project)
          .expect(200)
          .end(function (articleSaveErr, articleSaveRes) {
            // Handle project save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Delete an existing project
            agent.delete('/api/projects/' + articleSaveRes.body._id)
              .send(project)
              .expect(200)
              .end(function (articleDeleteErr, articleDeleteRes) {
                // Handle project error error
                if (articleDeleteErr) {
                  return done(articleDeleteErr);
                }

                // Set assertions
                (articleDeleteRes.body._id).should.equal(articleSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an project if not signed in', function (done) {
    // Set project user
    project.user = user;

    // Create new project model instance
    var articleObj = new Article(project);

    // Save the project
    articleObj.save(function () {
      // Try deleting project
      request(app).delete('/api/projects/' + articleObj._id)
        .expect(403)
        .end(function (articleDeleteErr, articleDeleteRes) {
          // Set message assertion
          (articleDeleteRes.body.message).should.match('User is not authorized');

          // Handle project error error
          done(articleDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Article.remove().exec(done);
    });
  });
});
