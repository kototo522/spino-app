import React from "react";
import { reduceEachLeadingCommentRange } from "typescript";



const titleStyle = {
    width: '235px',
    height: '93px',
    paddingLeft: '602px',
    paddingTop: '264px',
    fontFamily: 'PT Serif',
    fontStyle: 'normal',
    fontSize: '72px',
    lineHeight: '95px',
    color:'#59B4C8',
}

const contentStyle = {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontSize: '24px',
    lineHeight: '28.13px',
    color: '#333333'
}

const 

const Login = () =>{
    return (
        <div>
            <div>
                
            </div>
            </h1>
            <p style={ contentStyle }>
                twitterのスクリーンネームを入力してください。（例:  @tokotoko5_24）<br />
                最新のツイート１０件からタイピングゲームが生成されます。
            </p>
            <input  />
            <button>
                ゲームを始める
            </button>
        </div>
    );
}

export default Login;