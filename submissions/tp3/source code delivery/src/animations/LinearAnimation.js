/**
 * LinearAnimation
 * @constructor
 */
class LinearAnimation extends Animation {
	constructor(control_points, span) {
		super(span);
		this.control_points = control_points;

		this.initial_orientation = {
			xx: 0,
			yy: 0,
			zz: 1
		}

		this.translation = control_points[0];
		this.orientation_angle = 0;
		
		const distance = this.calculateTotalDistance();
		this.speed = distance / this.span;

		this.calculateTimes();
		this.current_point = 0;

		this.calculateCurrentOrientationAngle();
	};

	apply(scene) {
		scene.translate(...Object.values(this.translation));
		scene.rotate(this.orientation_angle, 0, 1, 0);
	}

	update(delta_time) {
		let remaining_time = super.update(delta_time);

		if (this.isFinished()) {
			this.translation = this.control_points[this.control_points.length - 1];
			return remaining_time;
		}
		
		// Calculate Animation Translation
		let progress_percentage = this.calculateCurrentLocation();
		let control_point = this.control_points[this.current_point];
		let orientation_vector = this.calculateVector(this.control_points[this.current_point], this.control_points[this.current_point+1]);

		this.translation = {
			xx: control_point.xx + orientation_vector.xx * progress_percentage,
			yy: control_point.yy + orientation_vector.yy * progress_percentage,
			zz: control_point.zz + orientation_vector.zz * progress_percentage
		};

		return remaining_time;
	}

	calculateCurrentLocation() {
		//current point e current time para saber em que current point passo a estar
		for(let i = this.current_point; i < this.control_points.length - 1; ++i) {
			if(this.current_time < this.point_times[i+1]) {
				return (this.current_time - this.point_times[i])/(this.point_times[i+1]-this.point_times[i]);
			} else {
				this.current_point = i + 1;
				this.calculateCurrentOrientationAngle();
			}
		}

		// progress is 100%, animation is over
		return 1;
	}

	calculateCurrentOrientationAngle() {
		if (this.current_point < this.control_points.length - 1) {
			// Ignore yy direction to obtain "helicopter like" movement
			let origin_control_point = {...this.control_points[this.current_point]};
			let target_control_point = {...this.control_points[this.current_point+1]};
			origin_control_point.yy = 0;
			target_control_point.yy = 0;

			let orientation_versor = this.calculateVersor(origin_control_point, target_control_point);
			
			// When movement happens along the y direction, assume standard orientation
			if (origin_control_point.xx === 0 && origin_control_point.zz === 0 &&
				target_control_point.xx === 0 && target_control_point.zz === 0) {
				
				orientation_versor = {xx:0, yy:0, zz:1};
			}

			this.orientation_angle = 
				Math.acos(this.initial_orientation.xx*orientation_versor.xx + this.initial_orientation.zz*orientation_versor.zz) * 
				(orientation_versor.xx < 0 ? -1 : 1);
		}
	}

	calculateTimes() {
		let distance = 0;
		this.point_times = [0];

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
		const v = this.calculateVector(p1, p2);

		return Math.sqrt(Math.pow(v.xx, 2) + Math.pow(v.yy, 2) + Math.pow(v.zz, 2));
	}

	calculateVector(p1, p2) {
		return {
			xx: p2.xx - p1.xx,
			yy: p2.yy - p1.yy,
			zz: p2.zz - p1.zz
		};
	}

	calculateVersor(p1, p2) {
		let vector = this.calculateVector(p1, p2);
		let vector_modulus = this.calculateDistance(p1, p2);

		return {
			xx: vector.xx / vector_modulus,
			yy: vector.yy / vector_modulus,
			zz: vector.zz / vector_modulus
		}
	}

	reset() {
		super.reset();
		this.current_point = 0;
	}
};