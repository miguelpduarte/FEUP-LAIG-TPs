/**
 * Animation
 * @constructor
 */
class Animation {
	constructor(span) {
		this.span = span * 1000;	// seconds to miliseconds
		this.current_time = 0;
	};
	
	update(delta_time) {
		this.current_time += delta_time;

		return Math.max(0, this.current_time - this.span);
	}

	isFinished() {
		return this.current_time >= this.span;
	}
};