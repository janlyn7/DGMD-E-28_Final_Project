import {Routes, Route, Link, useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import { ReactComponent as Logo } from './spelling-bee-card-icon.svg';

export function SpellingBeeApp() {
	return (< SpellingBee />)
}

/*
Parent component for the Spelling Bee App
 */
function SpellingBee() {
	/********************************
	 HOOKS Section
	 ********************************/
	// stores the five unique letters as an array
	const [letters, setLetters] = useState( '');

	// stores which of the five letters is highlighted in yellow (chosen at random)
	const [centralLetter, setCentralLetter] = useState('');

	// saves the Player's current guess
	const [currentGuess, setCurrentGuess] = useState(	'');

	// stores the message to display in the banner div
	const [message, setMessage] = useState(	'How many words can you make with 5 letters?');

	// stores the list of valid words the Player has found
    const [guesses, setGuesses] = useState([])

	// save the list of pangrams the Player has found
    const [pangrams, setPangrams] = useState([])

	// exclamations which are chosen at random and displayed in the
	// announcement banner when the Player has entered a valid word
	const exclamation = ['Good!', 'Nice!', 'Great!', 'Awesome!', 'Hooray!']

	/*
	Effect that initializes the game's State variables and generate 5 unique letters.
	Runs only on the first render.
	 */
	useEffect (() => {
		restart();
	}, []);

	/********************************
	 COMPONENTS Section
	 ********************************/
	/*
	Home component
	Displays the Header, Navigation bar, Game View, and New Game Button
	 */
	function Home() {
    	return (
			<div id='page' className="w3-display-container">
	    		< Header />
				< Navigation />
	    		< GameView />
				< PlayAgain />
			</div>
    	);
	}

	/*
	Rules component
	Displays the Header, Navigation Bar, Rules View
	 */
	function Rules() {
    	return (
			<div id='page' className="w3-display-container">
	    		< Header />
	    		< Navigation />
	    		< RulesView />
			</div>
    	);
	}

	/*
	Header component
	Displays the Bee logo and the title
	 */
	function Header()
	{
    	return (
        	<div id='head' className="w3-center">
				<br/>
				<Logo/> <h1 id='appTitle'><b>Spelling Bee</b></h1>
        	</div>
    	);
	}

	/*
	Navigation component
	Shows the links to the Game View and Rules View
	 */
	function Navigation()
	{
		var styling = "navItem w3-bar-item w3-button w3-padding w3-hover-none w3-border-white w3-hover-text-blue"

    	return (
			<div id='navbar' className='w3-bar w3-padding-large'>
			<ul className="w3-ul w3-large">
	    		<li className={styling} style={{width:"50%", fontWeight:"bold"}}><Link to="/">Game</Link></li>
	    		<li className={styling} style={{width:"50%", fontWeight:"bold"}}><Link to="/rules">Rules</Link></li>
			</ul>
			</div>
    	);
	}

	/*
	Banner component used within the Game View
	Displays exclamations if the Player has entered word or Errors for invalid entries
	 */
	function Banner() {
		return (
			<div className="w3-center" id="banner">
				&nbsp;{message}
			</div>
		);
	}

	/*
	ShowGuess component used within Game View
	Displays which letter buttons the Player has clicked, i.e. the Player's current guess
	 */
	function ShowGuess() {
		return (
			<div className="w3-center" id="guessBanner">
				&nbsp;{currentGuess}
			</div>
		);
	}

	/*
	GameView component
	Displays the game board - letter buttons, function buttons,
	words found counter and list of valid words
	 */
	function GameView() {
		function GameForm() {
			return (
					<div id='gameboard' className='w3-display-container w3-center'>
						{createSquares()}
						<br/>
						{createFunctionButtons()}
						<hr/>
						<div id='wordsDisplay'> <h5>
							You have found {guesses.length} {(guesses.length!=1) ? 'words' : 'word'}
							<br/><br/>
							{getWordsList()}
						</h5> </div>
					</div>
			);
		}

		return (
			<div id='mainbody' className="w3-display-container w3-round-xlarge w3-padding-large w3-card">
			<br/>
			< Banner />

			<br/>
			< ShowGuess />

			<br/>
			< GameForm />

			<br/>
			</div>
		);
	} // end GameView Component

	/*
	RulesView component
	Displays Game Rules and how to play
	 */
	function RulesView() {
		return (
			<div id='mainbody' className="w3-container w3-round-xlarge w3-padding-large w3-card">
				<br/>
				<h2 className="w3-center">How to Play Spelling Bee</h2>
				<br/>
				<div>
				<ul id='rulesList' className="w3-ul w3-center">
					<li><h5>Create words using letters shown. </h5></li>
					<li><h5>Words must contain at least 3 letters. </h5></li>
					<li><h5>Words must include the highlighted letter.</h5></li>
					<li><h5>Letters can be used more than once.</h5></li>
					<li><h5>Pangrams are words that contain all letters.</h5></li>
				</ul>
				</div>
				<br/>
				<h3 className="w3-center">Happy Spelling!</h3>
			</div>
		);
	} // end RulesView component

	/*
	PlayAgain component
	Button beneath the GameView which, when clicked, allows the Player to load another game
	 */
	function PlayAgain() {
		var style = "funckey w3-button w3-center w3-round-xlarge w3-padding-large"

		return (
			<div id='play' className="w3-center">
				<br/>
				<button id='playAgain' className={style}
					onClick={(e) => handlePlayAgainClick(e)} >New Game</button>
				<br/>
			</div>
		)
	}

	/*
	Square component
	Creates and returns a button for one of the five unique letters
	The centralLetter is highlighted in yellow
	 */
	function Square(props)
	{
		var style = ((props.value == centralLetter) ? "squareCent" : "square") + " w3-round-large"
		return ( <button className={style} onClick={props.onclick}>{props.value}</button>)
	}

	/*
	FunctionButton component
	Creates and returns a button for one of three functions: Delete, Remix, Enter
	 */
	function FunctionButton({name, key}) {
		var style=""
		style = "funckey w3-button w3-round-xlarge w3-padding-large"

		return (<button id={name.toLowerCase()} className={style} key={key}
				onClick={(e) => handleFunctionClick(e)} >{name}</button>)
	}

	/********************************
	 HELPER Functions Section
	 ********************************/
	/*
	createSquares function
	Generates the letter Squares to display
	 */
	function createSquares() {
		var bunchOfSquares = [];
		for (let ii = 0; ii<5; ii++)
			bunchOfSquares.push(<Square key={ii} value={letters[ii]} onclick={()=>handleSquareClick(ii)}/>)
		return ( <div id="lettersDisplay">{bunchOfSquares}</div> );
	}

	/*
	createFunctionButtons function
	Generates the FunctionButtons to display: Delete, Remix, and Enter
	 */
	function createFunctionButtons() {
		var funcs = ['Delete', 'Remix', 'Enter']
		return (
			<div className="functions">
				{funcs.map((ff,ii) => <FunctionButton name={ff} key={ii} /> )}
			</div>
		)
	}

	/*
	getRandonWord function
	Retrieves and returns one randon five letter word using the
	random-word-api.vercel.app API
 	*/
	async function getRandomWord() {
		var myword;
		await fetch("https://random-word-api.vercel.app/api?words=1&length=5")
			.then(res => res.json())
			.then(data => {
				// get the first word in the returned array
				myword = data[0];
			});
		return myword;
	}

	/*
	validateGuess function
	Uses the Merriam-Webster Collegiate API to validate the Player's guess
 	*/
	function validateGuess( guess ){
		let req = new XMLHttpRequest();
		req.open("GET", "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + guess +
				"?key=22b6c8ea-5808-466e-bf2f-146146bb7b4b", false);
		req.send(null);
		if(req.readyState === 4)  {
			let	reqJSON = JSON.parse(req.responseText);

			// valid words return an object
			// invalid words return an array or undefined
			return (typeof reqJSON[0] === 'object');
		}
	}

	/*
	findUnique function
	Determines of the input word contains unique letters
	Returns true if there are 5 unique characters, false if not
 	*/
	function findUnique(str){
      // The variable that contains the unique values
      let uniq = "";

      for(let i = 0; i < str.length; i++){
        // Checking if the uniq contains the character
        if(uniq.includes(str[i]) === false){
          // If the character not present in uniq
          // Concatenate the character with uniq
          uniq += str[i]
        }
      }
      return (uniq.length == 5);
    }

	/*
	getRandomNum function
	Retrieves a random number between 0 and input maximum value
 	*/
	function getRandomNum(max) {
		return Math.floor(Math.random() * max)
	}

	/*
	getFiveLetters function
	Retrieves a word with five unique letters, splits the characters into an array,
	shuffles the letters, and stores the array in the letters useState hook
 	*/
	async function getFiveLetters() {
		var result = false;
		var word;

		// get a five letter word using the API
		// if the word contains repeating letters or contains an 'S', get another word
		do {
			word = await getRandomWord();
			result = findUnique(word)
			if (word.includes('s')) {
				result = false
			}
		} while (result == false)

		// make word uppercase
		word = word.toUpperCase()

		// print word to console for debugging purposes
		console.log(word)

		// select at random which letter to highlight
		var randomNum = getRandomNum(5)
		var letters =  word.split("")
		var central = letters[randomNum]
		setCentralLetter( central )

		// remix the letters
		shuffle(letters)

		// store the shuffled letters in the letters useState hook
		setLetters(letters)
	}

	/*
	restart function
	When 'New Game' button is clicked, clear useState variables and
	generate another file letter word
 	*/
	function restart() {
		getFiveLetters()
		setMessage('How many words can you make with 5 letters?')
		setGuesses([])
		setCurrentGuess('')
		setPangrams([])
	}

	/*
	shuffle function
	Reshuffles the input array
 	*/
	function shuffle(array) {
		let ii, jj
  		for (ii = array.length - 1; ii > 0; ii--) {
			jj = Math.floor(Math.random() * (ii + 1));
			[array[ii], array[jj]] = [array[jj], array[ii]];
  		}
	}

	/*
	isPangram function
	Returns true if the Player's guess contains all five letters, false if not
 	*/
	function isPangram(currentGuess) {
		if ( currentGuess.includes(letters[0]) &&  currentGuess.includes(letters[1]) &&
			currentGuess.includes(letters[2]) && currentGuess.includes(letters[3]) &&
			currentGuess.includes(letters[4]) ) {
			return true
		}
		return false
	}

	/*
	getWordsList function
	Return the list of words found by the Player, highlight the pangrams (if any)
	with bold typeface
 	*/
	function getWordsList() {
		guesses.sort()
		const listItems = guesses.map( word =>
			pangrams.includes(word) ? <b>&nbsp;{word}&nbsp;</b> : word+"  "
		);
		return <> {listItems} </>
	}

	/********************************
	 EVENT HANDLER Section
	 ********************************/
	/*
	handleSquareClick event
	Update the Player's currentGuess with the letter clicked
 	*/
	function handleSquareClick(e) {
		setMessage('')
		var guess = currentGuess + letters[e]
		setCurrentGuess(guess)
	}

	/*
	handleFunctionClick event
	Generic eventHandler for FunctionButton clicks; uses a switch statement to call the
	appropriate event handler for Delete, Remix, or Enter
 	*/
	function handleFunctionClick(e) {
		setMessage('')
		switch (e.target.id) {
			case 'enter': handleEnterClick()
				break
			case 'delete': handleDeleteClick()
				break
			case 'remix': handleRemixClick()
				break
			default:
				break
		}
	}

	/*
	handleRemixClick event
	Reshuffles and redisplays the letter Squares
 	*/
	function handleRemixClick() {
		shuffle(letters)
		setLetters(letters)
		createSquares()
	}

	/*
	handleDeleteClick event
	Removes one letter from the Player's current guess
 	*/
	function handleDeleteClick() {
		if (currentGuess.length == 0) {
			return
		}
		setCurrentGuess(currentGuess.slice(0,-1))
	}

	/*
	handleEnterClick event
	Submits the Player's input word and validates; displays an exclamation in the
	announcement banner if the word is valid, or displays an appropriate error message
	for the invalid guess
 	*/
	function handleEnterClick() {
		// if the current guess is an empty string, do nothing and return
		if (currentGuess.length == 0) {
			setCurrentGuess('')
			return
		}

		// if the current guess does not contain the central letter,
		// print error message "Must contain highlighted letter" and return
		if (!currentGuess.includes(centralLetter)){
			setMessage("Must contain highlighted letter")
			setCurrentGuess('')
			return
		}

		// if the current guess is already in the list,
		// print error message "Already Found" and return
		if ( guesses.includes(currentGuess)) {
			setMessage("Already Found")
			setCurrentGuess('')
			return
		}

		// if the current guess is shorter than three characters,
		// print error message "Word must be at least 3 letters long" and return
		if (currentGuess.length < 3) {
			setMessage("Word must be at least 3 letters long")
			setCurrentGuess('')
			return
		}

		// use API to check if the current guess is a valid English word
		var isValid = validateGuess(currentGuess)

		if (isValid) {
			// add valid guess to the guesses list
			setGuesses((gg) => [...gg, currentGuess])

			// if the word is a pangram, print 'Pangram!!' and add it to
			// the pangrams State
			if (isPangram(currentGuess)) {
				setMessage('Pangram!!')
				setPangrams((gg) => [...gg, currentGuess])
			} else {
				// if not a pangram, print a random affirmation from the
				//exclamations list
				var num = getRandomNum(5)
				setMessage(exclamation[num])
			}

			// clear the current guess
			setCurrentGuess('')
		} else {
			// if word is not valid, print error message "Not in word list"
			// and clear the current guess
			setMessage("Not in word list")
			setCurrentGuess('')
		}
	}

	/*
	handlePlayAgainClick event
	Clears game, i.e. resets the State variables, and retrieves / displays
	a new set of 5 unique letters
 	*/
	function handlePlayAgainClick() {
		restart()
	}

	// Return the Spelling Bee Route elements
    return (
		<div>
		  <Routes>
			<Route path="/" element={<Home />} />
			<Route path="/rules" element={<Rules />} />
		  </Routes>
		</div>
    );
}  // end SpellingBee component