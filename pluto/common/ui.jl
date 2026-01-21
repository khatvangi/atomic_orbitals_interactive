module UI

using PlutoUI

export int_slider, float_slider

int_slider(label, range; default=first(range)) = @bind val Slider(range, default=default, show_value=true)

float_slider(label, range; default=first(range)) = @bind val Slider(range, default=default, show_value=true)

end # module
