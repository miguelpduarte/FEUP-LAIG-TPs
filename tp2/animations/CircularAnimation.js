/**
 * CircularAnimation
 * @constructor
 */
class CircularAnimation extends Animation {
	constructor(center, radius, initial_angle, rotation_angle, span) {
		super(span);
		this.center = center;
		this.radius = radius;
		this.initial_angle = initial_angle;
		this.rotation_angle = rotation_angle;
		this.angular_speed = rotation_angle/span;
	};

	update(delta_time) {
		if (this.isFinished()) {
			return;
		}

		super.update(delta_time);

		
	}
};