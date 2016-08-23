'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Landmarks Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/landmarks',
      permissions: '*'
    }, {
      resources: '/api/landmarks/:landmarkId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/landmarks',
      permissions: ['get', 'post']  //temp allow post for testing. pls remove.
    }, {
      resources: '/api/landmarks/:landmarkId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/landmarks',
      permissions: ['get','post']
    }, {
      resources: '/api/landmarks/:landmarkId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Landmarks Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];


  // If an Landmark is being processed and the current user created it then allow any manipulation
  if (req.landmark && req.user && req.landmark.user && req.landmark.user.id === req.user.id) {
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
