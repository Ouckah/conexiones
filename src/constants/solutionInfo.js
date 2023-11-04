const difficultyColors = ["bg-yellow-100", "bg-green-200", "bg-blue-100", "bg-purple-200"];
const [easyColor, mediumColor, hardColor, impossibleColor] = difficultyColors;
export const STRING_TO_COLOR = {
    "easy": easyColor,
    "medium": mediumColor,
    "hard": hardColor,
    "impossible": impossibleColor
}

export const STRING_TO_EMOJI = {
    "easy": "🟨",
    "medium": "🟩",
    "hard": "🟦",
    "impossible": "🟪"
}

export const WORD_INDEX_INFO = [0, 1];