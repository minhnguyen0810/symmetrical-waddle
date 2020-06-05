// Create Countdown timer
var resultVoting = function(){
    let listCandidates = JSON.parse(localStorage.getItem("listCandidates"));
    if(listCandidates && listCandidates.length > 0){
        var president = listCandidates[0];
        listCandidates.map(item=>{
            if(item[2] >= listCandidates[0][2] ){
                president = item;
            }
        })
        return president;
    }
}
var rateVote = function(candidate){
    let listCandidates = JSON.parse(localStorage.getItem("listCandidates"));
    if(listCandidates && listCandidates.length > 0){
        var votesTotal = 0;
        listCandidates.map(item=>{
            votesTotal += item[2];
        })
        return candidate[2]*10000/votesTotal;
    }
}

var deadline = new Date("june 1, 2020 13:19:30").getTime(); 
var x = setInterval(function() { 
    var now = new Date().getTime(); 
    var t = deadline - now; 
    var days = Math.floor(t / (1000 * 60 * 60 * 24)); 
    var hours = Math.floor((t%(1000 * 60 * 60 * 24))/(1000 * 60 * 60)); 
    var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)); 
    var seconds = Math.floor((t % (1000 * 60)) / 1000); 
    document.getElementById("day").innerHTML =days ; 
    document.getElementById("hour").innerHTML =hours; 
    document.getElementById("minute").innerHTML = minutes;  
    document.getElementById("second").innerHTML =seconds;  
    if (t < 0) { 
        clearInterval(x); 
        document.getElementById("day").innerHTML ='0'; 
        document.getElementById("hour").innerHTML ='0'; 
        document.getElementById("minute").innerHTML ='0' ;  
        document.getElementById("second").innerHTML = '0'; 
        var rs = resultVoting();
        swal({
            title: "Time's up",
            text: `${rs[1]}  will become president with ${rs[2]} votes (${rateVote(rs)}%)`,
            icon: "success",
        }).then((clicked) => {
            if (clicked) {
                swal("Thank you for your voting", {
                icon: "success",
                });
            }
        });        
    }    
}, 1000); 



