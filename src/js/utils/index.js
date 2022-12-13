const currentTime = () => Math.floor(Date.now() / 1000)

const formatDate = t => (new Date(t * 1000)).toLocaleDateString()

export {
	currentTime,
	formatDate
}