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
import { Link } from '@mui/material';
//import { url } from "inspector";
import { MathJax, MathJaxContext } from 'better-react-mathjax';
// jsonファイルの読み込み 参考 : https://www.i-ryo.com/entry/2020/11/20/081558
import TitleAndStatementOfAllProblem from '../scraper/title_and_statement_of_all_problem.json';
//import TitleAndStatementOfAllProblem from '../scraper/test_title_and_statement_of_all_problem.json';

//const titleAndStatementOfAllProblem: {[url: string]: {title: string, problemStatement: string, problemStatementWithTag: string}} = TitleAndStatementOfAllProblem;
const titleAndStatementOfAllProblem = TitleAndStatementOfAllProblem as  {[url: string]: {title: string, problemStatement: string, problemStatementWithTag: string}};

export type Problem = { url: string }
type Props = { 
    groupName: string
    problems: Problem[]
    handleSolve: (url: string, groupName: string) => void
    handleLater: (url: string, groupName: string) => void
    handleDelete: (url: string, groupName: string) => void
}
export function ProblemCards({ problems, groupName, handleSolve, handleLater, handleDelete } : Props) {
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

    function DescriptionProblem(urlOrNot: string) {
        /* 問題のリンクとしてデータがあれば、その問題文を返す */
        /* 例
        statement = "\\(\\frac{10}{4x} \\approx 2^{12}\\)";  // ok
        statement = 'XはN以上である。非負整数(a,b)の組であって、\\(X=a^{3}+a^{2}b+ab^{2}+b^{3}を満たすようなものが存在する。'; // ok
        https://www-npmjs-com.translate.goog/package/better-react-mathjax?_x_tr_sl=en&_x_tr_tl=ja&_x_tr_hl=ja&_x_tr_pto=op,sc
        */
        if (!(urlOrNot in titleAndStatementOfAllProblem))  return <Typography component={'span'}>問題を特定できませんでした。</Typography>
        return (<Typography component={'span'}>{TextInFormula(titleAndStatementOfAllProblem[urlOrNot].problemStatement)}</Typography>);
    }
    function TextInFormula(text: string) {
        /* 数式表示にして返す */
        return <MathJaxContext><MathJax>
            {text}
        </MathJax></MathJaxContext>
    }

    return (
        <Container sx={{ py: 8 }} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={4}>
                {/* 各カードの部分 */}
                {problems.map((problem) => (
                    <Grid item key={problem.url} xs={12} sm={6} md={4}>
                        <Card
                            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {LinkFormatted(problem.url)}
                                </Typography>
                                {DescriptionProblem(problem.url)}
                                {/*
                                <Typography>
                                    {DescriptionProblem(problem.url)}
                                </Typography>
                                */}
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => handleSolve(problem.url, groupName)}>
                                    SOLVED
                                </Button>
                                <Button size="small" onClick={() => handleLater(problem.url, groupName)} color="secondary">
                                    LATER
                                </Button>
                                <Button size="small" onClick={() => handleDelete(problem.url, groupName)} color="error">
                                    DELETE
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export default ProblemCards;