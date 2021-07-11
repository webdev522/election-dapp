var Election = artifacts.require("./Election.sol")

contract("Election", function (accounts) {
  it("initializes with two candidates", async () => {
    const instance = await Election.new()
    const count = await instance.candidatesCount()
    assert(count, 2)
  })

  it("it initializes the candidates with the correct values", async () => {
    const instance = await Election.new()
    const candidate1 = await instance.candidates(1)
    assert.equal(candidate1.id, 1, "contains the correct id")
    assert.equal(candidate1.name, "Candidate 1", "contains the correct name")
    assert.equal(candidate1.voteCount, 0, "contains the correct votes count")

    const candidate2 = await instance.candidates(2)
    assert.equal(candidate2.id, 2, "contains the correct id")
    assert.equal(candidate2.name, "Candidate 2", "contains the correct name")
    assert.equal(candidate2.voteCount, 0, "contains the correct votes count")
  })

  it("allows a voter to cast a vote", async () => {
    const instance = await Election.new()
    const candidateId = 1
    await instance.vote(candidateId, { from: accounts[0] })
    const candidate = await instance.candidates(1)
    const { voteCount } = candidate
    assert.equal(voteCount, 1, "increments the candidate's vote count")
  })
})
