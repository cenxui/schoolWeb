import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import App from './App';
import Amplify from "aws-amplify";
import { Authenticator, SignIn, RequireNewPassword, ForgotPassword} from 'aws-amplify-react';
import config from "./config";
import * as serviceWorker from './serviceWorker';

Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
});

ReactDOM.render(
    <Authenticator hideDefault={true}>
        <SignIn/>
        <RequireNewPassword/>
        <ForgotPassword/>
        <App />
    </Authenticator>,
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
