import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';

class Register extends Component {
    state = {
        email: "",
        username: "",
        password: "",
        error: {on: false, message: ""},
        submitting: false,
    };

    componentDidMount() {
        document.title = "Sign Up";
    }

    submit = async (e) => {
        e.preventDefault();
        this.setState({error: {on: false, message: ""}, submitting: true});
        const response = await this.props.store.userSignUp({
            email: this.state.email,
            username: this.state.username,
            password: this.state.password
        });
        this.setState({
            email: "",
            username: "",
            password: "",
            submitting: false,
        });
        if ('error' in response) {
            this.setState({error: {on: true, message: response.error}});
        } else {
            this.props.history.push("/home");
        }
    };

    render() {
        return (
            <div className="card card-body register-box">
                <h3 className="text-center mb-4">Sign Up</h3>
                {this.state.error.on && (
                    <div className="alert alert-danger">
                        {this.state.error.message}
                    </div>
                )}
                <form onSubmit={this.submit}>
                    <div className="form-group">
                        <input onChange={({target}) => this.setState({email: target.value})} required
                               className="form-control input-lg" name="email" placeholder="Email"
                               value={this.state.email}
                               type="email"/>
                    </div>
                    <div className="form-group">
                        <input onChange={({target}) => this.setState({username: target.value})} required
                               className="form-control input-lg" name="username" placeholder="Username"
                               value={this.state.username}
                               type="text"/>
                    </div>
                    <div className="form-group">
                        <input onChange={({target}) => this.setState({password: target.value})} required
                               className="form-control input-lg" placeholder="Password" name="password"
                               value={this.state.password}
                               type="password"/>
                    </div>
                    {this.state.submitting ?
                        (<button disabled className="btn btn-lg btn-primary btn-block"
                                 type="submit">Loading...</button>)
                        :
                        (<button className="btn btn-lg btn-primary btn-block" type="submit">Sign Up</button>)
                    }

                </form>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(Register)));
