'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Photos Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/photos',
      permissions: '*'
    }, {
      resources: '/api/photos/:photoId',
      permissions: '*'
    },{
      resources: '/api/photos/feed/:landmarkId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/photos',
      permissions: ['get', 'post']
    }, {
      resources: '/api/photos/:photoId',
      permissions: ['get']
    },{
      resources: '/api/photos/feed/:landmarkId',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/photos',
      permissions: ['get','post']
    }, {
      resources: '/api/photos/:photoId',
      permissions: ['get']
    },{
      resources: '/api/photos/feed/:landmarkId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Photos Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Photo is being processed and the current user created it then allow any manipulation
  if (req.photo && req.user && req.photo.user && req.photo.user.id === req.user.id) {
    return next();
  }
  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
