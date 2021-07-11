var web3
var contractAddress
var abi
var contract
var account
var loader
var content

function init() {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545/"))

  // contractAddress and abi are setted after contract deploy
  contractAddress = "0x95014228dDF28ceBdDB35C8ae1dd73F517eC3F42"
  abi = [
    {
      constant: true,
      inputs: [],
      name: "candidatesCount",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      name: "candidates",
      outputs: [
        {
          name: "id",
          type: "uint256",
        },
        {
          name: "name",
          type: "string",
        },
        {
          name: "voteCount",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "",
          type: "address",
        },
      ],
      name: "voters",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_candidateId",
          type: "uint256",
        },
      ],
      name: "vote",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ]

  //contract instance
  contract = new web3.eth.Contract(abi, contractAddress)
  console.log("hello", contract)

  web3.eth.getAccounts(function (err, accounts) {
    if (err != null) {
      alert("Error retrieving accounts.")
      return
    }
    if (accounts.length == 0) {
      alert(
        "No account found! Make sure the Ethereum client is configured properly."
      )
      return
    }
    account = accounts[0]
    web3.eth.defaultAccount = account
    $("#accountAddress").html("Your Account: " + account)
  })

  loader = $("#loader")
  content = $("#content")

  loader.show()
  content.hide()

  reload()
}

function reload() {
  contract.methods
    .candidatesCount()
    .call()
    .then(function (candidatesCount) {
      var candidatesResults = $("#candidatesResults")
      candidatesResults.empty()

      var candidatesSelect = $("#candidatesSelect")
      candidatesSelect.empty()

      for (var i = 1; i <= candidatesCount; i++) {
        contract.methods
          .candidates(i)
          .call()
          .then(function (candidate) {
            var id = candidate[0]
            var name = candidate[1]
            var voteCount = candidate[2]

            // Render candidate Result
            var candidateTemplate =
              "<tr><th>" +
              id +
              "</th><td>" +
              name +
              "</td><td>" +
              voteCount +
              "</td></tr>"
            candidatesResults.append(candidateTemplate)

            // Render candidate ballot option
            var candidateOption =
              "<option value='" + id + "' >" + name + "</ option>"
            candidatesSelect.append(candidateOption)
          })
      }

      loader.hide()
      content.show()

      contract.methods
        .voters(account)
        .call()
        .then(function (result) {
          console.log(result)
          if (result) {
            $("#btn-vote").prop("disabled", true)
          } else {
            $("#btn-vote").prop("disabled", false)
          }
        })
        .catch(function (error) {
          console.log("error")
        })
    })
}

function castVote() {
  loader.show()
  content.hide()
  var candidateId = $("#candidatesSelect").val()
  contract.methods
    .vote(candidateId)
    .send({ from: account })
    .then(function () {
      reload()
    })
    .catch(function (err) {
      console.error(err)
      alert("Can't vote anymore")
      loader.hide()
      content.show()
    })
}

$(function () {
  $(window).load(function () {
    init()
  })
})
