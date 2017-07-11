const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const db = require('../routes/api/db');

function findUser(email, callback) {
  var sql = "SELECT u.id as id, u.firstName, u.lastName, u.email, u.mobile, r.name as role, u.password FROM public.user u INNER JOIN public.role r ON r.id = u.role_id WHERE u.email = $1::text";
  var params = [email];
  db.query(sql, params, function (err, json) {
    // Handle error
    if (err) {
      return callback(err, null);
    }

    var user = json[0];

    return callback(null, user ? JSON.parse(JSON.stringify(user)) : null)
  });
}

passport.serializeUser(function (user, done) {
  done(null, user.email);
})

passport.deserializeUser(function (email, done) {
  findUser(email, done);
})

function initPassport() {
  passport.use('login', new LocalStrategy({
      passReqToCallback: true,
      usernameField: 'email',
      passwordField: 'password'
    },
    function (req, username, password, done) {
      findUser(username, function (err, user) {
        // Handle error
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, req.flash('message', 'Incorrect username.'));
        }
        if (password !== user.password) {
          return done(null, false, req.flash('message', 'Incorrect password.'));
        }
        delete user.password;
        req.session.user = user;
        return done(null, user);
      })
    }
  ));

  passport.use('signup', new LocalStrategy({
      passReqToCallback: true,
      usernameField: 'email',
      passwordField: 'password'
    },
    function (req, username, password, done) {
      findUser(username, function (err, user) {
        // Handle error
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, req.flash('message', 'Email taken.'));
        }
        if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.mobile || !req.body.password) {
          return done(null, false, req.flash('message', 'Missing parameters.'));
        }

        var sql = "INSERT INTO public.user (firstName, lastName, email, mobile, password) VALUES ($1::text, $2::text, $3::text, $4::text, $5::text)";
        var params = [req.body.firstName, req.body.lastName, req.body.email, req.body.mobile, req.body.password];
        db.query(sql, params, function (err, json) {
          // Handle error
          if (err) {
            return done(err);
          }

          findUser(username, function (err, user) {
            // Handle error
            if (err) {
              return done(err);
            }
            if (!user) {
              return done(null, false, req.flash('message', 'User not found.'));
            }
            delete user.password;
            req.session.user = user;
            return done(null, user);
          });
        });
      });
    }
  ));
}

module.exports = initPassport;
