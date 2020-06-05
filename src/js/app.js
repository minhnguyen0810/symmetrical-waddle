App = {
  ethereumProvider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initEthereumProvider();
  },
  // MetaMask stop inject web3 in 2020 => Ethereum Provider API
  initEthereumProvider: function() {
    
    if (typeof ethereum !== 'undefined') {
      const provider = window['ethereum'];
      App.ethereumProvider = provider;
    }else{
      App.ethereumProvider = new ethers.providers.JsonRpcProvider('http://localhost:7545');
      ethereum = App.ethereumProvider;
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      App.contracts.Election = TruffleContract(election);
      App.contracts.Election.setProvider(App.ethereumProvider);
      return App.render();
    });
  },

  render : function (){
    var electionInstance;
    var listCandidates = [];
    var loader = $("#loader");
    var content = $("#content");
    loader.show();
    content.hide();

    //Load account data
    if(App.ethereumProvider.selectedAddress){
      App.account = App.ethereumProvider.selectedAddress;
      $("#accountAddress").html("Your Account: " + App.account);
    }else{
      let content = `
      <p>You are not login in MetaMask!</p>
      `
      $("#accountAddress").html(content);
    }
    // Load contract data
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      let candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      let candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();
      for (let i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          let id = candidate[0];
          let name = candidate[1];
          let voteCount = candidate[2];
          // Render candidate result
          let candidateTemplate = "<tr><td>" + id + "</td><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);

          // Render candidate ballot option
          let candidateOption = "<option value='" + id + "'  >" + name + "</ option>"
          candidatesSelect.append(candidateOption);
          
          // Add to array
          listCandidates.push(candidate);
          localStorage.setItem("listCandidates",JSON.stringify([]));
          localStorage.setItem("listCandidates",JSON.stringify(listCandidates));
        });  
      }
      return electionInstance.voters(App.account);
    }).then(function(hasVoted) {
      if(hasVoted) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },
  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    console.log($('#candidatesSelect'))
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      swal({
        title: "Voting success",
        text: `You have just voted`,
        icon: "success",
      }).then((clicked) => {
        if (clicked) {
          swal("Thank you for your voting", {
            icon: "success",
          }).then((rs)=>{
            if(rs){
              window.location.reload();
            }
          })
          
        }
      })
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};



$(function() {
  $(window).load(function() {
    App.init();
  });
});