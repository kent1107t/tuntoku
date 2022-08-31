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


function isUrl(suspect: string) : boolean {
    // URLかどうかを判定する 参考↓
    // https://www.megasoft.co.jp/mifes/seiki/s310.html
    const pattern = new RegExp('https?://[\\w/:%#\\$&\\?\\(\\)~\\.=\\+\\-]+');
    return pattern.test(suspect);
}

function LinkFormatted(urlOrNot: string) {
    // URLであればリンクを有効にして返す
    if (isUrl(urlOrNot))
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


export type Problem = {
    url: string
}
type Props = { 
    groupName: string
    problems: Problem[]
    handleSolve: (url: string, groupName: string) => void
    handleDelete: (url: string, groupName: string) => void
 }

export const ProblemCards: React.FC<Props> = ({ problems, groupName, handleSolve, handleDelete }) => {
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
                                <Typography>
                                    説明文
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => handleSolve(problem.url, groupName)}>
                                    SOLVED
                                </Button>
                                <Button size="small" color="secondary">
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