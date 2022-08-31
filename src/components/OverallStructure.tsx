import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function OverallStructure(madeForm: React.ReactNode, madeProblemCards: React.ReactNode) {
//function OverallStructure() {  
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
                {/* 
                <TextPrimary />
                */}
                <TextSecondary />
                {/* 入力フォーム 
                */}
                {madeForm}
                </Container>
            </Box>
            
            {/* 問題のカードたち */}
            {/*<ProblemCards groupName={currentGroupName} problems={groupName2problems[currentGroupName]} handleRemove={removeProblem} />
            */}
            {madeProblemCards}
            </main>
            {/* Footer */}
            <Footer />
            {/* End footer */}
        </ThemeProvider>
    );
}


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

export default OverallStructure;