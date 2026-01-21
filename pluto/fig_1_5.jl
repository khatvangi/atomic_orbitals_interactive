### A Pluto.jl notebook ###
# v0.19.0

using PlutoUI
using WGLMakie
include("common/hydrogenic.jl")
using .Hydrogenic

md"""# Figure 1.5
Energy levels E_n = -(hcR) Z^2 / n^2."""

@bind nmax Slider(3:10, default=6)
@bind showZ2 CheckBox(default=true)

Zs = showZ2 ? [1,2] : [1]

fig = Figure(resolution=(800,400))
ax = Axis(fig[1,1], xlabel="Z", ylabel="Energy (eV)")
for Z in Zs
    for n in 1:nmax
        E = energy_level(Z,n) / constants[:e]
        lines!(ax, [Z-0.15, Z+0.15], [E, E], color=Z==1 ? :steelblue : :orange)
    end
end
fig
