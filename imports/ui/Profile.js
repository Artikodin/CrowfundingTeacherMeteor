import React, { Component } from 'react';

import { Profiles } from '../api/profiles.js';

// Profile component - represents a single todo item
export default class Profile extends Component {

  toggleChecked() {
  // Set the checked property to the opposite of its current value
  Profiles.update(this.props.profile._id, {
    $set: { checked: !this.props.profile.checked },
  });
}

deleteThisProfile() {
  Profiles.remove(this.props.profile._id);
}

  render() {
    // Give profiles a different className when they are checked off,
// so that we can style them nicely in CSS
  const profileClassName = this.props.profile.checked ? 'checked' : '';

    return (
      <li className={profileClassName}>
        <button className="delete" onClick={this.deleteThisProfile.bind(this)}>
          &times;
        </button>

        <span className="text">
            <strong>{this.props.profile.username}</strong>: {this.props.profile.text}
          </span>

        <input
          type="checkbox"
          readOnly
          checked={!!this.props.profile.checked}
          onClick={this.toggleChecked.bind(this)}
        />
      </li>
    );
  }
}
