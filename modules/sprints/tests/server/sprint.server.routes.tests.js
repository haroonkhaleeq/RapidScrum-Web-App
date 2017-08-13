'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Sprint = mongoose.model('Sprint'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, sprint;

/**
 * Sprint routes tests
 */
describe('Sprint CRUD tests', function () {

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

    // Save a user to the test db and create new sprint
    user.save(function () {
      sprint = {
        title: 'Sprint Title',
        content: 'Sprint Content'
      };

      done();
    });
  });

  it('should be able to save an sprint if logged in', function (done) {
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

        // Save a new sprint
        agent.post('/api/sprints')
          .send(sprint)
          .expect(200)
          .end(function (sprintSaveErr, sprintSaveRes) {
            // Handle sprint save error
            if (sprintSaveErr) {
              return done(sprintSaveErr);
            }

            // Get a list of sprints
            agent.get('/api/sprints')
              .end(function (sprintsGetErr, sprintsGetRes) {
                // Handle sprint save error
                if (sprintsGetErr) {
                  return done(sprintsGetErr);
                }

                // Get sprints list
                var sprints = sprintsGetRes.body;

                // Set assertions
                (sprints[0].user._id).should.equal(userId);
                (sprints[0].title).should.match('Sprint Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an sprint if not logged in', function (done) {
    agent.post('/api/sprints')
      .send(sprint)
      .expect(403)
      .end(function (sprintSaveErr, sprintSaveRes) {
        // Call the assertion callback
        done(sprintSaveErr);
      });
  });

  it('should not be able to save an sprint if no title is provided', function (done) {
    // Invalidate title field
    sprint.title = '';

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

        // Save a new sprint
        agent.post('/api/sprints')
          .send(sprint)
          .expect(400)
          .end(function (sprintSaveErr, sprintSaveRes) {
            // Set message assertion
            (sprintSaveRes.body.message).should.match('Title cannot be blank');

            // Handle sprint save error
            done(sprintSaveErr);
          });
      });
  });

  it('should be able to update an sprint if signed in', function (done) {
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

        // Save a new sprint
        agent.post('/api/sprints')
          .send(sprint)
          .expect(200)
          .end(function (sprintSaveErr, sprintSaveRes) {
            // Handle sprint save error
            if (sprintSaveErr) {
              return done(sprintSaveErr);
            }

            // Update sprint title
            sprint.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing sprint
            agent.put('/api/sprints/' + sprintSaveRes.body._id)
              .send(sprint)
              .expect(200)
              .end(function (sprintUpdateErr, sprintUpdateRes) {
                // Handle sprint update error
                if (sprintUpdateErr) {
                  return done(sprintUpdateErr);
                }

                // Set assertions
                (sprintUpdateRes.body._id).should.equal(sprintSaveRes.body._id);
                (sprintUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of sprints if not signed in', function (done) {
    // Create new sprint model instance
    var sprintObj = new Sprint(sprint);

    // Save the sprint
    sprintObj.save(function () {
      // Request sprints
      request(app).get('/api/sprints')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single sprint if not signed in', function (done) {
    // Create new sprint model instance
    var sprintObj = new Sprint(sprint);

    // Save the sprint
    sprintObj.save(function () {
      request(app).get('/api/sprints/' + sprintObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', sprint.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single sprint with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sprints/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Sprint is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single sprint which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent sprint
    request(app).get('/api/sprints/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No sprint with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an sprint if signed in', function (done) {
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

        // Save a new sprint
        agent.post('/api/sprints')
          .send(sprint)
          .expect(200)
          .end(function (sprintSaveErr, sprintSaveRes) {
            // Handle sprint save error
            if (sprintSaveErr) {
              return done(sprintSaveErr);
            }

            // Delete an existing sprint
            agent.delete('/api/sprints/' + sprintSaveRes.body._id)
              .send(sprint)
              .expect(200)
              .end(function (sprintDeleteErr, sprintDeleteRes) {
                // Handle sprint error error
                if (sprintDeleteErr) {
                  return done(sprintDeleteErr);
                }

                // Set assertions
                (sprintDeleteRes.body._id).should.equal(sprintSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an sprint if not signed in', function (done) {
    // Set sprint user
    sprint.user = user;

    // Create new sprint model instance
    var sprintObj = new Sprint(sprint);

    // Save the sprint
    sprintObj.save(function () {
      // Try deleting sprint
      request(app).delete('/api/sprints/' + sprintObj._id)
        .expect(403)
        .end(function (sprintDeleteErr, sprintDeleteRes) {
          // Set message assertion
          (sprintDeleteRes.body.message).should.match('User is not authorized');

          // Handle sprint error error
          done(sprintDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Sprint.remove().exec(done);
    });
  });
});
