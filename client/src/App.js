import React, {Component} from 'react';
import './App.css';
import {Switch, Route, Redirect} from 'react-router-dom';
import SignUp from './Auth/SignUp'
import Login from './Auth/Login'
import NavBar from './Nav/NavBar'
import Home from './Main/Home'

const RedirectHome = () => {
    return (
        <Redirect to="/signup"/>
    )
};

class App extends Component {
    render() {
        return (
            <div>
                <NavBar/>
                <Switch>
                    {/*<Route exact path="/login" component={Login}/>*/}
                    <Route exact path="/signup" component={SignUp}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/home" component={Home}/>
                    <Route path="/" component={RedirectHome}/>
                </Switch>
            </div>
        );
    }
}

export default App;