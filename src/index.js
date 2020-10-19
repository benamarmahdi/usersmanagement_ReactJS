import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import * as serviceWorker from './serviceWorker';
import {
  ApolloClient, ApolloProvider, HttpLink, InMemoryCache
} from '@apollo/client';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import SignInSide from './Pages/SignInSide';
import Dashboard from './Pages/Dashboard'
import SignUp from './Pages/SignUp'
import PswRecovery from './Pages/PswRecovery'
const enchancedFetch = (url, init) => {
  const token = localStorage.getItem('token');
  console.log(token);
  return fetch(url, {
    ...init,
    headers: {
      ...init.headers,
      'Access-Control-Allow-Origin': '*',
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",

      ...(token && { authorization: `Bearer ${token}` }),
    },
  }).then(response => response)
}

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  // credentials: 'include',
  fetchOptions: {
    mode: 'cors',
  },
  fetch: enchancedFetch,
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
  fetchOptions: {
    mode: 'no-cors',
  },
});

ReactDOM.render(
  <Router>
    <ApolloProvider client={client}>
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/" component={SignInSide} />
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/pswrecovery" component={PswRecovery} />
      
    </ApolloProvider>
  </Router>,

  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
