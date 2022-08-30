import React, {useState} from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// 参考 : https://teratail.com/questions/264506

type Props = { pileUpProblem: (url: string) => void }

const Form: React.FC<Props> = ({ pileUpProblem }) => {
    /*
    @param pileUpProblem: (url: string) => void
        もらったurlを積み上げる関数
        このフォームのサブミット時に、フォームの入力値を引数のurlにして呼び出す
    */

    // フォームに入力されている値を管理
    // valueはフォームのonChange時にその新しい入力値で更新され、また、render時に毎回valueの値がフォームに入る
    const [value, setValue] = useState('');


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //const urlForPiledUp: string = data.get('urlForPiledUp') as string;
        // 空なら抜ける
        if (value.trim() === '')  return;
        // 今の入力を引数に、上位の積み上げ関数を呼び出し
        pileUpProblem(value);
        // 入力フォームの値をリセット
        setValue('');
    };


    return (
        <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
        >
            <Box component={"form"} onSubmit={handleSubmit} noValidate sx={{ mt: 10 }}>
                <TextField
                    //align="center" 
                    name="urlForPiledUp"
                    label="積みたいURLを入力してください"
                    margin="normal"
                    variant="standard"
                    autoFocus
                    // 値が変わるたびに、このコンポーネントのステート 'value' に代入
                    onChange={e => setValue(e.currentTarget.value)}
                    value={value}
                />
            </Box>
        </Typography>
    );
}

export default Form