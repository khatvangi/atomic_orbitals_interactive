### A Pluto.jl notebook ###
# v0.19.0

using PlutoUI
using WGLMakie
include("common/hydrogenic.jl")
using .Hydrogenic

md"""# Figure 1.8
Radial wavefunctions R_n0 for 1s, 2s, 3s vs x=Zr/a0."""

@bind Z Slider(1:3, default=1)

xs = range(0, 30; length=400)
rs = [x*a0/Z for x in xs]
R1 = [R_nl(1,0,r; Z=Z) for r in rs]
R2 = [R_nl(2,0,r; Z=Z) for r in rs]
R3 = [R_nl(3,0,r; Z=Z) for r in rs]

fig = Figure(resolution=(800,400))
ax = Axis(fig[1,1], xlabel="x = Zr/a0", ylabel="R_n0")
lines!(ax, xs, R1, color=:red, label="1s")
lines!(ax, xs, R2, color=:green, label="2s")
lines!(ax, xs, R3, color=:blue, label="3s")
axislegend(ax)
fig
