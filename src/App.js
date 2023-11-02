import { useState } from 'react';
import './App.css';
import Header from './components/header';
import Footer from './components/footer';

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
        <div className='w-20 h-20 bg-white'/>
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
        <h1 className="text-md font-bold">November 2, 2023</h1>
        <h1 className='text-sm'>By Aidan Ouckama</h1>
      </div>

    </main>
  )
}

const Game = ({ state }) => {


  const solution = {
    "synonyms": ["word1", "word2", "word3", "word4"],
    "synonyms 2": ["word5", "word6", "word7", "word8"],
    "synonyms 3": ["word9", "word10", "word11", "word12"],
    "synonyms 4": ["word13", "word14", "word15", "word16"]
  }


  const Settings = () => {
    return (
      <div className='flex flex-row justify-end items-center w-full h-24 bg-white border-black border-b gap-5 px-96'> 
        <h1>set</h1>
        <h1>?</h1>
      </div>
    )
  }

  const WordButton = () => {
    return (
      <button className='w-48 h-24 bg-yellow-100 rounded-lg drop-shadow-sm'>
        <h1 className='text-black font-bold text-2xl uppercase'>vaca</h1>
      </button>
    )
  }

  return (
    <main className={`absolute flex flex-col justify-start items-center w-full h-full bg-white border-black border-y gap-10 transition-opacity duration-300 ${state ? "opacity-100" : "opacity-0 pointer-events-none"}`}> 

      <Settings />

      <h1 className='text-xl'>¡Crea grupos de cuatro!</h1>

      <div className='grid grid-rows-4 grid-cols-4 gap-3'>
        <WordButton />
        <WordButton />
        <WordButton />
        <WordButton />
        <WordButton />
        <WordButton />
        <WordButton />
        <WordButton />
        <WordButton />
        <WordButton />
        <WordButton />
        <WordButton />
        <WordButton />
        <WordButton />
        <WordButton />
        <WordButton />
      </div>

      <div className='flex flex-row justify-center items-center w-1/2 gap-3'>
        <h1>Mistakes remaining:</h1>
        <div className='flex flex-row justify-start items-center gap-3'>
          <div className='w-4 h-4 bg-gray-500 rounded-full'/>
          <div className='w-4 h-4 bg-gray-500 rounded-full'/>
          <div className='w-4 h-4 bg-gray-500 rounded-full'/>
          <div className='w-4 h-4 bg-gray-500 rounded-full'/>
        </div>
      </div>

      <div className='flex flex-row justify-center items-center w-1/2 gap-3'>
        <button className='px-6 py-3 bg-white border-black border rounded-full'>
          <h1 className='font-medium'>Shuffle</h1>
        </button>

        <button className='px-6 py-3 bg-white border-black border rounded-full'>
          <h1 className='font-medium'>Deselect All</h1>
        </button>

        <button className='px-6 py-3 bg-white border-black border rounded-full'>
          <h1 className='font-medium'>Submit</h1>
        </button>
      </div>

    </main>
  )
}

export default Home;
