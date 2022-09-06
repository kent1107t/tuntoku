import React, {useEffect, useState} from "react";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
//import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { render } from "@testing-library/react";
import DoneIcon from '@mui/icons-material/Done';
import ScheduleIcon from '@mui/icons-material/Schedule';
//import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { Link } from '@mui/material';
//import { url } from "inspector";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
// jsonファイルの読み込み 参考 : https://www.i-ryo.com/entry/2020/11/20/081558
import TitleAndStatementOfAllProblem from '../scraper/title_and_statement_of_all_problem.json';
//import TitleAndStatementOfAllProblem from '../scraper/test_title_and_statement_of_all_problem.json';

type ProblemStatement = {text: string, isFormula: boolean}[];
type InfoOfProblem = {title: string, problemStatement: ProblemStatement};
const titleAndStatementOfAllProblem = TitleAndStatementOfAllProblem as {[url: string]: InfoOfProblem};
//const titleAndStatementOfAllProblem : {[url: string]: {title: string, problemStatement: {text: string, isFormula: boolean}[]}} = TitleAndStatementOfAllProblem;


function isUrl(suspect: string) : boolean {
    /* URLかどうかを判定する 参考 → https://www.megasoft.co.jp/mifes/seiki/s310.html */
    return new RegExp('https?://[\\w/:%#\\$&\\?\\(\\)~\\.=\\+\\-]+').test(suspect);
}
function LinkFormatted(urlOrNot: string) {
    /* 問題のタイトルが特定できれば表示テキストをそのタイトルにし、また、URLであればリンクを有効にして返す */
    const displayText: string = !(urlOrNot in titleAndStatementOfAllProblem) ? urlOrNot : titleAndStatementOfAllProblem[urlOrNot].title
    if (isUrl(urlOrNot))  // 有効にしたリンクを返す
        return <Link href={urlOrNot} color="inherit" underline="hover" target="_blank" rel="noopener noreferrer"> {displayText} </Link>
    else                  // 無効化したリンクを返す
        return <Link tabIndex={-1} color="inherit" underline="hover" rel="noopener noreferrer"> {displayText} </Link>;
}

const DescriptionProblem: React.FC<{urlOrNot: string}> = (props) => {
    const urlOrNot: string = props.urlOrNot;
    /* 問題のリンクとしてデータがあれば、その問題文を返す */
    if (!(urlOrNot in titleAndStatementOfAllProblem))  return <Typography variant="subtitle2">問題を特定できませんでした。</Typography>;
    return getTextWithFormula(urlOrNot, titleAndStatementOfAllProblem[urlOrNot].problemStatement);
}

function getTextWithFormula(url: string, problemStatement: ProblemStatement) {
    /* 数式の部分かどうかで分けた文章のグループの配列を、それぞれ数式部分は数式表示にして返す */
    // ここの値自体が変わることはない（問題文のなので）からどこを再renderするかのためのkeyはなくても困ることは無いはずだけど、一応つけておく
    // 参考 : https://qiita.com/koba04/items/a4d23245d246c53cd49d
    return (<Typography variant="subtitle2">
            {problemStatement.map(({text, isFormula}, index) => (
                isFormula ? <InlineMath key={url+index}>{text}</InlineMath> : <span key={url+index}>{text}</span>
                ))}
           </Typography>
    );
}


export type Problem = { url: string }
type Props = {
    groupName: string
    problems: Problem[]
    handleSolve: (url: string, groupName: string) => void
    handleLater: (url: string, groupName: string) => void
    handleDelete: (url: string, groupName: string) => void
}
export function ProblemCards({ problems, groupName, handleSolve, handleLater, handleDelete } : Props) {
    return (
        <Container sx={{ py: 5 }} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={3}>
                {/* 各カードの部分 */}
                {problems.map((problem) => (
                    //<Grid item key={problem.url} xs={1} sm={6} md={4}>
                    // このxsは12列の内、一つのカードが何列を占めるかを表してる(xs={3}の場合12/3=4で一つの行に4つのカードが並ぶ)
                    <Grid item key={problem.url} xs={6} justifyContent='space-around'>
                        <Card
                            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {LinkFormatted(problem.url)}
                                </Typography>
                                <DescriptionProblem urlOrNot={problem.url} />
                            </CardContent>
                            <CardActions sx={{align: 'center'}}>
                                <Grid container justifyContent='space-around'>
                                    <Grid item xs={4}>
                                        <Button 
                                            size="small" 
                                            onClick={() => handleSolve(problem.url, groupName)}
                                            endIcon={<DoneIcon />}
                                        >
                                            SOLVED
                                        </Button>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Button 
                                            size="small" 
                                            onClick={() => handleLater(problem.url, groupName)} 
                                            color="secondary"
                                            endIcon={<ScheduleIcon />}
                                        >
                                            LATER
                                        </Button>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Button 
                                            size="small" 
                                            onClick={() => handleDelete(problem.url, groupName)} 
                                            color="error" 
                                            endIcon={<DeleteOutlineIcon />}
                                        >
                                            DELETE
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export default ProblemCards;