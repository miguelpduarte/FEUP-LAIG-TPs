/**
 * Animation
 * @constructor
 */
class Animation {
	constructor(span) {
		this.span = span;
		this.current_time = 0;
	};
	
	update(delta_time) {
		this.current_time += delta_time;
	}

	isFinished() {
		return this.current_time > this.span;
	}
};