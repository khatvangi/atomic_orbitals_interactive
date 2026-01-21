module Grids

using .Hydrogenic

export cartesian_grid, density_grid, density_grid_real, threshold_for_probability, radial_threshold_s

"""Create a cubic grid of coordinates spanning [-L, L] with N points per axis."""
function cartesian_grid(N::Integer, L::Real)
    xs = range(-L, L; length=N)
    return xs
end

"""Evaluate density ρ=|ψ|^2 on a 3D grid for given n,l,m,Z."""
function density_grid(n::Integer, l::Integer, m::Integer; Z::Real=1, N::Integer=80, L::Real=20a0)
    xs = cartesian_grid(N, L)
    ρ = Array{Float64}(undef, N, N, N)
    for i in 1:N, j in 1:N, k in 1:N
        x, y, z = xs[i], xs[j], xs[k]
        r = sqrt(x^2+y^2+z^2)
        if r == 0
            θ = 0.0; φ = 0.0
        else
            θ = acos(z/r)
            φ = atan(y, x)
        end
        ρ[i,j,k] = rho_nlm(n,l,m,r,θ,φ; Z=Z)
    end
    return xs, ρ
end

\"\"\"Evaluate density on a grid using real orbital angular factor (p/d/f).\"\"\"\n+function density_grid_real(n::Integer, l::Integer, orb::Symbol; Z::Real=1, N::Integer=80, L::Real=20a0)\n+    xs = cartesian_grid(N, L)\n+    ρ = Array{Float64}(undef, N, N, N)\n+    for i in 1:N, j in 1:N, k in 1:N\n+        x, y, z = xs[i], xs[j], xs[k]\n+        r = sqrt(x^2+y^2+z^2) + 1e-12\n+        ang = real_orbital(l, orb, x, y, z)\n+        ψ = R_nl(n,l,r; Z=Z) * ang\n+        ρ[i,j,k] = ψ^2\n+    end\n+    return xs, ρ\n+end\n*** End Patch"}"}=="}}）
"""Threshold ρ0 so that sum_{ρ>=ρ0} ρ dτ = p (numerical)."""
function threshold_for_probability(ρ::Array{Float64,3}, xs; p::Real=0.9)
    # assumes uniform grid
    dx = xs[2] - xs[1]
    dτ = dx^3
    vals = sort(vec(ρ), rev=true)
    total = sum(vals) * dτ
    acc = 0.0
    for v in vals
        acc += v * dτ
        if acc / total >= p
            return v
        end
    end
    return vals[end]
end

"""Radial threshold for s orbitals: find r0 s.t. ∫_0^{r0} 4π r^2 |ψ|^2 dr = p."""
function radial_threshold_s(n::Integer; Z::Real=1, p::Real=0.9)
    # simple numeric integration
    rmax = 40a0
    rs = range(0, rmax; length=2000)
    dr = rs[2] - rs[1]
    vals = [4π * r^2 * (R_nl(n,0,r; Z=Z)^2) / (4π) for r in rs]
    cum = cumsum(vals) * dr
    total = cum[end]
    idx = findfirst(x -> x/total >= p, cum)
    return rs[idx]
end

end # module
