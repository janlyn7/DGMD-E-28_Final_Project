import {Routes, Route, Link, useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import { ReactComponent as Logo } from './spelling-bee-card-icon.svg';
export function SpellingBeeApp() {
	return (< SpellingBee />)
}
function SpellingBee() {
	//const [theWord, setTheWord] = useState('');
	const [letters, setLetters] = useState( '');
	const [centralLetter, setCentralLetter] = useState('');
	const [currentGuess, setCurrentGuess] = useState(	'');
	const [message, setMessage] = useState(	'How many words can you make with 5 letters?');
    const [guesses, setGuesses] = useState([])

	const exclamation = ['Good!', 'Nice!', 'Great!', 'Awesome!']

	useEffect (() => {
		restart();
	}, []);
/*
	useEffect (() => {
		console.log("The Word: " + theWord);
	}, [theWord]);

	useEffect (() => {
		console.log("Central Letter:  " + centralLetter);
	}, [centralLetter]);

	useEffect (() => {
		console.log("Letters:  " + letters);
	}, [letters]);

	useEffect (() => {
		console.log("Current Guess:  " + currentGuess);
	}, [currentGuess]);
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

	function getRandomNum(max) {
		return Math.floor(Math.random() * max)
	}
	async function getFiveLetters() {
		var result = false;
		var word;

		do {
			word = await getRandomWord();
			result = findUnique(word)
			console.log("  " + word + " is unique? " + result)
			if (word.includes('s')) {
				result = false
			}
		} while (result == false)

		word = word.toUpperCase()

		var randomNum = getRandomNum(5)
		var letters =  word.split("")
		var central = letters[randomNum]
		setCentralLetter( central )

		shuffle(letters)
		setLetters(letters)
	}

	function restart() {
		getFiveLetters()
		setMessage('How many words can you make with 5 letters?')
		setGuesses([])
		setCurrentGuess('')
	}
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

	function Rules() {
    	return (
			<div id='page' className="w3-display-container">
	    		< Header />
	    		< Navigation />
	    		< RulesView />
			</div>
    	);
	}
	function Header()
	{
    	return (
        	<div className="w3-center">
				<br/>
				<Logo/> <h1 id='appTitle'><b>Spelling Bee</b></h1>
        	</div>
    	);
	}
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
	function PlayAgain() {
		var style = "funckey w3-button w3-center w3-round-xlarge w3-padding-large"

		return (
			<div className="w3-center">
				<br/>
			<button id='playAgain' className={style}
				onClick={(e) => handlePlayAgainClick(e)} >New Game</button>
			</div>
		)
	}

	function handleSquareClick(e) {
		setMessage('')
		var guess = currentGuess + letters[e]
		setCurrentGuess(guess)

	}
	function Square(props)
	{
		var style = ((props.value == centralLetter) ? "squareCent" : "square") + " w3-round-large"
		return ( <button className={style} onClick={props.onclick}>{props.value}</button>)
	}

	function handleFunctionClick(e) {
		console.log(e.target.id)
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

	function shuffle(array) {
		let ii, jj
  		for (let ii = array.length - 1; ii > 0; ii--) {
			jj = Math.floor(Math.random() * (ii + 1));
			[array[ii], array[jj]] = [array[jj], array[ii]];
  		}
	}

	function handleRemixClick() {
		shuffle(letters)
		console.log(letters)
		setLetters(letters)
		createSquares()
	}
	function handleDeleteClick() {
		if (currentGuess.length == 0) {
			return
		}
		setCurrentGuess(currentGuess.slice(0,-1))
	}
	function handleEnterClick() {
		if (currentGuess.length == 0) {
			setCurrentGuess('')
			return
		}

		if (!currentGuess.includes(centralLetter)){
			setMessage("Must contain highlighted letter")
			setCurrentGuess('')
			return
		}

		if ( guesses.includes(currentGuess) ) {
			setMessage("Already Found")
			setCurrentGuess('')
			return
		}

		if (currentGuess.length < 3) {
			setMessage("Word must be at least 3 letters long")
			setCurrentGuess('')
			return
		}

		var isValid = validateGuess(currentGuess)
		//console.log(isValid)
		if (isValid) {
			setGuesses((gg) => [...gg, currentGuess])
			setCurrentGuess('')
			var num = getRandomNum(4)
			setMessage(exclamation[num])
		} else {
			setMessage("Not in word list")
			setCurrentGuess('')
		}
	}

	function handlePlayAgainClick() {
		restart()
	}
	function createButton(name, key) {
		var style=""
/*
		if (name == 'Remix') {
			icon = "fa fa-refresh"
			style = "funckey w3-button w3-circle w3-xlarge"

			return (<button id={name.toLowerCase()} className={style} key={key} style={{pointerEvents: 'auto'}}
					onClick={(e) => handleFunctionClick(e)} ><i className={icon}/></button>)

		} else {
*/

			style = "funckey w3-button w3-round-xlarge w3-padding-large"

			return (<button id={name.toLowerCase()} className={style} key={key}
					onClick={(e) => handleFunctionClick(e)} >{name}</button>)
//		}
	}
	function createSquares() {
		var bunchOfSquares = [];
		for (let ii = 0; ii<5; ii++)
			bunchOfSquares.push(<Square key={ii} value={letters[ii]} onclick={()=>handleSquareClick(ii)}/>)
		return ( <div id="lettersDisplay">{bunchOfSquares}</div> );
	}


	function GameView() {
		function Banner() {
            return (
                <div className="w3-center" id="banner">
                    &nbsp;{message}
                </div>
            );
        }

		function ShowGuess() {
            return (
                <div className="w3-center" id="guessBanner">
                    &nbsp;{currentGuess}
                </div>
            );
        }

		function GameForm() {
			function createFunctionButtons() {
				var funcs = ['Delete', 'Remix', 'Enter']
				return (
					<div className="functions">
						{funcs.map((ff,ii) => createButton(ff, ii))}
				 	</div>
				)
			}

			return (
					<div id='gameboard' className='w3-display-container w3-center'>
						{createSquares()}
						<br/>
						{createFunctionButtons()}
					<hr/>
						<div id='wordsFound'>
						<h5>
							You have found {guesses.length} {(guesses.length!=1) ? 'words' : 'word'}
							<br/><br/>
							{guesses.sort().join(",     ")}
						</h5>
						</div>
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
	}

	function RulesView() {
		return (
			<div id='mainbody' className="w3-display-container w3-round-xlarge w3-padding-large w3-card">
				<br/>
				<h2 className="w3-center">How to Play Spelling Bee</h2>
				<br/>
				<div id='rulesList'>
				<ul>
					<li><h5>Create words using letters shown. </h5></li>
					<li><h5>Words must contain at least 3 letters. </h5></li>
					<li><h5>Words must include the highlighted letter.</h5></li>
					<li><h5>Letters can be used more than once.</h5></li>
				</ul>
				</div>
				<br/>
				<h3 className="w3-center">Happy Spelling!</h3>
			</div>
		);
	}


    return (
		<div>
		  <Routes>
			<Route path="/" element={<Home />} />
			<Route path="/rules" element={<Rules />} />
		  </Routes>
		</div>
    );
}  // end SpellingBee component