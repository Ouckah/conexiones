import './App.css';
import Header from './components/header';

function Home() {
  return (
    <div>
      <Header />
      
      <main className='flex flex-col justify-center items-center w-full h-screen bg-purple-300 gap-16'> 

        <div className='flex flex-col justify-center items-center w-full gap-8'>
          <div className='w-20 h-20 bg-white'/>
          <h1 className="text-5xl font-extrabold">Conexiones</h1>
          <p>Agrupar palabras que comparten un hilo común.</p>

          <button className='bg-black text-white font-semibold px-16 py-3 rounded-full'>Play</button>
        </div>

        <div className='flex flex-col justify-center items-center w-full gap-2'>
          <h1 className="text-md font-bold">November 2, 2023</h1>
          <h1 className='text-sm'>By Aidan Ouckama</h1>
        </div>

      </main>
    </div>
  );
}

export default Home;
