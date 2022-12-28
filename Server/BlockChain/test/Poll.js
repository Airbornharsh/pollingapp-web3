const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { Web3Provider } = require("@ethersproject/providers");

describe("Poll", () => {
  const deployFixture = async () => {
    const [owner, otherAccount] = await ethers.getSigners();
    const Poll = await ethers.getContractFactory("Poll");
    const poll = await Poll.deploy();

    return { poll, owner, otherAccount };
  };

  describe("Adding", () => {
    it("It should add the endTime", async () => {
      const { poll } = await loadFixture(deployFixture);
      const id = "ew";
      const questions = ["Question1", "Question2", "Question3"];
      const endTime = Date.now();

      await poll.addQuestions(id, questions, endTime, "polling");

      assert.equal(await poll.getEndTime(id), endTime);
    });

    it("It should add the Questions", async () => {
      const { poll } = await loadFixture(deployFixture);
      const id = "ew";
      const questions = ["Question1", "Question2", "Question3"];
      const endTime = Date.now();

      await poll.addQuestions(id, questions, endTime, "polling");

      questions.map(async (question, i) => {
        assert.equal(await poll.getQuestion(id, i), question);
      });
    });

    it("It should add all the Questions", async () => {
      const { poll } = await loadFixture(deployFixture);
      const id = "ew";
      const questions = ["Question1", "Question2", "Question3"];
      const endTime = Date.now();

      await poll.addQuestions(id, questions, endTime, "polling");

      assert.equal((await poll.getQuestions(id)).length, questions.length);
    });

    it("It should add the Votes to 0", async () => {
      const { poll } = await loadFixture(deployFixture);
      const id = "ew";
      const questions = ["Question1", "Question2", "Question3"];
      const endTime = Date.now();

      await poll.addQuestions(id, questions, endTime, "polling");

      questions.map(async (question, i) => {
        assert.equal(await poll.getVote(id, i), 0);
      });
    });

    it("It should add all the Votes ", async () => {
      const { poll } = await loadFixture(deployFixture);
      const id = "ew";
      const questions = ["Question1", "Question2", "Question3"];
      const endTime = Date.now();

      await poll.addQuestions(id, questions, endTime, "polling");

      assert.equal((await poll.getVotes(id)).length, questions.length);
    });

    it("It should return empty array of Users", async () => {
      const { poll } = await loadFixture(deployFixture);
      const id = "ew";
      const questions = ["Question1", "Question2", "Question3"];
      const endTime = Date.now();

      await poll.addQuestions(id, questions, endTime, "polling");

      assert.equal((await poll.getUsers(id)).length, 0);
    });

    it("It should return name of the poll", async () => {
      const { poll } = await loadFixture(deployFixture);
      const id = "ew";
      const questions = ["Question1", "Question2", "Question3"];
      const endTime = Date.now();

      await poll.addQuestions(id, questions, endTime, "polling");

      assert.equal((await poll.getName(id)), "polling");
    });
  });

  describe("Voting", () => {
    it("It should revert that That time had Ended!", async () => {
      const { poll } = await loadFixture(deployFixture);
      const id = "ew";
      const questions = ["Question1", "Question2", "Question3"];
      const endTime = Date.now() - 50000;
      const i = 0;

      await poll.addQuestions(id, questions, endTime, "polling");

      await expect(poll.vote(id, i)).to.revertedWith("Time had Ended!");
    });

    it("It should add the Vote", async () => {
      const { poll } = await loadFixture(deployFixture);
      const id = "ew";
      const questions = ["Question1", "Question2", "Question3"];
      const endTime = Date.now() + 50000;
      const i = 0;

      await poll.addQuestions(id, questions, endTime, "polling");

      await poll.vote(id, i);

      assert.equal(await poll.getVote(id, i), 1);
    });

    it("It should revert that User has already voted", async () => {
      const { poll } = await loadFixture(deployFixture);
      const id = "ew";
      const questions = ["Question1", "Question2", "Question3"];
      const endTime = Date.now() + 50000;
      const i = 0;

      await poll.addQuestions(id, questions, endTime, "polling");

      await poll.vote(id, i);

      await expect(poll.vote(id, i)).to.revertedWith("User Already Exists!");
    });

    it("It should return the Array of users who voted", async () => {
      const { poll, owner } = await loadFixture(deployFixture);
      const id = "ew";
      const questions = ["Question1", "Question2", "Question3"];
      const endTime = Date.now() + 50000;
      const i = 0;

      await poll.addQuestions(id, questions, endTime, "polling");

      await poll.vote(id, i);

      assert.equal((await poll.getUsers(id))[0], owner.address);
    });
  });

  describe("Result", () => {
    it("It should return the Array of users who voted", async () => {
      const { poll } = await loadFixture(deployFixture);
      const id = "ew";
      const questions = ["Question1", "Question2", "Question3"];
      const endTime = Date.now() + 50000;

      await poll.addQuestions(id, questions, endTime, "polling");

      await expect(poll.result(id)).to.revertedWith("Vote to See the Result!");
    });

    it("It should return the highest Vote Question Index", async () => {
      const { poll } = await loadFixture(deployFixture);
      const id = "ew";
      const questions = ["Question1", "Question2", "Question3"];
      const endTime = Date.now() + 50000;
      const i2 = 2;

      await poll.addQuestions(id, questions, endTime, "polling");

      await poll.vote(id, i2);

      assert.equal(await poll.result(id), i2);
    });
  });
});
