import { X } from "lucide-react";
import { STRING_TO_COLOR, STRING_TO_EMOJI } from "../constants/solutionInfo";
import Timer from "./timer";

const PopUp = ({ active, setActive, content, history }) => {

    // HELP POPUP
    if (content === "help") {
        return (
            <div 
                className={`flex absolute justify-center items-center ${active ? "w-full h-full z-10 pointer-events-auto" : "w-0 h-0 z-10 pointer-events-none"} backdrop-blur-sm transition-all duration-300`}
                onClick={() => {} /* TODO: make so it only activates when click is outside of inner box */}
            >
    
                <div className={`flex flex-col justify-items-center items-start ${active ? "w-[30em] h-[35em] z-20 pointer-events-auto" : "w-0 h-0 z-0 pointer-events-none hidden"} z-20 p-8 bg-white rounded-lg drop-shadow-xl`}>
                    <X className="self-end cursor-pointer" color="black" size={30} onClick={() => setActive(false)} />
                    
                    <h1 className="text-black font-extrabold text-2xl">Cómo jugar Conexiones</h1>
                    <h2 className="text-black font-bold text-sm">Encuentra grupos de cuatro elementos que tengan algo en común.</h2>
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
        return (
            <div 
                className={`flex absolute justify-center items-center ${active ? "w-full h-full z-10 pointer-events-auto" : "w-0 h-0 z-10 pointer-events-none"} backdrop-blur-sm transition-all duration-300`}
                onClick={() => {} /* TODO: make so it only activates when click is outside of inner box */}
            >
    
                <div className={`flex flex-col justify-items-center items-center ${active ? "w-[30em] h-[35em] z-20 pointer-events-auto" : "w-0 h-0 z-0 pointer-events-none hidden"} z-20 p-8 gap-3 bg-white rounded-lg drop-shadow-xl`}>
                    <X className="self-end cursor-pointer" color="black" size={30} onClick={() => setActive(false)} />

                    <h1 className="text-black font-extrabold text-2xl">{content === "lose" ? "¡La próxima vez!" : "¡Bien hecho!"}</h1>
                    <h2 className="text-black font-light text-lg">Conexiones</h2>

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
                        onClick={() => {navigator.clipboard.writeText(resultPastable)}}
                    >
                        <h1 className="text-white font-medium">Compartir</h1>
                    </button>
                </div>
    
            </div>
        )
    }
}

export default PopUp;