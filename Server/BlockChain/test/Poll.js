const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { Web3Provider } = require("@ethersproject/providers");

describe("Poll", () => {
  const questionLoadFixture = async () => {
    const TEN_MINUTES_IN_SECS = 10 * 60;
    const endTime = (await time.latest()) + TEN_MINUTES_IN_SECS;

    const questions = ["Dog", "Cat", "Mouse", "All"];

    const [owner, otherAccount] = await ethers.getSigners();

    const Poll = await ethers.getContractFactory("Poll");
    const poll = await Poll.deploy(questions, endTime);

    return { poll, endTime, owner, otherAccount, questions };
  };

  describe("Deployment", () => {
    it("It should return if vote time limit is less than 60 seconds", async () => {
      const questions = ["Dog", "Cat", "Mouse", "All"];
      const endTime = await time.latest();

      const Poll = await ethers.getContractFactory("Poll");

      await expect(Poll.deploy(questions, endTime)).to.be.revertedWith(
        "Poll Should end in the Future and should be 1 Minute Long!"
      );
    });

    it("It should set Current pollEndTime", async () => {
      const { poll, endTime } = await loadFixture(questionLoadFixture);

      expect(await poll.getEndTime()).to.equal(endTime);
    });

    it("It should Store the Same No of Questions", async () => {
      const { poll, questions } = await loadFixture(questionLoadFixture);

      expect(await poll.noOfQuestions()).to.equal(questions.length);
    });

    it("It should Store the Questions", async () => {
      const { poll, questions } = await loadFixture(questionLoadFixture);

      questions.forEach(async (question, index) => {
        expect(await poll.question(index)).to.equal(question);
      });
    });

    it("It Store the No of Votes to Zero", async () => {
      const { poll, questions } = await loadFixture(questionLoadFixture);

      questions.forEach(async (question, index) => {
        expect(await poll.noOfVotes(index)).to.equal(0);
      });
    });

    
  });

  describe("Voting", () => {
    it("It should increase the vote by 1", async () => {
      const { poll } = await loadFixture(questionLoadFixture);
      const i = 1;

      await poll.vote(i);

      expect(await poll.noOfVotes(i)).to.equal(1);
    });
  });

  describe("Result", () => {
    it("It Should revert if time is not over yet", async () => {
      const { poll, endTime } = await loadFixture(questionLoadFixture);

      await expect(poll.Result()).to.be.revertedWith(
        "Polling is not Yet Over!"
      );
    });

    it("It should return the Winner Index", async () => {
      const { poll, endTime } = await loadFixture(questionLoadFixture);

      const i = 1;

      await poll.vote(i);

      await time.increaseTo(endTime + 20);

      expect(await poll.Result()).to.equal(i);
    });
  });
});
