import { Auth } from "aws-amplify";

export default {

  // ============= DEVICES ============= //

  getAllDevices: function (numOfResults) {
    return fetch('https://b87wrelcj3.execute-api.us-east-1.amazonaws.com/Dev/device/?limit=' + numOfResults);
  },

  getDevice: function (id, type) {
    return fetch('https://b87wrelcj3.execute-api.us-east-1.amazonaws.com/Dev/device/' + id + '?deviceType=' + type);
  },

  provisionDevice: function (data) {
    return fetch('https://8g7im4xug9.execute-api.us-east-1.amazonaws.com/Dev/UIProvisionLambda', 
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  },

  // ============= TEMPLATES ============= //

  getAllTemplates: function (query) {
    return fetch('https://21yq8hwg32.execute-api.us-east-1.amazonaws.com/Dev/all', {params: { q: query }});
  },

  getTemplate: function (name) {
    return fetch('https://21yq8hwg32.execute-api.us-east-1.amazonaws.com/Dev/' + name);
  },

  addTemplate: function (data) {
    return fetch('https://21yq8hwg32.execute-api.us-east-1.amazonaws.com/Dev/template',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  },

  // ============= JOBS ============= //

  getAllJobs: function () {
      return Auth.currentSession()
          .then((user)=>{
              return fetch('https://j11zl0kmt6.execute-api.us-east-1.amazonaws.com/dev/job',
                  {
                      method: 'GET',
                      headers: {
                          'Authorization': user.idToken.jwtToken,
                      },
                  });
          });
  },

  getJob: function (name) {
      return fetch('https://j11zl0kmt6.execute-api.us-east-1.amazonaws.com/dev/job/' + name);
  },

  addJob: function (data) {
      return fetch('https://j11zl0kmt6.execute-api.us-east-1.amazonaws.com/dev/job',
          {
              method: 'PUT',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          })
  },

  getAllGroups: function () {
      return fetch('https://j11zl0kmt6.execute-api.us-east-1.amazonaws.com/dev/job/group');
  },
  getAllThings: function () {
      return fetch('https://j11zl0kmt6.execute-api.us-east-1.amazonaws.com/dev/job/thing');
  },

  // ============= ORGANIZATIONS ============= //

  getAllOrgs: function () {
    return fetch('https://mqvux6loff.execute-api.us-east-1.amazonaws.com/Dev/organization');
  },

  getOrg: function (id) {
    return fetch('https://mqvux6loff.execute-api.us-east-1.amazonaws.com/Dev/organization/' + id);
  },

  addOrg: function (data) {
    return fetch('https://mqvux6loff.execute-api.us-east-1.amazonaws.com/Dev/organization',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  },

  
  // ============= EDGE CLIENT / CERTIFICATES ============= //

  getCerts: function (data) {
    return fetch('https://cz2esi8doe.execute-api.us-east-1.amazonaws.com/dev/generatePresignedUrl',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  },

  getEdgeClient: function (query) {
    return fetch('https://i5dq272ljk.execute-api.us-east-1.amazonaws.com/dev/presign_url_edge', {params: { q: query }});
  },


  
  // ============= SHADOW ============= //

  getShadowStatus: function (deviceId) {
    return fetch('https://vb5vnnqukc.execute-api.us-east-1.amazonaws.com/Dev/status',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "deviceId" : String(deviceId),
        "function" : "Status"
      })
    })
  },

 
  updateShadowStatus: function (data) {
    return fetch('https://vb5vnnqukc.execute-api.us-east-1.amazonaws.com/Dev/update',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  },
  
  // ============= USER ============= //

  getAllUsers: function (query) {
    return fetch('https://h1nteztqp0.execute-api.us-east-1.amazonaws.com/Dev/user');
  },

  getUser: function (email) {
    return fetch('https://h1nteztqp0.execute-api.us-east-1.amazonaws.com/Dev/user' + email);
  },

  addUser: function (data) {
    return fetch('https://h1nteztqp0.execute-api.us-east-1.amazonaws.com/Dev/user',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }
      
}
