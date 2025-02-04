import {Grid2, Typography} from "@mui/material";
import RingShankCalculator from "./RingShankCalculator.tsx";



const Calculators = () => {
    return (
        <Grid2 container spacing={4} direction="column" size={12}>
            <Grid2><Typography variant="h2" component="h1">Calculators</Typography></Grid2>
            <Grid2 container spacing={4} direction="column" size={{ xs: 12, sm: 6 }}>
                <RingShankCalculator/>
            </Grid2>

        </Grid2>
    )
}

export default Calculators;