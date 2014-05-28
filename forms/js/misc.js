var initial_values = true;

function check_val(input) {
	$(input).val() != "" ? $(input).addClass("has_value") : $(input).removeClass("has_value");
}

function update_val(input) {
	real_input = $(input).attr("data-id");

	real_value = $("#"+real_input).val();
	our_value = $(input).val();

	if(initial_values) {
		//grabs real form values and places in fake form if it's value is not nothing
		
		if($(input).hasClass("override")){ 
			$("#"+real_input).val(our_value);
		} else {
			real_value ? $(input).val(real_value) : $("#"+real_input).val(our_value);
		}
	} else {
		//grabs fake form values and places in real form
		$("#"+real_input).val(our_value);
	}
}

$(document).ready(function(){
	$(".check_val").each(function(){
		console.log(initial_values);
		place  = $(this).attr("placeholder");
		is_select = $(this).is("select");

//		Adding required co-aligns with .fake_place's css. We use the required attr
//		so that we can use :valid/:invalid pseudo selectors to get instant feedback
//		on showing or hiding the div. Using the has_value class added a slight
//		delay to hiding the text.

		$(this).attr("placeholder", "").attr("required","required");
		fake_place = '<div class="fake_place">'+place+'</div>';
		label = '<div class="label">'+place+'</div>';

		if(!is_select) $(fake_place).insertAfter(this);
		$(label).insertAfter(this);

		update_val(this);
		check_val(this);
	}).on("keydown keyup click blur focus change paste", function(){
		update_val(this);
		check_val(this);
	});

	initial_values = false;
});