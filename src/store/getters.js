export const name = (state) => {
	return state.name
}

export const age = (state) => {
	return state.age
}

export const other = (state) => {
	return `my name is ${state.name}, I am ${state.age}`
}