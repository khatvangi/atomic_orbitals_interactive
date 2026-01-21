### A Pluto.jl notebook ###
# v0.19.0

using PlutoUI
using WGLMakie
include("common/hydrogenic.jl")
using .Hydrogenic

md"""# Figure 1.3
Born interpretation: psi and |psi|^2 along a 1D slice."""

@bind n Slider(1:4, default=2)
@bind l Slider(0:3, default=0)
@bind m Slider(-3:3, default=0)
@bind Z Slider(1:3, default=1)

xs = range(-10, 10; length=400)
ll = min(l, n-1)
mm = clamp(m, -ll, ll)
psi = [real(psi_nlm(n, ll, mm, abs(x), pi/2, x >= 0 ? 0 : pi; Z=Z)) for x in xs]
rho = [x^2 for x in psi]

fig = Figure(resolution=(800,400))
ax = Axis(fig[1,1], xlabel="x", ylabel="psi, |psi|^2")
lines!(ax, xs, psi, color=:steelblue, label="psi")
lines!(ax, xs, rho, color=:orange, label="|psi|^2")
axislegend(ax)
fig
