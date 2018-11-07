/**
 * LinearAnimation
 * @constructor
 */
class LinearAnimation extends Animation {
	constructor(control_points, span) {
		super(span);
		this.control_points = control_points;

		const distance = calculateTotalDistance();
		this.speed = distance / span;

		this.calcTimes();
		this.current_point = 0;
	};

	update(delta_time) {
		if(super.update(delta_time) > 0) {
			return;
		}

		let current_point_delta = this.whereami();
	}

	whereami() {
		//current point e current time para saber em que current point passo a estar
		for(let i = this.current_point; i < this.point_times.length; ++i) {
			if(this.current_time >= this.point_times[i]) {
				this.current_point = i;
				return this.current_time - this.point_times[i];
			}
		}
	}

	calcTimes() {
		let distance = 0;
		this.point_times = [];

		for (let i = 0; i < this.control_points.length - 1; ++i) {
			distance += this.calculateDistance(this.control_points[i], this.control_points[i+1]);
			this.point_times.push(distance/this.speed);
		}
	}

	calculateTotalDistance() {
		let distance = 0;

		for(let i = 0; i < this.control_points.length - 1; ++i) {
			distance += this.calculateDistance(this.control_points[i], this.control_points[i+1]);
		}

		return distance;
	}

	calculateDistance(p1, p2) {
		const v = calculateVector(p1, p2);

		return Math.sqrt(Math.pow(v.xx, 2) + Math.pow(v.yy, 2) + Math.pow(v.zz, 2));
	}

	calculateVector(p1, p2) {
		return {
			xx: p2.xx - p1.xx,
			yy: p2.yy - p1.yy,
			zz: p2.zz - p1.zz
		};
	}
};