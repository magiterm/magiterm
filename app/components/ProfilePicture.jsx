const React = require('react');
const ReactDOM = require('react-dom');
const Dropzone = require('react-dropzone');
const request = require('superagent');
const axios = require('axios');
const CLOUDINARY_UPLOAD_PRESET = 'z14cfu0d';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/picoshell/upload';

class ProfilePicture extends React.Component {
	constructor(props) {
		super(props);

    this.onImageDrop = this.onImageDrop.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);

		this.state = {
			profilePictureUrl: this.props.profilePicture,
			username: this.props.username,
		};
	}

	onImageDrop(files) {
		this.setState({
			uploadedFile: files[0]
		});

		this.handleImageUpload(files[0]);
	}

	handleImageUpload(file) {
		const context = this;
		let upload = request.post(CLOUDINARY_UPLOAD_URL)
		.field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
		.field('file', file);

		upload.end((err, response) => {
			if (err) {
				console.error(err);
			}

			if (response.body.secure_url !== '') {
				this.setState({
					profilePictureUrl: response.body.secure_url
				});

				const toUpdate = {
					profilePicture: response.body.secure_url
				}

				axios.post('/users/updateUser', { username: this.state.username, toUpdate: toUpdate})
				.then(function(res) {
					console.log(res);
				})
				.catch(function(err) {
					console.log(err);
				});
			}
		});
	}

	render() {
		if (!this.state.profilePictureUrl) {
			return (
				<div className="row">
				<div className="col-md-3 col-md-offset-3">
				<div className="profile-picture-container">
  				<div className="img-container center">
		    				<Dropzone multiple={false} accept="image/*" onDrop={this.onImageDrop}>
		    				  <p>Drop an image or click to select a file to upload.</p>
		    				</Dropzone>
	    				</div>
    				</div>
  				</div>
				</div>
			)	
		} else {
			return (
				<div className="profile-picture-container">
  				{this.state.profilePictureUrl === '' ? null :
  				<div className="img-container">
  				  <img onDrop={this.onImageDrop} src={this.state.profilePictureUrl} />
  				</div>}
  				<div className="username">
    				{this.state.username}
  				</div>
				</div>
			)
		}


	}
}

module.exports = ProfilePicture;