// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Poll {
    uint256 public _pollEndTime;
    string[] public _pollQuestions;
    uint256[] public _pollNoVotes;

    constructor(string[] memory questions, uint256 endTime) payable {
        require(
            block.timestamp + 60 < endTime,
            "Poll Should end in the Future and should be 1 Minute Long!"
        );
        _pollEndTime = endTime;

        for (uint256 i = 0; i < questions.length; i++) {
            _pollQuestions.push(questions[i]);
            _pollNoVotes.push(0);
        }
    }

    function getEndTime() public view returns (uint256) {
        return _pollEndTime;
    }

    function getPollQuestions() public view returns (string[] memory) {
        return _pollQuestions;
    }

    function getPollNoVotes() public view returns (uint256[] memory) {
        return _pollNoVotes;
    }

    function question(uint256 index) public view returns (string memory) {
        return _pollQuestions[index];
    }

    function noOfQuestions() public view returns (uint256) {
        return _pollQuestions.length;
    }

    function noOfVotes(uint256 index) public view returns (uint256) {
        return _pollNoVotes[index];
    }

    function getTotalVotes() public view returns (uint256) {
        uint256 temp = 0;
        for (uint256 i = 0; i < _pollNoVotes.length; i++) {
            temp += _pollNoVotes[i];
        }
        return temp;
    }

    function vote(uint256 index) public returns (uint256) {
        require(block.timestamp < _pollEndTime, "Voting time is Ended!");

        _pollNoVotes[index] += 1;
        return index;
    }

    function Result() public view returns (uint256) {
        require(block.timestamp >= _pollEndTime, "Polling is not Yet Over!");

        uint256 tempI = 0;

        for (uint256 i = 1; i < _pollQuestions.length; i++) {
            if (_pollNoVotes[tempI] < _pollNoVotes[i]) {
                tempI = i;
            }
        }

        return tempI;
    }
}
