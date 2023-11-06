import './App.css';
import Header from './components/header';
import Footer from './components/footer';
import PopUp from './components/popup';
import { Settings as SettingsIcon, ShieldQuestion as ShieldQuestionIcon, Cable as CableIcon } from 'lucide-react';

import { useRef, useState } from 'react';

import { compare, formatDate, range, shuffle, sleep } from './utils/game';
import { solutions } from './data/solution';
import { STRING_TO_COLOR, WORD_INDEX_INFO } from './constants/solutionInfo';
import Notification from './components/notification';

function Home() {

  const [playing, setPlaying] = useState(false);

  return (
    <div>
      <Header />
      
      <div className='flex justify-center items-center w-full h-screen relative pointer-events-none'>
        <Start state={playing} setState={setPlaying}/>

        <Game state={playing} />
      </div>
      
      <Footer />
    </div>
  );
}

const Start = ({ state, setState }) => {
  return (
    <main className={`absolute flex flex-col justify-center items-center w-full h-full z-10 bg-purple-300 border-black border-y gap-16 transition-opacity duration-300 ${state ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}> 

      <div className='flex flex-col justify-center items-center w-full gap-8'>
        <div className='flex justify-center items-center w-24 h-24 bg-white rounded-full'>
          <CableIcon color="black" size={200}/>
        </div>
        <h1 className="text-5xl font-extrabold">Conexiones</h1>
        <p>Agrupar palabras que comparten un hilo común.</p>

        <button 
          className='bg-black text-white font-semibold px-16 py-3 rounded-full'
          onClick={() => setState(true)}
        >
          Play
        </button>
      </div>

      <div className='flex flex-col justify-center items-center w-full gap-2'>
        <h1 className="text-md font-bold">{formatDate()}</h1>
        <h1 className='text-sm'>By Aidan Ouckama</h1>
      </div>

    </main>
  )
}

const Game = ({ state }) => {
  // ref that checks whether the game has been setup
  const setup = useRef(false);

  // tailwind color loading
  const [selectedColor, unselectedColor] = getSelectedColors();
  const [enabledColor, disabledColor] = getEnabledColors();

  // solution to the puzzle
  const [DIFFICULTY, WORDS] = WORD_INDEX_INFO;
  function getSolutionWords() {
    const solutionWords = [];

    // loop through each solution and get difficulty + words
    for (const key of Object.keys(solutions)) {
      const solution = solutions[key];
      const difficulty = solution[DIFFICULTY];
      const words = solution[WORDS];

      // loop through each word and create a { difficulty, word } object for each word
      for (const word of words) {
        solutionWords.push({ difficulty: difficulty, text: word });
      }
    }

    return solutionWords;
  }
  const [words, setWords] = useState(getSolutionWords());

  // create array keeping track of when wordbuttons are selected
  const [selected, setSelected] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);

  // keep track of answer history
  const [answerHistory, setAnswerHistory] = useState([]);

  // keep track of mistakes made
  const MAX_MISTAKES = 4;
  const [mistakesRemaining, setMistakesRemaining] = useState(MAX_MISTAKES);

  // keep track of rows completed
  const MAX_ROWS = 4;
  const [rowsCompleted, setRowsCompleted] = useState([]);

  // keep track of win or not
  const [winStatus, setWinStatus] = useState("");

  // state for popup + info
  const [popup, setPopup] = useState(false);
  const [popupInfo, setPopupInfo] = useState("");
  const [notification, setNotification] = useState(false);
  const [notificationInfo, setNotificationInfo] = useState("");

  function shuffleWords() {
    const newWords = shuffle([...words]);

    setWords(newWords);
  }

  function deselectWords() {
    const selectedArray = []
    for (let i = 0; i < words.length; i++) {
      selectedArray.push(false);
    } 

    setSelected(selectedArray);
    setSelectedCount(0);
  }

  function getSelectedWords() {
    const selectedWords = [];
    for (let i = 0; i < words.length; i++) {
      if (selected[i]) { selectedWords.push(words[i]) }
    }

    return selectedWords;
  }

  function getSelectedIndexes() {
    const selectedIndexes = [];
    for (let i = 0; i < words.length; i++) {
      if (selected[i]) { selectedIndexes.push(i) }
    }

    return selectedIndexes;
  }

  function handleWordButtonClick(i) {
    // if its already selected, unselect
    if (selected[i]) {
      const newSelected = [...selected];
      newSelected[i] = false;

      setSelected(newSelected);
      setSelectedCount((prevSelectedCount) => prevSelectedCount - 1);
      return;
    }
    
    // 4 already selected continue
    if (selectedCount === 4) return;
    
    // if not selected, set button to selected
    const newSelected = [...selected];
    newSelected[i] = true;

    setSelected(newSelected);
    setSelectedCount((prevSelectedCount) => prevSelectedCount + 1);
  }

  async function handleSubmit() {
    // do not accept answers less than 4
    if (selectedCount !== 4) return;

    // get all words that are currently selected
    const answer = getSelectedWords();
    
    // check if duplicate guess / answer
    for (const prevAnswer of answerHistory) {
      if (compare(answer, prevAnswer)) {
        handleDuplicateSubmit();
        return;
      }
    }

    // log answer in answer history
    const newAnswerHistory = answerHistory;
    newAnswerHistory.push(answer);
    setAnswerHistory(newAnswerHistory);

    // stores the initial difficulty and 
    // finds the associated possible category
    let category;
    let difficulty = answer[0].difficulty;
    for (const key of Object.keys(solutions)) {
      if (solutions[key][DIFFICULTY] === difficulty) {
        category = key;
        break;
      }
    }

    // flag that flags when a solution matches
    // the guessed words
    let found = true;

    // logic for checking if user was one away with guess
    let map = {} // map all the difficulties (for checking if one away)
    for (const word of answer) {
      // logic for map
      if (!Object.keys(map).includes(word.difficulty)) {
        map[word.difficulty] = 1;
      } else {
        map[word.difficulty] += 1;
      }
    }

    // loop through each word in our answer and check if the difficulties/categories match
    // break if there is an inconsistency and flag
    for (const word of answer) {
      // checks if 
      if (word.difficulty !== difficulty) {
        found = false;
        break;
      }
    }

    // logic for displaying notification
    // if user was one word off
    for (const key of Object.keys(map)) {
      if (map[key] === 3) {
        handleNotification("oneaway")
      }
    }

    // handle whether the flag was set or not
    if (found) handleCorrectSubmit(category, difficulty, answer);
    else handleWrongSubmit();
  }

  async function handleCorrectSubmit(category, difficulty, answer) {
    // swap selected with first unused row
    // get selected indexes and indexes of first unused row
    const selectedIndexes = getSelectedIndexes();
    const rowIndexes = range(0, 4);

    // initialize a copy of current words
    let newWords = [...words];

    // start swapping selectedIndex[i] <--> rowIndexes[i]
    for (let i = 0; i < selectedIndexes.length; i++) {
      [newWords[selectedIndexes[i]], newWords[rowIndexes[i]]] = [newWords[rowIndexes[i]], newWords[selectedIndexes[i]]];
    }

    // slice row off from new words array
    newWords = newWords.slice(4, words.length);

    // set words to new swapped words array
    // and deselect current words
    setWords(newWords);
    deselectWords();

    // add info on row completed and add to rowsCompleted state
    const newRowsCompleted = [...rowsCompleted];
    newRowsCompleted.push({
      category: category,
      difficulty: difficulty,
      answer: answer
    });
    setRowsCompleted(newRowsCompleted);

    // completed all rows
    if (rowsCompleted.length + 1 === MAX_ROWS) {
      setWinStatus("win");

      await sleep(1000);

      handlePopup("win");
    }
  }

  async function handleWrongSubmit() {
    setMistakesRemaining((prevMistakesRemaining) => prevMistakesRemaining - 1);

    // no more mistakes
    if (mistakesRemaining - 1 === 0) {
      handleNotification("lose");
      setWinStatus("lose");
      handlePopup("lose");
    }
  }

  async function handleDuplicateSubmit() {
    handleNotification("duplicate")
  }

  function handlePopup(type) {
    setPopup(true); 
    setPopupInfo(type);
  }

  async function handleNotification(type) {
    setNotification(true);
    setNotificationInfo(type);

    await sleep(1000);
    setNotification(false)
  }


  // initially shuffle the words and reset selected words
  if (!setup.current) {
    shuffleWords();
    deselectWords();

    // flags as setup
    setup.current = true;
  }


  const Settings = () => {
    function HandleHelpButton() {
      handlePopup("help");
    }

    return (
      <div className='flex flex-row justify-center items-center w-full h-24 bg-white border-black border-b gap-5 px-36 lg:justify-end lg:px-96'>
        <SettingsIcon className="cursor-pointer" color="black" size={30} />
        <ShieldQuestionIcon className="cursor-pointer" color="black" size={30} onClick={HandleHelpButton} />
      </div>
    )
  }

  const WordButton = ({ id, word, selected }) => {
    return (
      <button 
        className={`w-full h-18 ${selected ? selectedColor : unselectedColor} rounded-lg drop-shadow-sm lg:h-24`}
        onClick={() => handleWordButtonClick(id)}
      >
        <h1 className='text-black font-bold text-xs uppercase select-none lg:text-2xl break-all' style={{ whiteSpace: 'pre-wrap', overflow: 'hidden' }}>{word}</h1>
      </button>
    )
  }

  const CorrectRow = ({ category, difficulty, answer }) => {
    return (
      <div className={`flex flex-col justify-center items-center col-span-4 h-24 ${STRING_TO_COLOR[difficulty]} px-60 rounded-lg`}>
        <h1 className='text-black font-bold text-xl uppercase select-none'>{category}</h1>
        <div className='flex flex-row justify-center items-center gap-3 uppercase select-none'>
          {
            answer.map((word, i) => (
              <h1 key={i}>{word.text}</h1>
            ))
          }
        </div>
      </div>
    )
  }


  return (
    <main className={`absolute flex flex-col justify-start items-center w-full h-full bg-white border-black border-y gap-10 p-2 transition-opacity duration-300 ${state ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}> 

      <Settings />
      <PopUp active={popup} setActive={setPopup} content={popupInfo} history={answerHistory} handleNotification={handleNotification} />
      <Notification active={notification} setActive={setNotification} content={notificationInfo} />

      <h1 className='text-xl select-none'>¡Crea grupos de cuatro!</h1>

      <div className={`h-1/2 grid grid-rows-${MAX_ROWS - rowsCompleted.length} grid-cols-4 gap-3 p-5`}>

        {
          rowsCompleted.map((row, i) => (
            <CorrectRow 
              key={i}
              category={row.category}
              difficulty={row.difficulty}
              answer={row.answer}
            />
          ))
        }
        {
          words.map((word, i) => (
            <WordButton key={i} id={i} word={word.text} selected={selected[i]} />
          ))
        }
      </div>
      
      {
        winStatus === "" ? (
          <div className='flex flex-row justify-center items-center w-1/2 gap-3 select-none'>
            <h1>Errores restantes: </h1>
            <div className='flex flex-row justify-start items-center gap-3'>
              {
                range(0, MAX_MISTAKES).map((mistake, i) => (
                  <div key={i} className={`${i >= mistakesRemaining ? "w-0" : "w-4"} ${i >= mistakesRemaining ? "h-0" : "h-4"} bg-yellow-400 rounded-full transition-all duration-700 select-none`}/>
                ))
              }
            </div>
          </div>
        ) : (<></>)
      }

      <div className='flex flex-row justify-center items-center w-1/2 gap-3'>
        {
          winStatus === "" ? (
            <>
              <button 
                className='px-6 py-3 bg-white border-black border rounded-full'
                onClick={() => { shuffleWords(); deselectWords() }}
              >
                <h1 className='text-xs font-medium select-none lg:text-md'>Barajar</h1>
              </button>

              <button 
                className='px-6 py-3 bg-white border-black border rounded-full'
                onClick={deselectWords}
              >
                <h1 className='text-xs font-medium select-none lg:text-md'>Deseleccionar Todo</h1>
              </button>

              <button 
                className={`${selectedCount === 4 ? enabledColor + " text-white border-black" : disabledColor + " text-gray-400 border-gray-400"} border px-6 py-3 rounded-full`}
                onClick={handleSubmit}
              >
                <h1 className='text-xs font-medium select-none lg:text-md'>Entregar</h1>
              </button>
            </>
          ) : (
            <button 
              className='px-6 py-3 bg-white border-black border rounded-full'
              onClick={() => { 
                handlePopup(winStatus);
              }}
            >
              <h1 className='text-xs font-medium select-none lg:text-md'>Resultados</h1>
            </button>
          )
        }
      </div>

    </main>
  )
}

function getSelectedColors() {
  return ["bg-yellow-400", "bg-yellow-200"];
}
function getEnabledColors() {
  return ["bg-black", "bg-white"];
}

export default Home;
