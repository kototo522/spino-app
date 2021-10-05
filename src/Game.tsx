import { useState, useEffect } from "react";
import Modal from "./components/Modal";
import styled from "styled-components";
import { twippyApi } from "./api";


const Container = styled.div`
    @import url('http://fonts.googleapis.com/earlyaccess/notosansjp.css');
    font-family: "Noto Sans Japanese", sans-serif;
`;

const Header = styled.div`
    height: 54px;
    width: 100vw;
    margin-bottom: 50px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.30);
    @media screen and (max-width: 767px) {
        margin-bottom: 20px;
    }
`;

const QuestionNumText = styled.h1`
    font-family: 'Noto Sans JP', sans-serif;
    font-weight: bold;
    color: #59B4C8;
    text-align: center;
`;

const TimeText = styled.h4`
    margin-right: 40px;
    float: right;
    color: #BC1F1F;
`;

const TweetBox = styled.div`
    display: flex;
    margin: 20px 0 0 40px;
    @media screen and (max-width: 767px) {
        margin: 10px 0 0 5px;
    }
`;

const HumanIcon = styled.img`
    height: 68px;
    width:  68px;
    border-radius: 50%;
`;

const VerticalLine = styled.div`
    height: 160px;
    width: 6px;
    margin: 10px 0 0 31px;
    background-color: #D9D9D9;
`;

const Text = styled.p`
    width: calc(85vw - 64px);
    font-family: 'Noto Sans JP', sans-serif;
    font-weight: 400;
    margin-left: 20px;
    font-size: 30px;
    @media screen and (max-width: 767px) {
    font-size: 25px;
    }
`;

const TextArea = styled.textarea`
    height: 200px;
    width: calc(85vw - 64px);
    background-color: #F9F9F9;
    font-size: 24px;
    font-family: 'Noto Sans JP', sans-serif;
    margin-left: 20px;
    resize: none;
    border: none;
    outline-color: #D9D9D9;
`;

const ButtonsContainer = styled.div`
    display: flex;
    margin-top: 40px;
    float: right;
`;

const Sending = styled.button`
    height: 40px;
    width: 200px;
    margin-right: 100px;
    background-color: #59B4C8;
    font-size: 20px;
    font-family: 'Noto Sans JP', sans-serif;
    font-weight: 700;
    color: #FFFFFF;
    border: none;
    &:hover {
        border: 2px solid rgba(89, 180, 200, 0.7);
        box-sizing: border-box;
        box-shadow: 0px 10px 10px rgba(89, 180, 200, 0.25);
        background-color: #98D2DF;
  }
  @media screen and (max-width: 767px) {
      margin: 20px auto;
    }
`;

const dummyUser: string = localStorage.getItem("uname")!
const Game = () => {
    const [questionNum, setQuestionNum] = useState<number>(0);
    const [question, setQuestion] = useState<string>("読み込み中...");
    const [form, setForm] = useState<string>("");
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [tweets, setTweets] = useState<string[]>([]);
    const [missCount, setMissCount] = useState<number>(0);
    const [skipCount, setSkipCount] = useState<number>(0);
    const [time, setTime] = useState(0);
    const [timer, setTimer] = useState<NodeJS.Timeout>();

    const [data, setData] = useState<{name: string,icon: string, tweets: string[]}>();

    //正解不正解の判定(consoleに表示)
    let Success = new Audio('success.mp3');
    let Miss = new Audio('miss.mp3');
    let Skip = new Audio('skip.mp3');
    let OpenModal = new Audio('openModal.mp3');

    const result = () => {
        if (questionNum === tweets.length - 1 && form === question) {
            setIsOpenModal(true);
            OpenModal.play();
        }
        else if (form === question) {
            console.log("正解");
            setQuestionNum(questionNum + 1);
            setQuestion(JSON.stringify(tweets[questionNum + 1].replace(/\n/g, '')).slice(1,-1));
            setForm("");
            Success.play();
        }
        else {
            console.log("不正解");
            setMissCount(missCount + 1)
            Miss.play();
        }

        if (questionNum === 5) {
            clearInterval(timer as any);
        }
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (typeof timer === "undefined") {
            setTimer(setInterval(() => {
                setTime(countUp => countUp + 1);
            }, 1000))
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    if (isOpenModal){
    clearInterval(timer as any);
    }

    useEffect(() => {
        const f = async () => {
            try {
                const fetchedTweet = await twippyApi.filterdTimeline(dummyUser)
                setData(fetchedTweet)
                setTweets(fetchedTweet.tweets)
                setQuestion(JSON.stringify(fetchedTweet.tweets[0].replace(/\n/g,'')).slice(1,-1))
                console.log(data)
            } catch (e) {
                console.log("error")
            }
        }
        f()
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container>
            <Header>
                <QuestionNumText>{questionNum + 1}問目</QuestionNumText>
            </Header>
            <TimeText>開始してから: {time}秒</TimeText>
            <TweetBox>
                <div>
                    <HumanIcon src={data?.icon} />
                    <VerticalLine />
                </div>
                <div>
                    <Text style={{ color: "#5B5B5B" }}>{data?.name}のツイート</Text>
                    <Text style={{ fontSize: "24px" }}>{question}</Text>
                </div>
            </TweetBox >
            <TweetBox>
                <div>
                    <HumanIcon src={data?.icon} />
                </div>
                <div>
                    <TextArea
                        placeholder={"入力してください"}
                        id="form"
                        name="textarea"
                        value={form}
                        autoFocus
                        onFocus={e => e.currentTarget.select()}
                        onChange={(e) => setForm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) {
                                 result() 
                            } else if(e.key === 'Enter' && e.shiftKey){
                                setQuestionNum(questionNum + 1);
                                setQuestion(tweets[questionNum + 1]);
                                setSkipCount(skipCount + 1);
                                setForm("");
                                Skip.play();
                                if (questionNum === tweets.length - 1) setIsOpenModal(true)
                            }
                        }}
                    ></TextArea>

                </div>
            </TweetBox >
            <ButtonsContainer>
                <p style={{ fontSize: "18px", marginRight: "20px", color: "#BC1F1F" }}>{missCount}問不正解</p>
                <Sending 
                    onClick={() => {
                        setQuestionNum(questionNum + 1);
                        setQuestion(tweets[questionNum + 1]);
                        setSkipCount(skipCount + 1);
                        Skip.play();
                        if (questionNum === tweets.length - 1) setIsOpenModal(true)
                    }} 
                    style={{ marginRight: "12px" }}
                    
                    >{"パス(shift + Enter)"}</Sending>
                <Sending onClick={() => { result() }}>{"送信(Ctr + Enter)"}</Sending>
            </ButtonsContainer>
            {
                isOpenModal && (
                    <Modal missCount={missCount} skipCount={skipCount} time={time} />
                )
            }

        </Container >
    );

}

export default Game;