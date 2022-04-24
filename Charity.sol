// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "./Voting.sol";

contract Charity{
    struct Campaign{
        string name;
        uint256 Campaignid;
        string details;
        uint256 goal;
        address ownerID;
        uint NumberofVotes;
        uint256 NumberofAcceptVote;
        bool isOpened;
        bool isVoting;
        }
    Campaign[100] campaign;
    uint256 CampaignId=0;
    function CreateCampaign(string memory _name, string memory _details, uint _goal, address _ownerID) public
    {
        CampaignId++;
        campaign[CampaignId].name=_name;
        campaign[CampaignId].Campaignid=CampaignId;
        campaign[CampaignId].details=_details;
        campaign[CampaignId].goal=_goal;
        campaign[CampaignId].ownerID=_ownerID;
        campaign[CampaignId].NumberofVotes=0;
        campaign[CampaignId].NumberofAcceptVote=0;
        campaign[CampaignId].isOpened=false;
        campaign[CampaignId].isVoting=true;
    }
    /*function getCampaignInfo() public {
        return Campaign[CampaignId];
    }*/
    function Votings(bool _vote) public {
        Voting voting= new Voting();
        if (_vote==true)
        {
            voting.get(_vote);
            campaign[CampaignId].NumberofAcceptVote++;
            campaign[CampaignId].NumberofVotes++;
        }
        else {
            voting.get(_vote);
            campaign[CampaignId].NumberofVotes++;
        }
    }    
    function ActivateCampaign() public 
    {
        require(msg.sender==campaign[CampaignId].ownerID,"You are not allowed!!!");
        if(campaign[CampaignId].NumberofAcceptVote>=campaign[CampaignId].NumberofVotes/2)
        {
            campaign[CampaignId].isVoting=false;
            campaign[CampaignId].isOpened=true;
        }
    }
    function DeactivateCampaign() public
    {
        require(msg.sender==campaign[CampaignId].ownerID,"You are not allowed!!!"); 
        if(campaign[CampaignId].NumberofAcceptVote>=campaign[CampaignId].NumberofVotes/2)
        {
            campaign[CampaignId].isVoting=false;
            campaign[CampaignId].isOpened=false;
        }
    }
    /*function getVoteInfo() public
    {
        return VoteInfo[CampaignId];
    }*/
}