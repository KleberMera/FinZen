export enum TitleGradient {
    INDIGO_PURPLE = 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400',
    BLUE_CYAN = 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400',
    RED_ORANGE = 'bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 dark:from-red-400 dark:via-orange-400 dark:to-yellow-400',
    GREEN_EMERALD = 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400',
    PURPLE_PINK = 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400',
    BLUE_INDIGO = 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400',
    AMBER_ORANGE = 'bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 dark:from-amber-400 dark:via-orange-400 dark:to-red-400',
    EMERALD_LIME = 'bg-gradient-to-r from-emerald-600 via-lime-600 to-yellow-600 dark:from-emerald-400 dark:via-lime-400 dark:to-yellow-400',
    ROSE_PINK = 'bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 dark:from-rose-400 dark:via-pink-400 dark:to-fuchsia-400',
    VIOLET_PURPLE = 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400',
    CYAN_SKY = 'bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 dark:from-cyan-400 dark:via-sky-400 dark:to-blue-400',
    LIME_GREEN = 'bg-gradient-to-r from-lime-600 via-green-600 to-emerald-600 dark:from-lime-400 dark:via-green-400 dark:to-emerald-400',
    YELLOW_AMBER = 'bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 dark:from-yellow-400 dark:via-amber-400 dark:to-orange-400',
    TEAL_CYAN = 'bg-gradient-to-r from-teal-600 via-cyan-600 to-sky-600 dark:from-teal-400 dark:via-cyan-400 dark:to-sky-400',

    // Nuevas combinaciones de 3 colores
    FUCHSIA_PURPLE_PINK = 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-600 dark:from-fuchsia-400 dark:via-purple-400 dark:to-pink-400',
    SKY_BLUE_INDIGO = 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-400',
    EMERALD_TEAL_CYAN = 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400',
    ORANGE_AMBER_YELLOW = 'bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 dark:from-orange-400 dark:via-amber-400 dark:to-yellow-400'
}

// Nueva enumeración para gradientes simples de 2 colores
export enum SimpleGradient {
    INDIGO_PURPLE = 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400',
    BLUE_CYAN = 'bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400',
    RED_ORANGE = 'bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400',
    GREEN_EMERALD = 'bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400',
    PURPLE_PINK = 'bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400',
    AMBER_YELLOW = 'bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400',
    TEAL_CYAN = 'bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400',
    ROSE_FUCHSIA = 'bg-gradient-to-r from-rose-600 to-fuchsia-600 dark:from-rose-400 dark:to-fuchsia-400',
    SKY_BLUE = 'bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400',
    LIME_GREEN = 'bg-gradient-to-r from-lime-600 to-green-600 dark:from-lime-400 dark:to-green-400'
}

// Nueva enumeración para colores sólidos con efecto hover
export enum SolidColor {
    INDIGO = 'text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300',
    BLUE = 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300',
    RED = 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300',
    GREEN = 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300',
    PURPLE = 'text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300',
    AMBER = 'text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300',
    TEAL = 'text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300',
    ROSE = 'text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300',
    CYAN = 'text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300',
    EMERALD = 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300'
}
