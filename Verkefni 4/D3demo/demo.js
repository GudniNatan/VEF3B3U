(function () {
let maxlevel = [];
let setNumber = 0;

class Course{
	constructor(courseNumber, restrictorCourses, domElement, courseName='', courseCredits='',){
		this.courseNumber = courseNumber;
		this.restrictorCourses = restrictorCourses;
		this.courseName = courseName;
		this.courseCredits = courseCredits;
		this.domElement = domElement;
		this.level = 0;
		if (restrictorCourses && restrictorCourses.length) {
			this.set = restrictorCourses[0].set;
		}
		else{
			this.set = setNumber++;
		}
		while (maxlevel.length < this.set) {
			maxlevel.push(0);
		}
		if (restrictorCourses && restrictorCourses.length) {
			let n = 0;
			for (var i = restrictorCourses.length - 1; i >= 0; i--) {
				n = Math.max(restrictorCourses[i].level, n);
			}
			this.level = n + 1;
			maxlevel[this.set] = Math.max(this.level, maxlevel[this.set]);
		}
	}
}

let courses = [];
let svgContainer;


function main() {
	// body...
	let coursesDOM = document.querySelectorAll(".course");
	svgContainer = d3.select("body").select("#courseContainer").append("svg");

	for (let i = 0; i < coursesDOM.length; i++) {
		let preString =JSON.parse(coursesDOM[i].dataset.precursors);
		let pre = [];
		for (let j = preString.length - 1; j >= 0; j--) {
			pre.push(get_course(courses, preString[j]));
		}
		let c = new Course(coursesDOM[i].id, pre, coursesDOM[i]);
		courses.push(c);
	}
	let courseContainer = d3.select("#courseContainer");
	for (var i = 0; i <= setNumber; i++) {
		courseContainer.append("div").attr("id", `set${i}`).attr("class", "set");
	}
	for (let i = 0; i < courses.length; i++) {
		//courses[i].domElement.style.marginTop = `${courses[i].level * 8}em`;
		let el = courses[i].domElement;
		if (!d3.select(`#set${courses[i].set} .level${courses[i].level}`).node()) {
			d3.select(`#set${courses[i].set}`).append("div")
					.attr("class", `level${courses[i].level} level`);
		}
		courses[i].domElement = d3.select(`#set${courses[i].set} .level${courses[i].level}`).append(function() {
			// body...
			return d3.select(el).remove().node();
		}).node();
	}
	courseContainer.style("display", "flex");
	draw();


}

function draw() {
	// body...

	//Clear all svg lines
	svgContainer.selectAll("line").remove();
	let bRect = d3.select("body").node().getBoundingClientRect();
	svgContainer.attr("height", bRect.height).attr("width", bRect.width);


	//Draw lines between all courses and their restrictorCourses
	for (let i = courses.length - 1; i >= 0; i--) {
		let c = courses[i];
		let restrictors = courses[i].restrictorCourses;
		for (let j = restrictors.length - 1; j >= 0; j--) {
			//Draw line from this course 
			drawLine(c.domElement, restrictors[j].domElement);

		}
	}
	let color = d3.schemeCategory20;
	svgContainer.selectAll("line").attr("stroke",function(d,i){return color[i%20];});
}
function get_course(courses, id) {
	// body...
	for (var i = courses.length - 1; i >= 0; i--) {
		if(courses[i].courseNumber == id)
		{
			return courses[i];
		}
	}
	return undefined;
}
function drawLine(domNode1, domNode2) {
	// body...
	let r1 = domNode1.getBoundingClientRect();
	let r2 = domNode2.getBoundingClientRect();
	let r1x = (r1.left + r1.right) / 2; 
	let r1y = (r1.top + r1.bottom) / 2; 
	let r2x = (r2.left + r2.right) / 2; 
	let r2y = (r2.top + r2.bottom) / 2; 
	svgContainer.append("line")
			.attr("x1", r1x + window.scrollX)
			.attr("y1", r1y + window.scrollY)
			.attr("x2", r2x + window.scrollX)
			.attr("y2", r2y + window.scrollY)
			.attr("stroke-width", 3)
			//.attr("stroke", "black");
	//svgContainer.style("left", -window.scrollX).style("top", -window.scrollY);
}

window.addEventListener("load", main, true);
window.addEventListener("resize", draw);

})();