import { Component, useState } from 'react';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Form from './Form';
import {Problem, ProblemCards} from './ProblemCards';
import { group } from 'console';


function BarTitle() {
  return (
    <AppBar position="relative">
      {/* 上部のバー */}
      <Toolbar>
        {/* 
        <CameraIcon sx={{ mr: 2 }} />
        */}
        <Typography variant="h6" color="inherit" noWrap>
          {document.title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
function TextPrimary() {
  return (
    <Typography
      component="h1"
      variant="h2"
      align="center"
      color="text.primary"
      gutterBottom
    >
      {document.title}
    </Typography>
  );
}
function TextSecondary() {
  return (
    <Typography variant="h5" align="center" color="text.secondary" paragraph>
      URLを入力してエンターを押すと、その問題を積んでおきます。
    </Typography>
  );
}
function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
function Footer() {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
      <Typography variant="h6" align="center" gutterBottom>
        Footer
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        component="p"
      >
        Something here to give the footer a purpose!
      </Typography>
      <Copyright />
    </Box>
  );
}


const theme = createTheme();
const initialGroupName: string = "Initial Group";

export default function App() {
  const [currentGroupName, setCurrentGroupName] = useState<string>(initialGroupName);
  const [groupName2problems, setGroupName2Problems] = useState<{[GroupName: string]: Problem[]}>({[initialGroupName]: []});
  //const [ProblemCards, setProblemCards] = useState<ProblemCards[]>([]);
  //const [ProblemCardsReal, setProblemCardsReal] = useState<React.FC>(ProblemCards);


  const pileUpProblem = (urlForPiledUp: string) => {   
    //  Form の submit 関数が走るときに、その入力値を引数としてこの関数が呼ばれるようになってる
    // まず、今回追加する単体のProblemを作る
    const problemForPiledUp: Problem = {url: urlForPiledUp};
    // 今のグループのリストに、今回の問題を追加する
    // 今あるオブジェクトを展開し、↓でcurrentGroupNameの部分だけ新しい値をセット(キー名の部分を[]で囲まないと変数名がそのままキーになるので注意)
    // セットする新しい値も、今ある配列を展開して、それに追加する形で今回の問題を後ろにつける
    setGroupName2Problems({ ...groupName2problems,  
      [currentGroupName]: [ ...groupName2problems[currentGroupName], problemForPiledUp ] });
    return;
  }


  /*
  const handleRemove = (i: number) => {
    setProblems(
      urls.filter((url, index) => (index !== i))
    );
  }
  */

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BarTitle />
      <main>
        {/* 本体のところ Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            {/* 表紙みたいなところ */}
            <TextPrimary />
            <TextSecondary />
            {/* 入力フォーム */}
            <Form pileUpProblem={pileUpProblem} />
          </Container>
        </Box>
        
        {/* 問題のカードたち */}
        <ProblemCards groupName={currentGroupName} problems={groupName2problems[currentGroupName]} />
      </main>
      {/* Footer */}
      <Footer />
      {/* End footer */}
    </ThemeProvider>
  );
}