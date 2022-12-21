import NavBar from "../components/NavBar";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import contractAddress from "../Constants/contractAddress.json";
import abi from "../Constants/abi.json";
import { ConnectButton } from "web3uikit";
import { time } from "console";

export default function Home(props: any) {
  const { isWeb3Enabled } = useMoralis();
  const [questions, setQuestions] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [answerIndex, setAnswerIndex] = useState(-1);
  const [result, setResult] = useState("Result Not Yet Out");
  const [endTime, setEndTime] = useState(props.timeNow);

  // console.log(Date.now());

  const { runContractFunction: getEndTime } = useWeb3Contract({
    abi: abi["abi"],
    contractAddress: contractAddress["address"],
    functionName: "getEndTime",
  });

  const { runContractFunction: getPollQuestions } = useWeb3Contract({
    abi: abi["abi"],
    contractAddress: contractAddress["address"],
    functionName: "getPollQuestions",
  });

  const { runContractFunction: getPollNoVotes } = useWeb3Contract({
    abi: abi["abi"],
    contractAddress: contractAddress["address"],
    functionName: "getPollNoVotes",
  });

  const { runContractFunction: getTotalVotes } = useWeb3Contract({
    abi: abi["abi"],
    contractAddress: contractAddress["address"],
    functionName: "getTotalVotes",
  });

  const { runContractFunction: Result } = useWeb3Contract({});
  const { runContractFunction: vote } = useWeb3Contract({});

  useEffect(() => {
    const onLoad = async () => {
      const tempEndTime: any = await getEndTime();
      if (tempEndTime) {
        setEndTime(parseInt(tempEndTime) * 1000);
        // setEndTime((new Date((parseInt(tempEndTime)) * 1000)).toLocaleString("en-us", { timeZone: "Asia/Kolkata" }).toString());
      }
    };

    if (isWeb3Enabled) onLoad();
  }, [getEndTime, isWeb3Enabled]);

  useEffect(() => {
    const onLoad = async () => {
      const pollQuestions: any = await getPollQuestions();
      if (pollQuestions.length > 0) setQuestions(pollQuestions)
    };

    if (isWeb3Enabled) onLoad();
  }, [getPollQuestions, isWeb3Enabled]);

  useEffect(() => {
    const onLoad = async () => {
      const pollVotes: any = await getTotalVotes();
      if (pollVotes) setTotalVotes(parseInt(pollVotes))
    };

    if (isWeb3Enabled) onLoad();
  }, [getTotalVotes, isWeb3Enabled]);


  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (answerIndex > -1 && answerIndex < questions.length) {
      try {
        await vote({
          params: {
            abi: abi["abi"],
            contractAddress: contractAddress["address"],
            functionName: "vote",
            params: {
              index: answerIndex
            }
          }
        });

      } catch (e) {
        console.log(e);
      }
    } else {
      alert("Not Selected");
    }
  }

  const getQuestion = (i: number) => {
    return questions[i];
  }

  const onResult = async (e: any) => {
    e.preventDefault();

    try {
      const temp: any = await Result({
        params: {
          abi: abi["abi"],
          contractAddress: contractAddress["address"],
          functionName: "Result",
        }
      });

      if (parseInt(temp)) {
        setResult(`Result: ${getQuestion(parseInt(temp))} won`);
      }

    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="w-screen  flex justify-start items-center flex-col bg-slate-900 h-screen text-white">
      <NavBar />
      <div className="w-[80vw] max-w-[80rem] flex flex-col">
        <div className="mt-4 flex justify-center items-center mb-10">
          <ConnectButton moralisAuth={false} />
        </div>
        <p>Poll End Time: {(new Date(endTime)).toLocaleString("en-us", { timeZone: "Asia/Kolkata" }).toString()}</p>
        <p>Total No of Votes Till Now:- {totalVotes}</p>
        <h2 className="text-[1.3rem] mb-3">Questions</h2>
        <form className="flex flex-col">
          <ul className="flex flex-col gap-1">
            {questions.map((question, i) => {
              return <li key={i} >
                <input type={"radio"} name={"question"} className="mr-2" value={i} onChange={(e: any) => {
                  setAnswerIndex(e.target.value);
                }} />
                <label>{question}</label>
              </li>
            })}
          </ul>
          <p className="mt-6">{answerIndex > -1 && answerIndex < questions.length ? `You have Selected ${getQuestion(answerIndex)}` : "Not Selected"}</p>
          <button className="mt-6 px-2 py-1 bg-slate-600 rounded w-20" onClick={onSubmit}>Confirm</button>
          <button className="mt-6 px-2 py-1 bg-slate-600 rounded w-20" onClick={async (e) => {
            e.preventDefault();
            let temp: any = await getPollNoVotes();
            temp = temp.map((t: any) => parseInt(t));
            console.log(temp);
          }}>Check</button>
          {Date.now() > endTime && <button className="mt-6 px-2 py-1 bg-slate-600 rounded w-20" onClick={onResult}>Result</button>}
        </form>
      </div>
      <p className="mt-2">{result}</p>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: { timeNow: parseInt(Date.now().toString()) }, // will be passed to the page component as props
  }
}
