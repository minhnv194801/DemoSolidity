// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
contract MappingInit{
    mapping(address=>bool) voting;
        function update(bool _vote) public{
        voting[msg.sender]=_vote;}
}
contract Voting{
        bool TypeofVote;
        address voteAddress;    
        constructor() {voteAddress=msg.sender;}
        uint256 totalVotes;
    //struct voteinfo{
        address[]  ListVoter;
        address[]  ListAcceptVoter;
        address[]  ListDeclineVoter;
    //}
    //voteinfo[] public VoteInfo;
    function get(bool _vote) public
    {
        TypeofVote=_vote;
        MappingInit m = new MappingInit();
        m.update(_vote);
        ListVoter.push(voteAddress);
        if(_vote==true) ListAcceptVoter.push(voteAddress);
        else ListDeclineVoter.push(voteAddress);
    }
    //Transfer 1 token to owner's address

    
}