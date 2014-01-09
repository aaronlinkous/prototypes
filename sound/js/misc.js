var dims = [], room_w, room_h, room_l;

function intersection(array1, array2) {
	return array1.filter(function (n) { return array2.indexOf(n) !== -1; });
}

function multi_intersection(arrays) {
	var result = [],
		i = j = k = 0,
		inter = null;
		for(i = 0; i < arrays.length; i++) {
			for(j = i + 1; j < arrays.length; j++) {
			inter = intersection(arrays[i], arrays[j]);
			for(k = 0; k < inter.length; k++) {
				result.push(inter[k]);
			}
		}
	}

	return uniq(result);
}

function uniq(array) {
	var result = [];
	for (var i = 0; i < array.length; i++) {
		if (result.indexOf(array[i]) === -1) result.push(array[i]);
	}

	$.each(result, function(i, hz){
		$("#modes tr td").filter(function() {
			return $(this).text() == hz+"hz";
		}).addClass("emphasized");
	});
}

function room_modes() {
	$("#axial_resonance_width").text("");
	$("#axial_resonance_height").text("");
	$("#axial_resonance_length").text("");

	var modes = [];
	$.each(dims, function (wall, inches) {
		first_mode = 1130 / (2 * (inches / 12));
		hz = first_mode;
		var new_modes = [];
		for (i = 1; hz < 300 - first_mode; i++) {
			hz = Math.ceil(first_mode * i);
			new_modes.push(hz);

			if(wall == 0) $('<td>'+hz+'hz</td>').appendTo("#axial_resonance_width");
			if(wall == 1) $('<td>'+hz+'hz</td>').appendTo("#axial_resonance_height");
			if(wall == 2) $('<td>'+hz+'hz</td>').appendTo("#axial_resonance_length");
		}
		modes.push(new_modes);
	});

/* 	Now that we have the modes, we need to show the emphasized nodes */
	multi_intersection(modes)
}

$(document).ready(function(){
	$("#room_dimensions").on("click", function(e) {
		room_w = $("#room_width").val() || 0;
		room_h = $("#room_height").val() || 0;
		room_l = $("#room_length").val() || 0;

		dims = [room_w,room_h,room_l];

		room_modes();
	});
});