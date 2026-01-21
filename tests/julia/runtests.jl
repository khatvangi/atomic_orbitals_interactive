using Test
include("../../pluto/common/hydrogenic.jl")
using .Hydrogenic

@testset "Hydrogenic basics" begin
    # energy scaling
    @test energy_level(2,1)/energy_level(1,1) ≈ 4 atol=1e-2

    # 2p at nucleus is zero
    @test abs(R_nl(2,1,0.0; Z=1)) < 1e-8

    # 1s most probable radius near a0/Z
    Z = 1
    rs = range(0, 10a0; length=5000)
    vals = [radial_distribution(1,0,r; Z=Z) for r in rs]
    rmax = rs[argmax(vals)]
    @test abs(rmax - a0/Z) / a0 < 0.1

    # node counts
    @test node_counts(3,1) == (total=2, radial=1, angular=1)
end
