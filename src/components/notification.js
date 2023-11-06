const Notification = ({ active, setActive, content }) => {

    // ONE MORE POPUP
    if (content === "oneaway") {
        return (
            <div className={`flex absolute justify-center items-center w-32 h-6 ${active ? "z-10 opacity-100" : "z-10 opacity-0"} translate-y-[10.5em] bg-black transition-opacity rounded-full duration-300`}>
                <h1 className="text-white font-medium text-xs select-none">Uno de distancia...</h1>
            </div>
        )
    }

    // LOSE POPUP
    if (content === "lose") {
        return (
            <div className={`flex absolute justify-center items-center w-48 h-6 ${active ? "z-10 opacity-100" : "z-10 opacity-0"} translate-y-[10.5em] bg-black transition-opacity rounded-full duration-300`}>
                <h1 className="text-white font-medium text-xs select-none">Mejor suerte la próxima vez...</h1>
            </div>
        )
    }

    // DUPLICATE POPUP 
    if (content === "duplicate") {
        return (
            <div className={`flex absolute justify-center items-center w-48 h-6 ${active ? "z-10 opacity-100" : "z-10 opacity-0"} translate-y-[10.5em] bg-black transition-opacity rounded-full duration-300`}>
                <h1 className="text-white font-medium text-xs select-none">¡Ya lo adiviné!</h1>
            </div>
        )
    }

    // COPIED POPUP 
    if (content === "copy") {
        return (
            <div className={`flex absolute justify-center items-center w-48 h-6 ${active ? "z-10 opacity-100" : "z-10 opacity-0"} translate-y-[10.5em] bg-black transition-opacity rounded-full duration-300`}>
                <h1 className="text-white font-medium text-xs select-none">Copiada</h1>
            </div>
        )
    }
}

export default Notification;