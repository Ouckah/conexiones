import { X } from "lucide-react";
import { STRING_TO_COLOR, STRING_TO_EMOJI } from "../constants/solutionInfo";
import Timer from "./timer";

const PopUp = ({ active, setActive, content, history, handleNotification }) => {

    // HELP POPUP
    if (content === "help") {
        return (
            <div 
                className={`flex absolute justify-center items-center ${active ? "w-full h-full z-10 pointer-events-auto" : "w-0 h-0 z-10 pointer-events-none"} backdrop-blur-sm transition-all duration-300`}
                onClick={() => {} /* TODO: make so it only activates when click is outside of inner box */}
            >
    
                <div className={`flex flex-col justify-items-center items-start ${active ? "w-full h-[35em] z-20 pointer-events-auto" : "w-0 h-0 z-0 pointer-events-none hidden"} z-20 p-3 bg-white rounded-lg drop-shadow-xl gap-2 sm:w-[30em] sm:p-8`}>
                    <X className="self-end cursor-pointer" color="black" size={30} onClick={() => setActive(false)} />
                    
                    <h1 className="text-black font-extrabold text-2xl">Cómo jugar Conexiones</h1>
                    
                    <div>
                        <h2 className="text-black font-bold text-sm">Encuentra grupos de cuatro elementos que tengan algo en común.</h2>
                        <p>• Seleccione cuatro elementos y toque 'Enviar' para verificar si su suposición es correcta.</p>
                        <p>• ¡Encuentra los grupos sin cometer 4 errores!</p>
                    </div>

                    <div>
                        <h2 className="text-black font-bold text-sm">Ejemplos de Categorías</h2>
                        <p>• PESCADO: Lubina, Platija, Salmón, Trucha</p>
                        <p>• FUEGO ___: Hormiga, Taladro, Isla, Ópalo</p>
                    </div>

                    <h3>Cada rompecabezas tiene exactamente una solución. ¡Cuidado con las palabras que parecen pertenecer a múltiples categorías!</h3>

                    <div className="flex flex-col justify-start items-start">
                        <h3>A cada grupo se le asigna un color, que se revelará a medida que resuelvas:</h3>
                        <div className="flex flex-row items-center gap-2">
                            <div className="w-5 h-5 bg-yellow-100" />
                            <h1>Fácil</h1>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <div className="w-5 h-5 bg-green-200" />
                            <h1>Medio</h1>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <div className="w-5 h-5 bg-blue-100" />
                            <h1>Duro</h1>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <div className="w-5 h-5 bg-purple-200" />
                            <h1>Imposible</h1>
                        </div>
                    </div>
                </div>
    
            </div>
        )
    }

    // pastable for user to copy and share
    let resultPastable = "Conexión\n";
    for (const answer of history) {
        for (const word of answer) {
            resultPastable += STRING_TO_EMOJI[word.difficulty];
        }
        resultPastable += "\n";
    }

    // LOSE / WIN POPUP
    if (content === "lose" || content === "win") {

        function getPuzzleNumber() {
            // Specify the certain date in YYYY-MM-DD format
            const certainDate = '2023-11-6'; // date of the first official conexiones puzzle

            // Parse the certain date into a JavaScript Date object
            const certainDateObj = new Date(certainDate);

            // Get the current date
            const currentDate = new Date();

            // Calculate the time difference in milliseconds
            const timeDifference = currentDate - certainDateObj;

            // Convert milliseconds to days
            let daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

            // increment by one (puzzles 1-indexed)
            daysDifference++;

            return daysDifference
        }

        return (
            <div 
                className={`flex absolute justify-center items-center ${active ? "w-full h-full z-10 pointer-events-auto" : "w-0 h-0 z-10 pointer-events-none"} backdrop-blur-sm transition-all duration-300`}
                onClick={() => {} /* TODO: make so it only activates when click is outside of inner box */}
            >
    
                <div className={`flex flex-col justify-items-center items-center ${active ? "w-[30em] h-[35em] z-20 pointer-events-auto" : "w-0 h-0 z-0 pointer-events-none hidden"} z-20 p-8 gap-3 bg-white rounded-lg drop-shadow-xl`}>
                    <X className="self-end cursor-pointer" color="black" size={30} onClick={() => setActive(false)} />

                    <h1 className="text-black font-extrabold text-2xl">{content === "lose" ? "¡La próxima vez!" : "¡Bien hecho!"}</h1>
                    <h2 className="text-black font-light text-lg">Conexiones</h2>
                    <h2 className="text-black font-semibold text-md">Puzzle #{getPuzzleNumber()}</h2>

                    <div className="grid grid-cols-4 gap-y-1">
                    {
                        history.map((answer, i) => (
                            answer.map((word, j) => (
                                <div key={i * 4 + j} className={`w-10 h-10 ${STRING_TO_COLOR[word.difficulty]} rounded-lg`}></div>
                            ))
                        ))
                    }
                    </div>

                    <Timer />

                    <button 
                        className="bg-black px-12 py-3 rounded-full"
                        onClick={() => {
                            handleNotification("copy");
                            navigator.clipboard.writeText(resultPastable)
                        }}
                    >
                        <h1 className="text-white font-medium">Compartir</h1>
                    </button>
                </div>
    
            </div>
        )
    }
}

export default PopUp;