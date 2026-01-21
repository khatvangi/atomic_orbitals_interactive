### A Pluto.jl notebook ###
# v0.19.0

using PlutoUI
using WGLMakie
include("common/hydrogenic.jl")
using .Hydrogenic

md"""# Figure 1.4
Interference of two waves: psi1 + psi2 and |psi_tot|^2."""

@bind phase Slider(0:1:360, default=0)
@bind shift Slider(-10:1:10, default=0)
@bind amp2 Slider(0:0.1:2, default=1)

xs = range(-10, 10; length=400)
omega = 2*pi*0.6
psi1 = [sin(omega*x) for x in xs]
psi2 = [amp2*sin(omega*(x - shift/10) + phase*pi/180) for x in xs]
psit = [a+b for (a,b) in zip(psi1, psi2)]
rho = [x^2 for x in psit]

fig = Figure(resolution=(800,400))
ax = Axis(fig[1,1], xlabel="x", ylabel="Amplitude / Density")
lines!(ax, xs, psi1, color=:steelblue, label="psi1")
lines!(ax, xs, psi2, color=:purple, label="psi2")
lines!(ax, xs, psit, color=:orange, label="psi_tot")
lines!(ax, xs, rho, color=:green, label="|psi_tot|^2")
axislegend(ax)
fig
