export default {

  // ============= Zone ============= //

  getAllZones: function (numOfResults) {
    return fetch('https://b87wrelcj3.execute-api.us-east-1.amazonaws.com/Dev/device/?limit=' + numOfResults);
  },

  getZone: function (id, type) {
    return fetch('https://b87wrelcj3.execute-api.us-east-1.amazonaws.com/Dev/device/' + id + '?deviceType=' + type);
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
