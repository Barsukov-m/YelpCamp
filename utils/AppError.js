class AppError extends Error {
	constructor(name='Something Went Wrong', status=500, message = '') {
		super();

		this.name = name;
		this.status = status;

		if (message)
			this.message = message;
	}
}

module.exports = AppError;
