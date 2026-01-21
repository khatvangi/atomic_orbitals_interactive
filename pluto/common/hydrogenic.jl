module Hydrogenic

export constants, a0, Rydberg, energy_level, laguerreL, R_nl, Y_lm, Y_lm_real,
       psi_nlm, rho_nlm, radial_distribution, node_counts, real_orbital

const constants = Dict(
    :h => 6.62607015e-34,
    :c => 2.99792458e8,
    :me => 9.1093837015e-31,
    :e => 1.602176634e-19,
    :eps0 => 8.8541878128e-12,
    :NA => 6.02214076e23
)

const a0 = 5.29177210903e-11

"""Rydberg constant from fundamental constants (1/m)."""
function Rydberg()
    h = constants[:h]
    c = constants[:c]
    me = constants[:me]
    e = constants[:e]
    eps0 = constants[:eps0]
    return (me * e^4) / (8 * eps0^2 * h^3 * c)
end

"""Hydrogenic energy level E_n (J) for Z, n."""
function energy_level(Z::Real, n::Integer)
    return -(constants[:h] * constants[:c] * Rydberg()) * Z^2 / n^2
end

"""Generalized Laguerre polynomial L_k^α(x) via recurrence."""
function laguerreL(k::Integer, α::Real, x::Real)
    if k == 0
        return 1.0
    elseif k == 1
        return 1 + α - x
    end
    Lkm1 = 1.0
    Lk = 1 + α - x
    for n in 1:(k-1)
        Lkp1 = ((2n + 1 + α - x) * Lk - (n + α) * Lkm1) / (n + 1)
        Lkm1, Lk = Lk, Lkp1
    end
    return Lk
end

"""Radial function R_nl(r) (hydrogenic)."""
function R_nl(n::Integer, l::Integer, r::Real; Z::Real=1)
    ρ = 2Z * r / (n * a0)
    pref = (2Z/(n*a0))^(3/2) * sqrt(factorial(n-l-1)/(2n*factorial(n+l)))
    return pref * exp(-ρ/2) * ρ^l * laguerreL(n-l-1, 2l+1, ρ)
end

"""Associated Legendre P_l^m(x) via recursion (Condon‑Shortley phase)."""
function legendreP(l::Integer, m::Integer, x::Real)
    if m < 0
        return (-1)^m * factorial(l-m)/factorial(l+m) * legendreP(l, -m, x)
    end
    # P_m^m
    pmm = 1.0
    if m > 0
        somx2 = sqrt((1 - x) * (1 + x))
        fact = 1.0
        for i in 1:m
            pmm *= -(fact) * somx2
            fact += 2.0
        end
    end
    if l == m
        return pmm
    end
    pmmp1 = x * (2m + 1) * pmm
    if l == m + 1
        return pmmp1
    end
    pll = 0.0
    for ll in (m+2):l
        pll = ((2ll - 1) * x * pmmp1 - (ll + m - 1) * pmm) / (ll - m)
        pmm, pmmp1 = pmmp1, pll
    end
    return pll
end

"""Complex spherical harmonic Y_l^m(θ,φ)."""
function Y_lm(l::Integer, m::Integer, θ::Real, φ::Real)
    norm = sqrt(((2l+1)/(4π)) * factorial(l-abs(m)) / factorial(l+abs(m)))
    P = legendreP(l, abs(m), cos(θ))
    if m > 0
        return norm * P * exp(im * m * φ) * (-1)^m
    elseif m < 0
        return norm * P * exp(im * m * φ) * (-1)^m
    else
        return norm * P
    end
end

"""Real spherical harmonics for l=0..3 (normalized)."""
function Y_lm_real(l::Integer, m::Integer, θ::Real, φ::Real)
    # real combinations of complex harmonics
    if m == 0
        return real(Y_lm(l, 0, θ, φ))
    elseif m > 0
        return sqrt(2) * (-1)^m * real(Y_lm(l, m, θ, φ))
    else
        return sqrt(2) * (-1)^m * imag(Y_lm(l, -m, θ, φ))
    end
end

"""Full ψ_nlm(r,θ,φ)."""
psi_nlm(n::Integer, l::Integer, m::Integer, r::Real, θ::Real, φ::Real; Z::Real=1) = R_nl(n,l,r; Z=Z) * Y_lm(l,m,θ,φ)

"""Density ρ=|ψ|^2."""
function rho_nlm(n::Integer, l::Integer, m::Integer, r::Real, θ::Real, φ::Real; Z::Real=1)
    ψ = psi_nlm(n,l,m,r,θ,φ; Z=Z)
    return abs2(ψ)
end

"""Radial distribution P(r)=r^2|R_nl|^2."""
radial_distribution(n::Integer, l::Integer, r::Real; Z::Real=1) = r^2 * (R_nl(n,l,r; Z=Z))^2

"""Node counts: total, radial, angular."""
function node_counts(n::Integer, l::Integer)
    return (total=n-1, radial=n-l-1, angular=l)
end

"""Real‑space polynomial for p/d/f orbitals in Cartesian form (real harmonics)."""
function real_orbital(l::Integer, name::Symbol, x::Real, y::Real, z::Real)
    r2 = x^2 + y^2 + z^2
    if l == 1
        if name == :px
            return x/sqrt(r2)
        elseif name == :py
            return y/sqrt(r2)
        else
            return z/sqrt(r2)
        end
    elseif l == 2
        if name == :dz2
            return (3z^2 - r2)/r2
        elseif name == :dx2y2
            return (x^2 - y^2)/r2
        elseif name == :dxy
            return (x*y)/r2
        elseif name == :dxz
            return (x*z)/r2
        else
            return (y*z)/r2
        end
    elseif l == 3
        if name == :fz3
            return z*(5z^2-3r2)/r2^(3/2)
        elseif name == :fxz2
            return x*(5z^2-r2)/r2^(3/2)
        elseif name == :fyz2
            return y*(5z^2-r2)/r2^(3/2)
        elseif name == :fxyz
            return x*y*z/r2^(3/2)
        elseif name == :fzx2y2
            return z*(x^2-y^2)/r2^(3/2)
        elseif name == :fxx23y2
            return x*(x^2-3y^2)/r2^(3/2)
        else
            return y*(3x^2-y^2)/r2^(3/2)
        end
    end
    return 0.0
end

end # module
