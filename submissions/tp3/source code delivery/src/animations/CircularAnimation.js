/**
 * CircularAnimation
 * @constructor
 */
class CircularAnimation extends Animation {
	constructor(center, radius, initial_angle, rotation_angle, span) {
		super(span);
		this.center = center;
		this.radius = radius;
		// Saving for resetting animations later on		
		this.initial_angle = initial_angle;
		this.current_angle = initial_angle * Math.PI / 180;
		this.angular_speed = (rotation_angle * Math.PI / 180)/this.span;
		this.orientation = rotation_angle >= 0 ? Math.PI : 0;
	};

	apply(scene) {
		scene.translate(...Object.values(this.center));
		scene.rotate(this.current_angle, 0, 1, 0);
		scene.translate(this.radius, 0, 0);
		scene.rotate(this.orientation, 0, 1, 0);
	}

	update(delta_time) {
		let remaining_time = super.update(delta_time);

		this.current_angle += this.angular_speed * delta_time;

		return remaining_time;
	}

	reset() {
		super.reset();
		this.current_angle = this.initial_angle * Math.PI / 180;
	}
};