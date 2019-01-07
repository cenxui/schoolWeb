export default {


    // ============= Auth ============= //

    getSession: function () {
        window.getAuth().getSession();
    },

    signOut: function () {
        window.getAuth().signOut();
    },

    getIdToken: function () {
        window.getAuth().getSignInUserSession().getIdToken();
    },

    getAccessToken: function () {
        window.getAuth().getSignInUserSession().getAccessToken();
    },

    isUserSignedIn: function () {
        return window.getAuth().isUserSignedIn();
    },

}
