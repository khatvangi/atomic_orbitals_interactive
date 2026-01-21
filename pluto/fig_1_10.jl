### A Pluto.jl notebook ###
# v0.19.0

using PlutoUI
using WGLMakie
include("common/hydrogenic.jl")
using .Hydrogenic

md"""# Figure 1.10
Radial nodes in s orbitals (roots of R_n0)."""

@bind n Slider(1:4, default=3)
@bind Z Slider(1:3, default=1)

xs = range(0, 30; length=500)
rs = [x*a0/Z for x in xs]
P = [radial_distribution(n,0,r; Z=Z) for r in rs]

nodes = Float64[]
prev = R_nl(n,0,rs[1]; Z=Z)
for r in rs[2:end]
    v = R_nl(n,0,r; Z=Z)
    if prev*v < 0
        push!(nodes, r)
    end
    prev = v
end

fig = Figure(resolution=(800,400))
ax = Axis(fig[1,1], xlabel="x = Zr/a0", ylabel="P(r)")
lines!(ax, xs, P, color=:purple)
for r in nodes
    v = Z*r/a0
    vline!(ax, v, color=:orange, linestyle=:dash)
end
fig
