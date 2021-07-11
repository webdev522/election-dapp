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

  it("throws an exception for invalid candidates", async () => {
    const instance = await Election.new()
    try {
      await instance.vote(99, { from: accounts[1] })
    } catch (e) {}

    const candidate1 = await instance.candidates(1)
    assert.equal(
      candidate1.voteCount,
      0,
      "candidate 1 did not receive any votes"
    )

    const candidate2 = await instance.candidates(2)
    assert.equal(
      candidate2.voteCount,
      0,
      "candidate 2 did not receive any votes"
    )
  })

  it("throws an exception for double voting", async () => {
    const instance = await Election.new()
    const candidateId = 2
    await instance.vote(candidateId, { from: accounts[1] })

    let candidate = await instance.candidates(candidateId)
    assert.equal(candidate.voteCount, 1, "accepts first vote")

    try {
      await instance.vote(candidateId, { from: accounts[1] })
    } catch (e) {}

    candidate = await instance.candidates(candidateId)
    assert.equal(candidate.voteCount, 1, "did not receive any votes more")
  })
})
