import { formatDate } from "../utils/game";

const Header = () => {
    return (
        <div className="flex flex-row justify-start items-end w-screen h-36 bg-white px-10 py-12 gap-5 select-none lg:px-24">
            <h1 className="text-2xl font-extrabold lg:text-4xl">Conexiones</h1>
            <h1 className="text-xl font-light lg:text-2xl">{formatDate()}</h1>
        </div>
    )
}

export default Header;