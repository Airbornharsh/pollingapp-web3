import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis';
import { AiOutlineReload } from "react-icons/ai"
import { ConnectButton } from 'web3uikit';
import abi from "../Constants/abi.json";
import contractAddress from "../Constants/contractAddress.json";
import NavBar from '../components/NavBar';


const VotingPage = () => {
    const { runContractFunction } = useWeb3Contract({});
    const router = useRouter();
    const { pollId } = router.query
    const [questions, setQuestions] = useState<string[]>([]);
    const [name, setName] = useState("");
    const [answerIndex, setAnswerIndex] = useState(-1);
    const [resultIndex, setResultIndex] = useState("");

    const { runContractFunction: getQuestions } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "getQuestions",
        params: {
            id: pollId
        }
    });

    const { runContractFunction: getName } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "getName",
        params: {
            id: pollId
        }
    });

    // useEffect(() => {
    //     const onLoad = async () => {
    //         try {
    //             await runContractFunction({
    //                 params: {
    //                     abi: abi,
    //                     contractAddress: contractAddress,
    //                     functionName: "getName",
    //                     params: {
    //                         id: pollId,
    //                     }
    //                 },
    //                 onError(err) {
    //                     console.log(err.message.split('"')[5].split(": ")[1]);
    //                     alert(err.message.split('"')[5].split(": ")[1]);
    //                 },
    //                 onSuccess(results: any) {
    //                     setName(results)
    //                 },
    //             });

    //         } catch (e: any) {
    //             console.log(e)
    //         }
    //     }

    //     onLoad();
    // }, [pollId, runContractFunction]);

    const loadQuestions1 = async () => {

        try {
            await getName({
                onSuccess(results) {
                    setName(results as string);
                },
            });
            await getQuestions({
                onSuccess(results) {
                    setQuestions(results as Array<string>);
                },
            });
        } catch (e) {
            console.log(e);
        }
    }

    const loadQuestions2 = async (el: any) => {
        el.preventDefault();

        try {
            await getName({
                onSuccess(results) {
                    setName(results as string);
                },
            });
            await getQuestions({
                onSuccess(results) {
                    setQuestions(results as Array<string>);
                },
            });
        } catch (e) {
            console.log(e);
        }
    }

    const onSubmit = async (el: any) => {
        el.preventDefault();

        try {
            await runContractFunction({
                params: {
                    abi: abi,
                    contractAddress: contractAddress,
                    functionName: "vote",
                    params: {
                        id: pollId,
                        questionId: answerIndex
                    }
                },
                onError(err) {
                    console.log(err.message.split('"')[5].split(": ")[1]);
                    alert(err.message.split('"')[5].split(": ")[1]);
                },
            });
        } catch (e: any) {
            console.log(e)
        }
    }

    const onResult = async () => {

        try {
            const data: any = await runContractFunction({
                params: {
                    abi: abi,
                    contractAddress: contractAddress,
                    functionName: "result",
                    params: {
                        id: pollId,
                    }
                },
                onError(err) {
                    console.log(err.message.split('"')[5].split(": ")[1]);
                    alert(err.message.split('"')[5].split(": ")[1]);
                },
            });
            if (data) {
                setResultIndex(data.toString());
            }
        } catch (e) {
            console.log(e)
        }
    }

    setTimeout(() => {
        loadQuestions1();
    }, 2000)



    return (
        <div className='bg-slate-900 min-h-screen flex flex-col items-center'>
            <NavBar />
            <div className='flex flex-col items-center mt-4 w-[80vw] max-w-[80rem] '>
                <ConnectButton moralisAuth={false} />
                <form className='text-white mt-6 self-start flex flex-col gap-2 '>
                    <div className='flex items-center text-[1.4rem] gap-2'>
                        <p>{name}</p>
                        {/* <button className="bg-white text-[#25406b] font-semibold px-2 py-1 rounded-xl"> */}
                        <AiOutlineReload size={"1.24rem"} onClick={loadQuestions2} color={"white"} className="cursor-pointer mt-1"/>
                        {/* </button> */}
                    </div>
                    <ul className="flex flex-col gap-1 mt-2">
                        {questions && questions.map((question, i) => {
                            return <li key={i} >
                                <input type={"radio"} name={"question"} className="mr-2" value={i} onChange={(e: any) => {
                                    setAnswerIndex(e.target.value);
                                }} />
                                <label>{question}</label>
                            </li>
                        })}
                    </ul>
                    <button onClick={onSubmit} className="bg-white text-[#25406b] font-semibold px-2 py-1 rounded-xl mt-6 w-[5rem]">Submit</button>
                </form>
                <div className='flex flex-col items-center gap-4'>

                    <button onClick={onResult} className="bg-white text-[#25406b] font-semibold px-2 py-1 rounded-xl mt-6 w-[4rem]">Result</button>
                    {resultIndex && <p className='text-white'>Highest Votes: {questions[parseInt(resultIndex)]}</p>}
                </div>
            </div>
        </div>
    )
}

export default VotingPage