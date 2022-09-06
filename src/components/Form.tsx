import React, {useState} from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Button, Collapse, FormControl, FormControlLabel, Grid, Hidden, Slide, Switch } from "@mui/material";
import { Container } from "@mui/system";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

// 参考 : https://teratail.com/questions/264506

type Props = { pileUpProblem: (url: string, isUpperPos: boolean) => void }
const Form: React.FC<Props> = ({ pileUpProblem }) => {
    /*
    @param pileUpProblem: (url: string) => void
        もらったurlを積み上げる関数
        このフォームのサブミット時に、フォームの入力値を引数のurlにして呼び出す
    */
    // フォームに入力されている値を管理
    // valueはフォームのonChange時にその新しい入力値で更新され、また、render時に毎回valueの値がフォームに入る
    const [valueUrl, setValueUrl] = useState('');
    // 積む位置 上かどうかで状態を持つ
    const [valueIsUpperPos, setValueIsUpperPos] = useState(true);
    // マウスがformの上にあるかどうか
    const [valueMouseOnForm, setValueMouseOnForm] = useState(true);
    // URLの入力エリアがフォーカスされてるかどうか
    const [valueFocusUrl, setValueFocusUrl] = useState(true);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //const urlForPiledUp: string = data.get('urlForPiledUp') as string;
        // 空なら抜ける
        if (valueUrl.trim() === '')  return;
        // 今の入力を引数に、上位の積み上げ関数を呼び出し
        pileUpProblem(valueUrl, valueIsUpperPos);
        // 入力フォームの値をリセット
        setValueUrl('');
    };

    const InputPosForPiledUp: React.FC = () => {
        return (
            <FormControlLabel control={
                <Switch 
                    size="medium"
                    checked={!valueIsUpperPos}
                    sx={{ my: 1 }}
                    onChange={e => setValueIsUpperPos(!e.currentTarget.checked)}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            } label='↓下に積む' />
        );
    }

    return (
            <Box 
                component={"form"} 
                noValidate 
                sx={{ witdh: 500, maxWidth: '100%', alignItems: 'center', display: 'flex', flexDirection: 'column' }}
                onSubmit={handleSubmit} 
                onMouseOver={e => setValueMouseOnForm(true)}
                onMouseOut={e => setValueMouseOnForm(false)}
            >
            {/* <Box sx={{witdh: 800, mt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}> */}
                <Grid container>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id='urlForPiledUp'
                            label="積みたいURLを入力してください"
                            name="urlForPiledUp"
                            //margin="normal"
                            variant="standard"
                            autoFocus
                            onFocusCapture={e => setValueFocusUrl(true)}
                            onBlur={e => setValueFocusUrl(false)}
                            //inputProps={{ pattern: '[0-9a-zA-Z\.:/]*' }}
                            // 値が変わるたびに、このコンポーネントのステート 'value' に代入
                            value={valueUrl}
                            onChange={e => setValueUrl(e.currentTarget.value)}
                        />
                    </Grid>
                </Grid>
                <Collapse in={valueFocusUrl || valueMouseOnForm} collapsedSize={10}>
                {/* <Slide direction="down" in={valueVisible} mountOnEnter unmountOnExit> */}
                    <FormControl fullWidth>
                        <InputPosForPiledUp />
                        <Button 
                            type="submit"
                            fullWidth 
                            variant="contained"
                            sx={{mt: 1, mb: 0}}
                            //size='large'
                        >
                            積む
                        </Button>
                    </FormControl>
                {/* </Slide> */}
                </Collapse>
            </Box>
    );
}

export default Form