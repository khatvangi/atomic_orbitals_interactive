### A Pluto.jl notebook ###
# v0.19.0

using PlutoUI
using WGLMakie
include("common/hydrogenic.jl")
using .Hydrogenic

md"""# Figure 1.6
Shell/subshell classification: l=0..n-1 and 2l+1 orbitals."""

@bind n Slider(1:6, default=3)

subshells = [:s, :p, :d, :f, :g, :h]
md"""**n = $n**  Total orbitals in shell: n^2 = $(n^2)"""

Table = [(l, subshells[l+1], 2*l+1) for l in 0:n-1]
md"""
| l | Subshell | Orbitals (2l+1) |
|---|---|---|
$(join(["|$(row[1])|$(row[2])|$(row[3])|" for row in Table],"
"))
"""
