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


export type Problem = {
    url: string
}

type Props = { 
    groupName: string
    problems: Problem[]
    handleRemove: (groupName: string, url: string) => void
 }

export const ProblemCards: React.FC<Props> = ({ problems, groupName, handleRemove }) => {
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
                                    {problem.url}
                                </Typography>
                                <Typography>
                                    説明文
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">View</Button>
                                <Button
                                    size="small"
                                    onClick={() => handleRemove(groupName, problem.url)}
                                >
                                    削除
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