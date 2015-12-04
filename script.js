var StarsFrame = React.createClass({
  render: function() {
    var stars = [];
    var numOfStars = this.props.numOfStars
    for(var i = 0; numOfStars > i; i++) {
      stars.push(
        <span className="glyphicon glyphicon-star"></span>
      )
    }

    return (
      <div id="stars-frame" className="well"> {stars} </div>
    )
  }
});

var ButtonFrame = React.createClass({
  render: function() {
    var correct = this.props.correct,
      button;

    switch(correct) {
      case true:
        button = (
          <button className="btn btn-success btn-lg" onClick={this.props.acceptAnswer}>
            <span className="glyphicon glyphicon-ok"></span>
          </button>
        );
      break;
      case false:
        button = (
          <button className="btn btn-danger btn-lg">
            <span className="glyphicon glyphicon-remove"></span>
          </button>
        );
      break;
      default:
        var disabled = (this.props.selectedNumbers.length === 0);
        button = (
          <button className="btn btn-primary btn-lg" disabled={disabled} onClick={this.props.checkAnswer}>
          =
          </button>
        )
    }
    return (
      <div id="button-frame">
        {button}
        <button onClick={this.props.redraw} className="btn btn-warning btn-sm">
          <span className="glyphicon glyphicon-refresh"></span> {this.props.redraws}
        </button>
      </div>
    )
  }
});

var AnswerFrame = React.createClass({
  render: function() {
    var deselectNumber = this.props.deselectNumber;

    var buttons = this.props.selectedNumbers.map(function(val) {
      return (
        <span onClick={deselectNumber.bind(null, val)} className="btn btn-success">{val}</span>
      )
    })
    return (
      <div id="answer-frame" className="well">
        {buttons}
      </div>
    );
  }
});

var NumbersFrame = React.createClass({
  render: function() {
    var maxNum = 10,
      numbers = [],
      selectNumber = this.props.selectNumber,
      usedNumbers = this.props.usedNumbers,
      selectedNumbers = this.props.selectedNumbers;

    for (var i = 1 ; maxNum >= i; i++ ) {
      var className = 'btn btn-danger' + (selectedNumbers.indexOf(i) >= 0 ? ' disabled' : '');
      className += ' used-' + (usedNumbers.indexOf(i) >= 0);
      numbers.push(<span className={className} onClick={selectNumber.bind(null, i)}>{i}</span>)
    }

    return (
      <div id="numbers-frame">
        <div  className="well">
          {numbers}
        </div>
      </div>
    );
  }
});

var Game = React.createClass({
  getInitialState: function() {
    return {
      selectedNumbers: [],
      usedNumbers: [],
      numOfStars: this._randomNumber(),
  		redraws: 5,
      correct: null
    }
  },
  selectNumber: function(num) {
    if (this.state.selectedNumbers.indexOf(num) < 0) {
      this.setState({
      	selectedNumbers: this.state.selectedNumbers.concat(num),
      	correct: null
      })
    }
  },
  sumOfSelectedNumbers: function() {
    return this.state.selectedNumbers.reduce(function(a, b) {return a + b}, 0)
  },
  checkAnswer: function() {
    var correct = (this.state.numOfStars === this.sumOfSelectedNumbers());
    this.setState({correct: correct})
  },
  acceptAnswer: function() {
  	var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);
  	this.setState({
  		selectedNumbers: [],
  		usedNumbers: usedNumbers,
  		correct: null,
  		numOfStars: this._randomNumber()
  	});
  },
  redraw: function() {
  	if (this.state.redraws > 0) {
	  	this.setState({
	  		selectedNumbers: [],
	  		correct: null,
	  		numOfStars: this._randomNumber(),
	  		redraws: this.state.redraws - 1
	  	});
  	}
  },
  deselectNumber: function(num) {
    var selectedNumbers = this.state.selectedNumbers,
      numIndex = selectedNumbers.indexOf(num);

    selectedNumbers.splice(numIndex, 1);
    this.setState({selectedNumbers: selectedNumbers, correct: null})
  },
  _randomNumber: function() {
  	return Math.floor(Math.random() * 9) + 1
  },
  render: function() {
    var correct = this.state.correct,
      selectedNumbers = this.state.selectedNumbers,
      redraws = this.state.redraws,
      usedNumbers = this.state.usedNumbers;
    return (
      <div id="game">
        <h2> play nine</h2>
        <hr />
        <div>
          <StarsFrame numOfStars={this.state.numOfStars}/>
          <ButtonFrame correct={correct}
          							selectedNumbers={selectedNumbers}
	        							acceptAnswer={this.acceptAnswer}
          							redraw={this.redraw}
          							redraws={redraws}
          							checkAnswer={this.checkAnswer}/>

          <AnswerFrame selectedNumbers={selectedNumbers}
          							deselectNumber={this.deselectNumber}
	        							acceptAnswer={this.acceptAnswer} />
        </div>
        <NumbersFrame selectedNumbers={selectedNumbers}
        							usedNumbers={usedNumbers}
        							selectNumber={this.selectNumber}/>
      </div>
    );
  }
});
ReactDOM.render(
  <Game />,
  document.getElementById('container')
);
