export default {

    // ============= Zones ============= //

    getIdToken: function () {
        window.getAuth().getIdToken();
    },

    getAccessToken: function () {
        window.getAuth().getAccessToken();
    },

    refreshSession: function () {
        window.getAuth().refreshSession();
    },

    getSession: function () {
        window.getAuth().getSession();
    },

    signOut: function () {
        window.getAuth().signOut();
    },
}
