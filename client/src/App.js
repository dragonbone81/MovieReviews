import React, {Component} from 'react';
import './App.css';
import {Switch, Route, Redirect} from 'react-router-dom';
import SignUp from './Auth/SignUp';
import Login from './Auth/Login';
import NavBar from './Nav/NavBar';
import Footer from './Nav/Footer';
import Home from './Main/Home';
import MovieSearchResultPage from './Main/MovieSearchResultPage';
import MovieEntityPage from './Main/MovieEntityPage';
import ShowMoviePage from './Main/ShowMoviePage';
import UserPage from './Main/UserPage';
import VRated from './Main/VRated';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RedirectHome = () => {
    return (
        <Redirect to="/"/>
    )
};

class App extends Component {
    render() {
        return (
            <>
                <ToastContainer/>
                <NavBar/>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/signup" component={SignUp}/>
                    <Route exact path="/login" component={Login}/>
                    <Route path="/vrated/:page?" component={VRated}/>
                    <Route exact path="/movie/:entity_id" component={ShowMoviePage}/>
                    <Route exact path="/show/:entity_id/:season?" component={ShowMoviePage}/>
                    <Route exact path="/search/:term?/:page?" component={MovieSearchResultPage}/>
                    <Route path="/user/:term/:username" component={UserPage}/>
                    <Route path="/person/:actor_id/:page?" component={MovieEntityPage}/>
                    <Route path="/" component={RedirectHome}/>
                </Switch>
                <Footer/>
            </>
        );
    }
}

export default App;