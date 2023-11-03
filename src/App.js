import './App.css';
import Header from './components/header';
import Footer from './components/footer';
import { Settings as SettingsIcon, ShieldQuestion as ShieldQuestionIcon, Cable as CableIcon } from 'lucide-react';

import { useRef, useState } from 'react';

import { compare, formatDate, range, shuffle } from './utils/game';

function Home() {

  const [playing, setPlaying] = useState(false);

  return (
    <div>
      <Header />
      
      <div className='w-full h-screen relative pointer-events-none'>
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
  const [easyColor, mediumColor, hardColor, impossibleColor] = getDifficultyColors();

  const STRING_TO_COLOR = {
    "easy": easyColor,
    "medium": mediumColor,
    "hard": hardColor,
    "impossible": impossibleColor
  }

  // solution to the puzzle
  const [DIFFICULTY, WORDS] = [0, 1];
  const solutions = {
    "girar": ["easy", ["centrifugado", "enrollar", "retorcer", "revolver"]],
    "risa": ["medium", ["risilla", "carcajada", "grito", "risita"]],
    "beso": ["hard", ["morreo", "besote", "besito", "besar"]],
    "amor": ["impossible", ["cariño", "adoración", "devoción", "intimidad"]]
  }
  const [words, setWords] = useState(Object.values(solutions).flatMap(value => value[WORDS]));

  // create array keeping track of when wordbuttons are selected
  const [selected, setSelected] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);

  // keep track of mistakes made
  const MAX_MISTAKES = 4;
  const [mistakesRemaining, setMistakesRemaining] = useState(MAX_MISTAKES);

  // keep track of rows completed
  const MAX_ROWS = 4;
  const [rowsCompleted, setRowsCompleted] = useState([]);


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

  function handleSubmit() {
    // do not accept answers less than 4
    if (selectedCount !== 4) return;

    // get all words that are currently selected
    const answer = getSelectedWords();

    // stores the category and difficulty of 
    // the possible correct answer
    let category;
    let difficulty;

    // flag that flags when a solution matches
    // the guessed words
    let found = false;

    // loop through each category in the solution
    for (const cat of Object.keys(solutions)) {
      const diff = solutions[cat][DIFFICULTY]; 
      const solution = solutions[cat][WORDS]; 

      // if we find a category of words that matches
      // the words guessed, flag and set category
      if (compare(answer, solution)) {
        found = true;
        category = cat;
        difficulty = diff;
        break;
      }
    }

    // handle whether the flag was set or not
    if (found) handleCorrectSubmit(category, difficulty, answer);
    else handleWrongSubmit();
  }

  function handleCorrectSubmit(category, difficulty, answer) {
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
  }

  function handleWrongSubmit() {
    setMistakesRemaining((prevMistakesRemaining) => prevMistakesRemaining - 1);
  }


  // initially shuffle the words and reset selected words
  if (!setup.current) {
    shuffleWords();
    deselectWords();

    // flags as setup
    setup.current = true;
  }


  const Settings = () => {
    return (
      <div className='flex flex-row justify-end items-center w-full h-24 bg-white border-black border-b gap-5 px-96'> 
        <SettingsIcon className="cursor-pointer" color="black" size={30} />
        <ShieldQuestionIcon className="cursor-pointer" color="black" size={30} />
      </div>
    )
  }

  const WordButton = ({ id, word, selected }) => {
    return (
      <button 
        className={`w-48 h-24 ${selected ? selectedColor : unselectedColor} rounded-lg drop-shadow-sm`}
        onClick={() => handleWordButtonClick(id)}
      >
        <h1 className='text-black font-bold text-2xl uppercase select-none'>{word}</h1>
      </button>
    )
  }

  const CorrectRow = ({ category, difficulty, answer }) => {
    return (
      <div className={`flex flex-col justify-center items-center col-span-4 h-24 ${STRING_TO_COLOR[difficulty]} px-60 rounded-lg`}>
        <h1 className='text-black font-bold text-xl uppercase select-none'>{category}</h1>
        <div className='flex flex-row justify-center items-center gap-3 uppercase select-none'>
          {
            answer.map((word) => (
              <h1>{word}</h1>
            ))
          }
        </div>
      </div>
    )
  }


  return (
    <main className={`absolute flex flex-col justify-start items-center w-full h-full bg-white border-black border-y gap-10 transition-opacity duration-300 ${state ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}> 

      <Settings />

      <h1 className='text-xl select-none'>¡Crea grupos de cuatro!</h1>

      <div className={`grid grid-rows-${MAX_ROWS - rowsCompleted.length} grid-cols-4 gap-3`}>

        {
          rowsCompleted.map((row) => (
            <CorrectRow 
              category={row.category}
              difficulty={row.difficulty}
              answer={row.answer}
            />
          ))
        }
        {
          words.map((word, i) => (
            <WordButton key={i} id={i} word={word} selected={selected[i]} />
          ))
        }
      </div>

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

      <div className='flex flex-row justify-center items-center w-1/2 gap-3'>
        <button 
          className='px-6 py-3 bg-white border-black border rounded-full'
          onClick={() => { shuffleWords(); deselectWords() }}
        >
          <h1 className='font-medium select-none'>Barajar</h1>
        </button>

        <button 
          className='px-6 py-3 bg-white border-black border rounded-full'
          onClick={deselectWords}
        >
          <h1 className='font-medium select-none'>Deseleccionar Todo</h1>
        </button>

        <button 
          className={`${selectedCount === 4 ? enabledColor + " text-white border-black" : disabledColor + " text-gray-400 border-gray-400"} border px-6 py-3 rounded-full`}
          onClick={handleSubmit}
        >
          <h1 className='font-medium select-none'>Entregar</h1>
        </button>
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
function getDifficultyColors() {
  return ["bg-yellow-100", "bg-green-200", "bg-blue-100", "bg-purple-200"];
}

export default Home;
