import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';

class Character extends Component {
  state = {
    isBookmarked: false,
    isVisible: true
  };


  constructor(props) {
    super(props);
    const { instance } = props;

    this.id = instance.id;
    this.name = instance.name;
    this.image = `${instance.thumbnail.path}.${instance.thumbnail.extension}`;
  }


  Bookmark = (event) => {
    if(this.state.isBookmarked)
    {
      this.setState({ isBookmarked: false });
      console.log('bookmark id Character removed', this.id);
      this.props.triggerRemoveCharacter(this.id);
    }
    else{
      this.setState({ isBookmarked: true });
      console.log('bookmark id Character added', this.id);
      this.props.triggerAddCharacter(this.id);
      
    }  
  }
  componentWillMount() {

if(this.props.bookmarkList !=null && this.props.bookmarkList.includes(this.id))
    {
      this.setState({ isBookmarked: true });
    }

    if(this.props.isNameBlank==false)
    {
      this.setState({ isVisible: true });
    }
    else{
      if(this.state.isBookmarked){
        this.setState({ isVisible: true });
      }
      else{
        this.setState({ isVisible: false });
      }
    }  
  }
 

  render() {

    if(!this.state.isVisible && !this.state.isBookmarked){
    return <div></div>;
    }
    else
      return (
        
        <div className="Character">
          <div className="text-center Character-name"><span className="h3">{this.name}</span></div>
          <div className="Character-image" style={{backgroundImage: `url('${this.image}')`}} />
  
          <button type="button" className="btn btn-primary btn-lg Character-link" onClick={this.Bookmark}>{this.state.isBookmarked? 'Bookmarked' : 'Bookmark'}</button>
  
        </div>
      );
    
   
  }
}

Character.propTypes = {
  instance: PropTypes.object.isRequired,
};

export default Character;