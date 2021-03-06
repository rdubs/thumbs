import React from 'react';
import socket from '../../config/socket';
import styles from '../../styles/pages/_ParticipantQuestionView';

class ParticipantQuestionView extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    socket.emit('vote', {
      room: this.props.room,
      option: e.target.value
    });
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <h1>ParticipantQuestionView</h1>
        <button className={styles.secondaryButton} onClick={this.handleClick} value={1}>Thumbs Up</button>
        <button className={styles.secondaryButton} onClick={this.handleClick} value={2}>Thumbs Middle</button>
        <button className={styles.secondaryButton} onClick={this.handleClick} value={3}>Thumbs Down</button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    thumbsCount: state.thumbs
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({ vote }, dispatch);

export default ParticipantQuestionView;
