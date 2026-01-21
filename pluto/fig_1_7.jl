### A Pluto.jl notebook ###
# v0.19.0

using PlutoUI
using WGLMakie
include("common/hydrogenic.jl")
using .Hydrogenic

md"""# Figure 1.7
Spherical coordinates (r, theta, phi) and Cartesian conversion."""

@bind r Slider(1:0.1:5, default=3)
@bind theta Slider(0:1:180, default=60)
@bind phi Slider(0:1:360, default=45)

th = theta*pi/180
ph = phi*pi/180
x = r*sin(th)*cos(ph)
y = r*sin(th)*sin(ph)
z = r*cos(th)

fig = Figure(resolution=(600,450))
ax = Axis3(fig[1,1], xlabel="x", ylabel="y", zlabel="z")
lines!(ax, [0,x], [0,y], [0,z], color=:orange, linewidth=3)
scatter!(ax, [x], [y], [z], color=:orange, markersize=10)
fig
