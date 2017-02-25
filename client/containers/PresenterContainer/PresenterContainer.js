import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import socket from '../../config/socket';

import PresenterPromptView from '../../components/PresenterPromptView/PresenterPromptView';
import ResultsView from '../../components/ResultsView/ResultsView';
import { updateVoteStatus } from '../../actions/presenterActions.js';
import { vote, participantQuestion } from '../../actions/participantActions.js';
import styles from '../../styles/pages/_PresenterPromptView';

class PresenterContainer extends React.Component {
  constructor(props) {
    super(props);

    const context = this;

    socket.on('vote', (payload) => {
      context.props.vote(payload.option);
    });

    socket.on('participantQuestion', (payload) => {
      context.props.participantQuestion();
    });

    this.sendQuestion = this.sendQuestion.bind(this);
    this.endVote = this.endVote.bind(this);
    this.goToPromptView = this.goToPromptView.bind(this);

    socket.emit('joinPresentation', {room: this.props.params.room});
  }

  sendQuestion() {
    socket.emit('startVote', {room: this.props.params.room});
    this.props.updateVoteStatus('IN_PROGRESS');
  }

  endVote() {
    socket.emit('endVote', {room: this.props.params.room});
    this.props.updateVoteStatus('ENDED');
  }

  goToPromptView() {
    this.props.updateVoteStatus('WAITING');
  }

  getCurrentView() {
    const voteStatus = this.props.voteStatus;
    if (voteStatus === 'WAITING') {
      return (
        <PresenterPromptView
          sendQuestion={this.sendQuestion}
        />
      );
    } else {
      return (
        <ResultsView
          isPresenter={true}
          endVote={this.endVote}
          voteEnded={this.props.voteStatus === 'ENDED'}
          goToPromptView={this.goToPromptView}
          data={this.props.thumbsCount}
        />
      );
    }
  }

  render() {
    return (
      <div className={styles.wrapper}>
        {this.getCurrentView()}
        <h3>Participant Questions: { this.props.questionCount }</h3>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    voteStatus: state.voteStatus,
    thumbsCount: state.thumbs,
    questionCount: state.participantQuestion
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({ updateVoteStatus, vote, participantQuestion }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PresenterContainer);
