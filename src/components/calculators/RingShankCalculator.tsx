import * as React from 'react';
import {
    Button,
    Card,
    CardContent,
    FormControl,
    FormLabel,
    Grid2,
    Input,
    MenuItem,
    Select,
    Typography
} from "@mui/material";

const innerDiameters:number[] = [12.37, 12.78, 13.21, 13.61, 14.05, 14.45, 14.90, 15.26, 15.70, 16.10, 16.51, 16.92, 17.35, 17.75, 18.19, 18.59, 19.00, 19.41, 19.82, 20.24, 20.68, 21.08, 21.49, 21.79, 22.22, 22.61, 23.01, 23.42];
let startSize:number = 1;
let startDiameter:number = 0;
const endSize:number = 14.5;


const ringSizeMap = new Map<number, number>();
while(ringSizeMap.size < endSize * 2) {
    ringSizeMap.set(startSize, innerDiameters[startDiameter]);
    startDiameter++;
    startSize += .5;
}

const RingShankCalculator:React.FC = () => {
    const [size, setSize] = React.useState<number>(7);
    const [thickness, setThickness] = React.useState<string>('');
    const [width, setWidth] = React.useState<string>('');
    const [cutLength, setCutLength] = React.useState<string>('');
    const handleCalculate = () => {
        // [inner diameter + metal thickness] x 3.1416 (pi) = correct blank length (add 0.5mm if over 4mm wide)
        const innerDiameter = ringSizeMap.get(size);
        if(thickness && width && innerDiameter) {
            const adjustment = +width > 4 ? .5 : 0;
            setCutLength(`${Math.round(((+innerDiameter + +thickness) * Math.PI) * 100) / 100 + adjustment}`);
        }
    }
    return (
        <Card>
            <CardContent>
                <Grid2 container spacing={4}>
                    <Grid2 size={12}><Typography variant="h4" component="h2">Ring Shank Calculator</Typography></Grid2>
                    <Grid2 container spacing={4} direction="row"  sx={{alignItems: 'center'}}>
                        <Grid2>
                            <FormControl>
                                <FormLabel id="sizeLabel">Ring Size</FormLabel>
                                <Select
                                    variant="standard"
                                    labelId="sizeLabel"
                                    id="size"
                                    value={size}
                                    label="Age"
                                    onChange={(e) => setSize(+e.target.value)}
                                >
                                    {Array.from(ringSizeMap.entries()).map(([key, value]) => (
                                        <MenuItem key={`${value}`} value={`${key}`}>{key}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid2>
                        <Grid2>
                            <FormControl>
                                <FormLabel>Metal Thickness (mm)</FormLabel>
                                <Input
                                    name="thickness"
                                    type="number"
                                    value={thickness}
                                    onChange={(e) => setThickness(e.target.value)}
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2>
                            <FormControl>
                                <FormLabel>Ring Width (mm)</FormLabel>
                                <Input
                                    name="width"
                                    type="number"
                                    value={width}
                                    onChange={(e) => setWidth(e.target.value)}
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2>
                            <Button variant='contained' onClick={handleCalculate}>Calculate</Button>
                        </Grid2>

                    </Grid2>
                    <Grid2 size={12}>
                        {cutLength &&
											    <Typography color='primary' variant='h6' component='p'>You should cut {cutLength} mm.</Typography>
                        }
                    </Grid2>

                </Grid2>

            </CardContent>
        </Card>
    )
}

export default RingShankCalculator;