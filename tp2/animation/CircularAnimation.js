/**
 * CircularAnimation
 * @constructor
 */
class CircularAnimation {
	constructor(center, radius, initial_angle, rotation_angle, time) {
		super(time);
		this.center = center;
		this.radius = radius;
		this.initial_angle = initial_angle;
		this.rotation_angle = rotation_angle;
	};
};