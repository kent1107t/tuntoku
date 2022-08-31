import React, {useState} from "react";
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
import { Link } from "@mui/material";
import TitleAndStatementOfAllProblem from '../scraper/title_and_statement_of_all_problem.json';
//import { url } from "inspector";

// 参考 : https://www.i-ryo.com/entry/2020/11/20/081558
const titleAndStatementOfAllProblem: {[url: string]: {title: string, problemStatement: string}} = TitleAndStatementOfAllProblem;

function isUrl(suspect: string) : boolean {
    // URLかどうかを判定する 参考↓
    // https://www.megasoft.co.jp/mifes/seiki/s310.html
    const pattern = new RegExp('https?://[\\w/:%#\\$&\\?\\(\\)~\\.=\\+\\-]+');
    //if (suspect in titleAndStatementOfAllProblem)  return true;
    return pattern.test(suspect);
}

function LinkFormatted(urlOrNot: string) {
    /* URLであればリンクを有効にして返す */
    if (urlOrNot in titleAndStatementOfAllProblem)
        return (
            <Link href={urlOrNot} color="inherit" underline="hover" target="_blank" rel="noopener noreferrer">
                {titleAndStatementOfAllProblem[urlOrNot].title}
            </Link>
        )
    else if (isUrl(urlOrNot))
        return (
            <Link href={urlOrNot} color="inherit" underline="hover" target="_blank" rel="noopener noreferrer">
                {urlOrNot}
            </Link>
        );
    else
        return (
            <Link tabIndex={-1} color="inherit" underline="hover" target="_blank" rel="noopener noreferrer">
                {urlOrNot}
            </Link>
        );
}

function DescriptionProblem(urlOrNot: string) {
    /* 問題のリンクとしてデータがあれば、その問題文を返す */
    if (urlOrNot in titleAndStatementOfAllProblem)
        return (<Typography>
            {titleAndStatementOfAllProblem[urlOrNot].problemStatement}
            </Typography>);
    else
        return (<Typography>
            問題のURLは見つかりませんでした
        </Typography>);
}


export type Problem = {
    url: string
}
type Props = { 
    groupName: string
    problems: Problem[]
    handleSolve: (url: string, groupName: string) => void
    handleLater: (url: string, groupName: string) => void
    handleDelete: (url: string, groupName: string) => void
 }

export const ProblemCards: React.FC<Props> = ({ problems, groupName, handleSolve, handleLater, handleDelete }) => {
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