import NavBar from "../components/NavBar";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useState } from "react";
import { MdDelete } from "react-icons/md"
import contractAddress from "../Constants/contractAddress.json";
import abi from "../Constants/abi.json";
import { ConnectButton } from "web3uikit";
import Link from "next/link";

export default function Home(props: any) {
  const { isWeb3Enabled, account } = useMoralis();
  const [isAdding, setIsAdding] = useState(true)
  const [endTime, setEndTime] = useState("");
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [isNewuestion, setIsNewQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false)
  const { runContractFunction } = useWeb3Contract({});

  const onSubmit = async (el: any) => {
    el.preventDefault();

    if (questions.length > 0, name.length > 0, endTime.length > 0) {
      try {

        await runContractFunction({
          params: {
            abi: abi,
            contractAddress: contractAddress,
            functionName: "addQuestions",
            params: {
              id: account ? account.toString() : "",
              questions: questions,
              endTime: (new Date(endTime)).getTime(),
              name: name
            }
          }
        })

        alert("Added");
        setSubmitted(true)

      } catch (e) {
        console.log(e)
      }
    } else {
      alert("Fill it Properly");
    }
  }

  return (
    <div className="w-screen  flex justify-start items-center flex-col bg-slate-900 h-screen text-white">
      <NavBar />
      <div className="w-[80vw] max-w-[80rem] flex flex-col">
        <div className="mt-4 flex justify-center items-center flex-col mb-10">
          <ConnectButton moralisAuth={false} />
          {account && <div className="self-start">
            <button className="mt-10 bg-white text-[#25406b] font-semibold px-3 py-1 rounded-xl" onClick={() => {
              setIsAdding(i => !i);
            }}>{isAdding ? "Cancel" : "Add Poll"}</button>
            {isAdding && <form className="mt-4 flex flex-col gap-3">
              <h3 className="text-[1.4rem] font-semibold">Questions</h3>
              <div className="flex items-center gap-2">
                <p className="font-semibold">This is Your Poll Id: </p>
                <p className="font-thin">{account.toString()}</p>

              </div>
              <div className="flex gap-3 items-center">
                <label className="font-semibold">Poll Name:</label>
                <input className="text-[#25406b] px-2 py-[0.25rem] rounded-md" type={"text"} value={name} onChange={(e) => {
                  setName(e.target.value);
                }} />
              </div>
              <div className="flex gap-3 items-center">
                <label className="font-semibold">Poll End Time:</label>
                <input className="text-[#25406b] px-1 py-[0.1rem] rounded-md" type={"datetime-local"} value={endTime} onChange={(e) => {
                  setEndTime(e.target.value);
                }} />
              </div>
              <div className="text-black mt-2">
                <ul className="flex flex-col gap-3">
                  {questions.map((question, i) => {
                    return <li key={question} className="flex text-white gap-2 items-center">
                      <label className="font-semibold">Question {i + 1}:</label>
                      <p className="font-light">{question}</p>
                      <MdDelete onClick={(e) => {
                        e.preventDefault();

                        const temp = questions.filter((question, index) => i != index);

                        setQuestions(temp);
                      }} size={"1.3rem"} color={"red"} className={"cursor-pointer"} />
                    </li>
                  })}
                </ul>
                {isNewuestion && <div className="flex gap-3 items-center mt-3">
                  <label className="text-white font-semibold">New Question:</label>
                  <input className="px-2 py-1 rounded-md w-[18rem]" value={newQuestion} onChange={(e) => {
                    setNewQuestion(e.target.value);
                  }} />
                  <button className=" text-[#25406b] text-[1.5rem] font-semibold rounded-xl" onClick={(e) => {
                    e.preventDefault();

                    setIsNewQuestion(false);

                  }}>❌</button>
                  <button className=" text-[#25406b]  text-[1.5rem]  font-semibold rounded-xl" onClick={(e) => {
                    e.preventDefault();

                    if (newQuestion.length > 0) {
                      const temp = questions;

                      temp.push(newQuestion);

                      setQuestions(temp);

                      setNewQuestion("");
                    } else {
                      alert("No Question to Add")
                    }
                  }}>✅</button>
                </div>}
                <button className="mt-3 bg-white text-[#25406b] px-2 font-semibold py-1 rounded-xl" onClick={(e) => {
                  e.preventDefault();

                  setIsNewQuestion(true)
                }} >Add New Question</button>
              </div>
              <button className=" w-[5rem] mt-3 bg-white text-[#25406b] px-2 font-semibold py-1 rounded-xl" onClick={onSubmit}>Submit</button>
            </form>}
          </div>}
          {submitted && <div>
            <Link className="bg-white  text-black px-2 py-1 rounded" href={account ? `/${account.toString()}` : ""}>Link To Poll</Link>
          </div>}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: { timeNow: parseInt(Date.now().toString()) }, // will be passed to the page component as props
  }
}
