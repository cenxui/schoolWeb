export default {

  // ============= Zones ============= //

    getAllZones: function (numOfResults) {
    return fetch('https://todo?limit=' + numOfResults);
    },

    getZone: function (id, type) {
    return fetch('https://todo' + id + '?deviceType=' + type);
    },

    addZone: function (numOfResults) {
      return fetch('https://todo?limit=' + numOfResults);
    },

    editZone: function (id, type) {
      return fetch('https://todo' + id + '?deviceType=' + type);
    },

    deleteZone: function (id, type) {
      return fetch('https://todo' + id + '?deviceType=' + type);
    },

    // ============= Zone Templates ============= //

    getAllZoneTemplates: function (numOfResults) {
        return fetch('https://todo?limit=' + numOfResults);
    },

    getZoneTemplate: function (id, type) {
        return fetch('https://todo' + id + '?deviceType=' + type);
    },

    addZoneTemplate: function (numOfResults) {
        return fetch('https://todo?limit=' + numOfResults);
    },

    deleteZoneTemplate: function (id, type) {
        return fetch('https://todo' + id + '?deviceType=' + type);
    },

    // ============= BookedPosition ============= //

    getAllBookedPositions: function (numOfResults) {
        return fetch('https://todo?limit=' + numOfResults);
    },

    getBookedPosition: function (id, type) {
        return fetch('https://todo' + id + '?deviceType=' + type);
    },

    addBookedPosition: function (numOfResults) {
        return fetch('https://todo?limit=' + numOfResults);
    },

    editBookedPosition: function (id, type) {
        return fetch('https://todo' + id + '?deviceType=' + type);
    },

    deleteBookedPosition: function (id, type) {
        return fetch('https://todo' + id + '?deviceType=' + type);
    },


    // ============= ORGANIZATIONS ============= //

    getAllOrgs: function () {
    return fetch('index');
    },

    getOrg: function (id) {
    return fetch('https://todo/' + id);
    },

    addOrg: function (data) {
    return fetch('https://todo',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    },

    editOrg: function (data) {
      return fetch('https://todo',
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
    return fetch('https://todo');
    },

    getUser: function (email) {
    return fetch('https://todo' + email);
    },

    addUser: function (data) {
    return fetch('https://todo',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    },

    editUser: function (data) {
      return fetch('https://todo',
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
