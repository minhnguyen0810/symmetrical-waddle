pragma solidity >=0.4.21 <0.7.0;

contract Election{
    //Model a Candidate
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
        string image;
    }
    //Store accounts that have voted
    mapping(address => bool) public voters;
    //Store Candidates
    //Fetch Candidate
    mapping(uint => Candidate) public candidates;
    //Store Candidates Count
    uint public candidatesCount;
    event votedEvent (
        uint indexed _candidateId
    );

    constructor() public {
       addCandidate("Donald Trump","../src/images/trump.jpg");
       addCandidate("Barack Obama","../src/images/obama.jpg");
       addCandidate("Bill Clinton","../src/images/clinton.jpg");
    }

    function addCandidate(string memory _name,string memory _img) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount,_name,0,_img);
    }

    function vote(uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }
}