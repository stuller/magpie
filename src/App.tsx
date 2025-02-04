import {Authenticator} from "@aws-amplify/ui-react";
import { Amplify,  } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import { type Schema } from "../amplify/data/resource";
import SupplyList from "./components/supplies/SupplyList.tsx";
import {Grid2} from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Nav from "./components/Nav.tsx";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Calculators from "./components/calculators/Calculators.tsx";
import Projects from "./components/projects/Projects.tsx";
import Project from "./components/projects/Project.tsx";
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);
const client = generateClient<Schema>({
    authMode: "userPool",
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export default function App() {
    return (
        <Authenticator>

            {({ signOut }) => (
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline />

                    <Grid2 container direction="row" sx={{maxWidth: '1600px', margin: '2em'}}>
                        <Grid2 size={3} sx={{
                            display: { xs: 'none', sm: 'block' },
                        }}>
                            <Nav signOut={() => signOut}/>
                        </Grid2>
                        <Grid2
                            container
                            className="App"
                            justifyContent="center"
                            alignItems="center"
                            direction="column"
                            spacing={4}
                            size={{ xs: 12, sm: 9 }}
                            sx={{marginTop: '4em'}}
                        >
                            <Router>
                                <Routes>
                                    <Route path="/supplies" element={<SupplyList client={client}/>} />
                                </Routes>
                                <Routes>
                                    <Route path="/calculators" element={<Calculators/>} />
                                </Routes>
                                <Routes>
                                    <Route path="/projects" element={<Projects client={client}/>} />
                                </Routes>
                                <Routes>
                                    <Route path="/project/:id?" element={<Project client={client}/>} />
                                </Routes>
                            </Router>


                        </Grid2>
                    </Grid2>
                </ThemeProvider>
            )}

        </Authenticator>
    );
}