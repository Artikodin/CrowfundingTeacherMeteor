import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import { withTracker } from 'meteor/react-meteor-data';

import { Profiles } from '../api/profiles.js';

import Profile from './Profile.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

// App component - represents the whole app
class App extends Component {

  constructor(props) {
   super(props);

   this.state = {
     hideCompleted: false,
   };
 }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Profiles.insert({
      text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),           // _id of logged in user
      username: Meteor.user().username,  // username of logged in user
    });

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  toggleHideCompleted() {
   this.setState({
     hideCompleted: !this.state.hideCompleted,
   });
 }


  renderProfiles() {
    let filteredProfiles = this.props.profiles;
        if (this.state.hideCompleted) {
          filteredProfiles = filteredProfiles.filter(profile => !profile.checked);
        }
        return filteredProfiles.map((profile) => (
       <Profile key={profile._id} profile={profile} />
    ));
  }

  render() {
  return (
    <div className="container">
      <header>
        <h1>Todo List ({this.props.incompleteCount})</h1>

        <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Profiles
          </label>

          <AccountsUIWrapper />

          { this.props.currentUser ?
           <form className="new-profile" onSubmit={this.handleSubmit.bind(this)} >
             <input
               type="text"
               ref="textInput"
               placeholder="Type to add new profiles"
             />
           </form> : ''
         }

      </header>

      <ul>
        {this.renderProfiles()}
      </ul>
    </div>
  );
}
}


export default withTracker(() => {
  return {
  profiles: Profiles.find({}, { sort: { createdAt: -1 } }).fetch(),
  incompleteCount: Profiles.find({ checked: { $ne: true } }).count(),
  currentUser: Meteor.user(),
  };
})(App);
